import { describe, expect, it } from "@jest/globals";
import { Forecast } from "../../../shared/schemas";
import { RankingActivities } from "../ranking-activities.class";
import { RankingActivity } from "../ranking-activities.enum";

function buildHourly(
  count: number,
  sample: {
    temperature_2m: number;
    wind_speed_10m: number;
    rain: number;
    visibility: number;
  },
): Forecast["hourly"] {
  const repeat = <T>(value: T) => Array.from({ length: count }, () => value);
  return {
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
  };
}

function forecastWithHourly(hourly: Forecast["hourly"]): Forecast {
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
    hourly,
  };
}

describe("RankingActivities", () => {
  it("returns all four activity names sorted by descending hourly match count", () => {
    const hourly = buildHourly(3, {
      temperature_2m: 22,
      wind_speed_10m: 10,
      rain: 1,
      visibility: 10,
    });
    const ranking = RankingActivities.getRankingActivitiesByForecast(
      forecastWithHourly(hourly),
    );

    expect(ranking).toHaveLength(4);
    expect(ranking).toEqual([
      RankingActivity.SURFING,
      RankingActivity.SIGHTSEEING_OUTDOORS,
      RankingActivity.SIGHTSEEING_INDOOR,
      RankingActivity.SKIING,
    ]);
  });

  it("ranks sightseeing indoor with skiing ahead of summer activities on cold, calm days", () => {
    const hourly = buildHourly(2, {
      temperature_2m: -5,
      wind_speed_10m: 8,
      rain: 0,
      visibility: 12,
    });
    const ranking = RankingActivities.getRankingActivitiesByForecast(
      forecastWithHourly(hourly),
    );

    expect(ranking).toEqual([
      RankingActivity.SIGHTSEEING_INDOOR,
      RankingActivity.SKIING,
      RankingActivity.SURFING,
      RankingActivity.SIGHTSEEING_OUTDOORS,
    ]);
  });

  it("drops surfing below outdoor sightseeing when wind is below the surfing minimum", () => {
    const hourly = buildHourly(4, {
      temperature_2m: 20,
      wind_speed_10m: 3,
      rain: 0,
      visibility: 15,
    });
    const ranking = RankingActivities.getRankingActivitiesByForecast(
      forecastWithHourly(hourly),
    );

    expect(ranking).toEqual([
      RankingActivity.SIGHTSEEING_OUTDOORS,
      RankingActivity.SIGHTSEEING_INDOOR,
      RankingActivity.SURFING,
      RankingActivity.SKIING,
    ]);
  });

  it("prefers surfing over outdoor sightseeing when wind is strong enough for surf but too high for walking", () => {
    const hourly = buildHourly(1, {
      temperature_2m: 22,
      wind_speed_10m: 18,
      rain: 1,
      visibility: 12,
    });
    const ranking = RankingActivities.getRankingActivitiesByForecast(
      forecastWithHourly(hourly),
    );

    expect(ranking).toEqual([
      RankingActivity.SURFING,
      RankingActivity.SIGHTSEEING_INDOOR,
      RankingActivity.SIGHTSEEING_OUTDOORS,
      RankingActivity.SKIING,
    ]);
  });

  it("returns the insertion order when every activity scores zero hours", () => {
    const hourly = buildHourly(0, {
      temperature_2m: 0,
      wind_speed_10m: 0,
      rain: 0,
      visibility: 0,
    });
    const ranking = RankingActivities.getRankingActivitiesByForecast(
      forecastWithHourly(hourly),
    );

    expect(ranking).toEqual([
      RankingActivity.SURFING,
      RankingActivity.SIGHTSEEING_OUTDOORS,
      RankingActivity.SIGHTSEEING_INDOOR,
      RankingActivity.SKIING,
    ]);
  });
});
