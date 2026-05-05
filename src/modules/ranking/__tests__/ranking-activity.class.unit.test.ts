import { describe, expect, it } from "@jest/globals";
import { Forecast } from "../../../shared/schemas";
import { Activity } from "../ranking-activity.class";
import { RankingActivity } from "../ranking-activities.enum";

type HourSample = {
  temperature_2m: number;
  wind_speed_10m: number;
  rain: number;
  visibility: number;
};

function buildForecast(samples: HourSample[]): Forecast {
  const n = samples.length;
  const pick = <K extends keyof HourSample>(key: K) =>
    samples.map((row) => row[key]);

  return {
    latitude: 0,
    longitude: 0,
    generationtime_ms: 0,
    utc_offset_seconds: 0,
    timezone: "UTC",
    timezone_abbreviation: "UTC",
    elevation: 0,
    hourly_units: {
      temperature_2m: "°C",
      temperature_2m_max: "°C",
      temperature_2m_min: "°C",
      wind_speed_10m_max: "km/h",
      rain_sum: "mm",
      showers_sum: "mm",
      snowfall_sum: "cm",
      wind_gusts_10m_max: "km/h",
    },
    hourly: {
      time: Array.from({ length: n }, (_, i) => i),
      temperature_2m: pick("temperature_2m"),
      temperature_2m_max: pick("temperature_2m"),
      temperature_2m_min: pick("temperature_2m"),
      wind_speed_10m_max: pick("wind_speed_10m"),
      rain_sum: Array(n).fill(0),
      showers_sum: Array(n).fill(0),
      snowfall_sum: Array(n).fill(0),
      wind_gusts_10m_max: pick("wind_speed_10m"),
      visibility: pick("visibility"),
      snowfall: Array(n).fill(0),
      rain: pick("rain"),
      wind_speed_10m: pick("wind_speed_10m"),
    },
  };
}

function surfingLikeActivity(): Activity {
  return new Activity(
    RankingActivity.SURFING,
    15,
    28,
    5,
    20,
    0,
    2,
    5,
  );
}

describe("Activity", () => {
  describe("isMoreOrEqualThan", () => {
    it("returns true when the threshold is null", () => {
      const activity = surfingLikeActivity();
      expect(activity.isMoreOrEqualThan(0, null)).toBe(true);
      expect(activity.isMoreOrEqualThan(-100, null)).toBe(true);
    });

    it("returns true when the value meets or exceeds the threshold", () => {
      const activity = surfingLikeActivity();
      expect(activity.isMoreOrEqualThan(5, 5)).toBe(true);
      expect(activity.isMoreOrEqualThan(10, 5)).toBe(true);
    });

    it("returns false when the value is below the threshold", () => {
      const activity = surfingLikeActivity();
      expect(activity.isMoreOrEqualThan(4, 5)).toBe(false);
    });
  });

  describe("checkMinMaxValue", () => {
    it("returns true when either bound is null", () => {
      const activity = surfingLikeActivity();
      expect(activity.checkMinMaxValue(999, null, 10)).toBe(true);
      expect(activity.checkMinMaxValue(-999, 0, null)).toBe(true);
      expect(activity.checkMinMaxValue(50, null, null)).toBe(true);
    });

    it("returns true only when the value lies inside the closed interval", () => {
      const activity = surfingLikeActivity();
      expect(activity.checkMinMaxValue(10, 10, 20)).toBe(true);
      expect(activity.checkMinMaxValue(20, 10, 20)).toBe(true);
      expect(activity.checkMinMaxValue(15, 10, 20)).toBe(true);
      expect(activity.checkMinMaxValue(9, 10, 20)).toBe(false);
      expect(activity.checkMinMaxValue(21, 10, 20)).toBe(false);
    });
  });

  describe("calculateScore", () => {
    it("returns zero when there are no hourly entries", () => {
      const activity = surfingLikeActivity();
      expect(activity.calculateScore(buildForecast([]))).toBe(0);
    });

    it("counts an hour when temperature, wind, rain, and visibility all satisfy constraints", () => {
      const activity = surfingLikeActivity();
      const forecast = buildForecast([
        {
          temperature_2m: 20,
          wind_speed_10m: 10,
          rain: 1,
          visibility: 10,
        },
      ]);
      expect(activity.calculateScore(forecast)).toBe(1);
    });

    it("sums matching hours across the series", () => {
      const activity = surfingLikeActivity();
      const good: HourSample = {
        temperature_2m: 20,
        wind_speed_10m: 10,
        rain: 1,
        visibility: 10,
      };
      const forecast = buildForecast([good, good, good]);
      expect(activity.calculateScore(forecast)).toBe(3);
    });

    it("skips an hour when temperature is outside the allowed range", () => {
      const activity = surfingLikeActivity();
      const forecast = buildForecast([
        {
          temperature_2m: 14,
          wind_speed_10m: 10,
          rain: 1,
          visibility: 10,
        },
      ]);
      expect(activity.calculateScore(forecast)).toBe(0);
    });

    it("skips an hour when visibility is below the minimum", () => {
      const activity = surfingLikeActivity();
      const forecast = buildForecast([
        {
          temperature_2m: 20,
          wind_speed_10m: 10,
          rain: 1,
          visibility: 4,
        },
      ]);
      expect(activity.calculateScore(forecast)).toBe(0);
    });

    it("skips an hour when wind is outside the allowed range", () => {
      const activity = surfingLikeActivity();
      const forecast = buildForecast([
        {
          temperature_2m: 20,
          wind_speed_10m: 4,
          rain: 1,
          visibility: 10,
        },
      ]);
      expect(activity.calculateScore(forecast)).toBe(0);
    });

    it("skips an hour when rain is outside the allowed range", () => {
      const activity = surfingLikeActivity();
      const forecast = buildForecast([
        {
          temperature_2m: 20,
          wind_speed_10m: 10,
          rain: 3,
          visibility: 10,
        },
      ]);
      expect(activity.calculateScore(forecast)).toBe(0);
    });

    it("counts only the hours that pass all checks", () => {
      const activity = surfingLikeActivity();
      const forecast = buildForecast([
        {
          temperature_2m: 20,
          wind_speed_10m: 10,
          rain: 1,
          visibility: 10,
        },
        {
          temperature_2m: 30,
          wind_speed_10m: 10,
          rain: 1,
          visibility: 10,
        },
        {
          temperature_2m: 22,
          wind_speed_10m: 12,
          rain: 0,
          visibility: 8,
        },
      ]);
      expect(activity.calculateScore(forecast)).toBe(2);
    });
  });
});
