import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { LocationHttpClient } from "../location-http-client";
import { Location } from "../../../schemas";

describe("LocationHttpClient", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("getLocations should call fetch with location URL and query params", async () => {
    const locations: Location[] = [
      {
        admin1_id: "1",
        admin1: "Western Cape",
        admin2_id: "2",
        admin2: "City of Cape Town",
        admin3_id: "3",
        admin3: "Cape Town",
        country_code: "ZA",
        country_id: "4",
        country: "South Africa",
        elevation: 25,
        feature_code: "PPLA",
        id: "5",
        latitude: -33.9249,
        longitude: 18.4241,
        name: "Cape Town",
        timezone: "Africa/Johannesburg",
      },
    ];

    const jsonMock = jest.fn(async () => ({ results: locations }));
    const mockResponse = { json: jsonMock } as unknown as Response;
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(async () => mockResponse);

    const client = new LocationHttpClient();
    const result = await client.getLocations("Cape Town");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://geocoding-api.open-meteo.com/v1/search?name=Cape Town",
      {
        method: "GET",
      } as any,
    );
    expect(jsonMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ results: locations });
  });

  it("getLocations should return an empty array when API results are empty", async () => {
    const jsonMock = jest.fn(async () => ({ results: [] as Location[] }));
    const mockResponse = { json: jsonMock } as unknown as Response;
    jest.spyOn(global, "fetch").mockImplementation(async () => mockResponse);

    const client = new LocationHttpClient();
    const result = await client.getLocations("Unknown");

    expect(result).toEqual({ results:[] });
    expect(jsonMock).toHaveBeenCalledTimes(1);
  });
});
