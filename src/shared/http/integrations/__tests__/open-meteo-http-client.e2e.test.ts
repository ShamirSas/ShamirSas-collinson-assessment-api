import { describe, expect, it } from "@jest/globals";
import { OpenMeteoHttpClient } from "../open-meteo-http-client";

describe("OpenMeteoHttpClient (e2e)", () => {
  jest.setTimeout(20_000);

  it("getForecast returns hourly forecast data from the Open-Meteo API for the requested coordinates", async () => {
    const longitude = -0.1278;
    const latitude = 51.5074;
    const client = new OpenMeteoHttpClient();

    const forecast = await client.getForecast(longitude, latitude);

    expect(forecast.latitude).toBeCloseTo(latitude, 0);
    expect(forecast.longitude).toBeCloseTo(longitude, 0);
    expect(forecast.timezone).toBeTruthy();
    expect(typeof forecast.generationtime_ms).toBe("number");
    expect(typeof forecast.utc_offset_seconds).toBe("number");
    expect(typeof forecast.elevation).toBe("number");

    const { hourly } = forecast;
    const hourCount = hourly.time.length;
    expect(hourCount).toBeGreaterThan(0);

    expect(hourly.temperature_2m).toHaveLength(hourCount);
    expect(hourly.visibility).toHaveLength(hourCount);
    expect(hourly.rain).toHaveLength(hourCount);
    expect(hourly.wind_speed_10m).toHaveLength(hourCount);
    expect(hourly.snowfall).toHaveLength(hourCount);

    expect(Number.isFinite(hourly.temperature_2m[0])).toBe(true);
    expect(Number.isFinite(hourly.wind_speed_10m[0])).toBe(true);
    expect(Number.isFinite(hourly.visibility[0])).toBe(true);

    const hourlyUnits = forecast.hourly_units as Record<string, string | undefined>;
    expect(hourlyUnits.temperature_2m).toBeTruthy();
    expect(hourlyUnits.visibility).toBeTruthy();
    expect(hourlyUnits.rain).toBeTruthy();
    expect(hourlyUnits.wind_speed_10m).toBeTruthy();
    expect(hourlyUnits.snowfall).toBeTruthy();
  });
});
