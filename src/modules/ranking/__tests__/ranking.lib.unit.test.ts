import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { OpenMeteoHttpClient } from "../../../shared/http/integrations/open-meteo-http-client";
import { Forecast } from "../../../shared/schemas";
import { RankingLib } from "../ranking.lib";
import { RankingActivity } from "../ranking-activities.enum";

function mockForecast(
  count: number,
  sample: {
    temperature_2m: number;
    wind_speed_10m: number;
    rain: number;
    visibility: number;
  },
): Forecast {
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

describe("RankingLib", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("loads forecast via OpenMeteoHttpClient.getForecast and returns ranked activity names", async () => {
    const longitude = -0.1278;
    const latitude = 51.5074;
    const forecast = mockForecast(2, {
      temperature_2m: 22,
      wind_speed_10m: 10,
      rain: 1,
      visibility: 10,
    });

    const getForecastSpy = jest
      .spyOn(OpenMeteoHttpClient.prototype, "getForecast")
      .mockResolvedValue(forecast);

    const result = await RankingLib.getRanking(longitude, latitude);

    expect(getForecastSpy).toHaveBeenCalledTimes(1);
    expect(getForecastSpy).toHaveBeenCalledWith(longitude, latitude);
    expect(result).toEqual({
      activities: [
        RankingActivity.SURFING,
        RankingActivity.SIGHTSEEING_OUTDOORS,
        RankingActivity.SIGHTSEEING_INDOOR,
        RankingActivity.SKIING,
      ],
    });
  });

  it("maps a different mocked forecast to the corresponding ranking order", async () => {
    const forecast = mockForecast(1, {
      temperature_2m: -5,
      wind_speed_10m: 8,
      rain: 0,
      visibility: 12,
    });

    jest
      .spyOn(OpenMeteoHttpClient.prototype, "getForecast")
      .mockResolvedValue(forecast);

    const result = await RankingLib.getRanking(0, 60);

    expect(result).toEqual({
      activities: [
        RankingActivity.SIGHTSEEING_INDOOR,
        RankingActivity.SKIING,
        RankingActivity.SURFING,
        RankingActivity.SIGHTSEEING_OUTDOORS,
      ],
    });
  });
});
