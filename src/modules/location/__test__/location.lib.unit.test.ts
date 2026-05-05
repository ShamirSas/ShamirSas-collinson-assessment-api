import { LocationLib } from "../location.lib";
import { LocationHttpClient } from "../../../shared/http";
import { Location } from "../../../shared/schemas";
import { NoDataFoundMessage } from "../../../shared/classes";
import { afterEach, describe, it, expect, jest } from "@jest/globals";

describe("LocationLib", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return locations when API response contains results", async () => {
    const searchText = "London";
    const mockLocations: Location[] = [
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
    ];

    const getLocationsSpy = jest
      .spyOn(LocationHttpClient.prototype, "getLocations")
      .mockResolvedValue({ results: mockLocations });

    const results = await LocationLib.getLocations(searchText);

    expect(getLocationsSpy).toHaveBeenCalledTimes(1);
    expect(getLocationsSpy).toHaveBeenCalledWith(searchText);
    expect(results).toEqual({ locations: mockLocations });
  });

  it("should return NoDataFoundMessage when API response has empty results", async () => {
    const getLocationsSpy = jest
      .spyOn(LocationHttpClient.prototype, "getLocations")
      .mockResolvedValue({ results: [] });

    const result = await LocationLib.getLocations("Unknown");

    expect(getLocationsSpy).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(NoDataFoundMessage);
    expect(result).toEqual(new NoDataFoundMessage());
  });

  it("should return NoDataFoundMessage when API response has no results field", async () => {
    const getLocationsSpy = jest
      .spyOn(LocationHttpClient.prototype, "getLocations")
      .mockResolvedValue({});

    const result = await LocationLib.getLocations("Unknown");

    expect(getLocationsSpy).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(NoDataFoundMessage);
    expect(result).toEqual(new NoDataFoundMessage());
  });
});
