import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { RankingActivity } from "../../ranking";
import { QueryResolver } from "../query.resolver";

function mockForecast(
  count: number,
  sample: {
    temperature_2m: number;
    wind_speed_10m: number;
    rain: number;
    visibility: number;
  },
) {
  const repeat = <T>(value: T) => Array.from({ length: count }, () => value);

  return {
    latitude: 51.5,
    longitude: -0.12,
    generationtime_ms: 0,
    utc_offset_seconds: 0,
    timezone: "Europe/London",
    timezone_abbreviation: "GMT",
    elevation: 10,
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
      time: Array.from({ length: count }, (_, i) => i),
      temperature_2m: repeat(sample.temperature_2m),
      temperature_2m_max: repeat(sample.temperature_2m),
      temperature_2m_min: repeat(sample.temperature_2m),
      wind_speed_10m_max: repeat(sample.wind_speed_10m),
      rain_sum: repeat(0),
      showers_sum: repeat(0),
      snowfall_sum: repeat(0),
      wind_gusts_10m_max: repeat(sample.wind_speed_10m),
      visibility: repeat(sample.visibility),
      snowfall: repeat(0),
      rain: repeat(sample.rain),
      wind_speed_10m: repeat(sample.wind_speed_10m),
    },
  };
}

describe("QueryResolver", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns locations for getLocations and uses mocked fetch response", async () => {
    const payload = {
      results: [
        {
          admin1_id: "1",
          admin1: "England",
          admin2_id: "2",
          admin2: "Greater London",
          admin3_id: "3",
          admin3: "London",
          country_code: "GB",
          country_id: "4",
          country: "United Kingdom",
          elevation: 11,
          feature_code: "PPLC",
          id: "5",
          latitude: 51.5072,
          longitude: -0.1276,
          name: "London",
          timezone: "Europe/London",
        },
      ],
    };
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      json: async () => payload,
    } as Response);

    const resolver = new QueryResolver();
    const result = await resolver.getLocations(null, { name: "London" });

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://geocoding-api.open-meteo.com/v1/search?name=London",
      { method: "GET" },
    );
    expect(result).toEqual({
      locations: payload.results,
    });
  });

  it("returns ranked activities for getRanking and uses mocked fetch response", async () => {
    const longitude = -0.1278;
    const latitude = 51.5074;
    const payload = mockForecast(2, {
      temperature_2m: 22,
      wind_speed_10m: 10,
      rain: 1,
      visibility: 10,
    });
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      json: async () => payload,
    } as Response);

    const resolver = new QueryResolver();
    const result = await resolver.getRanking(null, { longitude, latitude, timezone: "UTC" });

    expect(fetchSpy).toHaveBeenCalledWith(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&&hourly=temperature_2m,visibility,snowfall,rain,wind_speed_10m&timezone=auto&format=json&timeformat=unixtime`,
      { method: "GET" },
    );
    expect(result).toEqual({
      activities: [
        RankingActivity.SURFING,
        RankingActivity.SIGHTSEEING_OUTDOORS,
        RankingActivity.SIGHTSEEING_INDOOR,
        RankingActivity.SKIING,
      ],
    });
  });
});
