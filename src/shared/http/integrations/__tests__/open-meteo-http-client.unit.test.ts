import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { Forecast } from "../../../schemas";
import { OpenMeteoHttpClient } from "../open-meteo-http-client";

function expectedForecastUrl(longitude: number, latitude: number): string {
  return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&&hourly=temperature_2m,visibility,snowfall,rain,wind_speed_10m&timezone=auto&format=json&timeformat=unixtime`;
}

function sampleForecast(): Forecast {
  return {
    latitude: -33.9249,
    longitude: 18.4241,
    generationtime_ms: 1.2,
    utc_offset_seconds: 7200,
    timezone: "Africa/Johannesburg",
    timezone_abbreviation: "SAST",
    elevation: 25,
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
      time: [1700000000],
      temperature_2m: [22],
      temperature_2m_max: [24],
      temperature_2m_min: [18],
      wind_speed_10m_max: [30],
      rain_sum: [0],
      showers_sum: [0],
      snowfall_sum: [0],
      wind_gusts_10m_max: [40],
      visibility: [10000],
      snowfall: [0],
      rain: [0],
      wind_speed_10m: [12],
    },
  };
}

describe("OpenMeteoHttpClient", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("calls fetch with the Open-Meteo forecast URL for the given coordinates and returns JSON", async () => {
    const longitude = 18.4241;
    const latitude = -33.9249;
    const payload = sampleForecast();

    const jsonMock = jest.fn(async () => payload);
    const mockResponse = { json: jsonMock } as unknown as Response;
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(async () => mockResponse);

    const client = new OpenMeteoHttpClient();
    const result = await client.getForecast(longitude, latitude);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(expectedForecastUrl(longitude, latitude), {
      method: "GET",
    } as RequestInit);
    expect(jsonMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(payload);
  });

  it("requests a distinct URL when latitude and longitude change", async () => {
    const jsonMock = jest.fn(async () => sampleForecast());
    const mockResponse = { json: jsonMock } as unknown as Response;
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(async () => mockResponse);

    const client = new OpenMeteoHttpClient();
    await client.getForecast(-0.1278, 51.5074);

    expect(fetchSpy).toHaveBeenCalledWith(
      expectedForecastUrl(-0.1278, 51.5074),
      { method: "GET" } as RequestInit,
    );
  });
});
