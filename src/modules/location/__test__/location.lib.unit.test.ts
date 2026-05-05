import { LocationLib } from "../location.lib";
import { LocationHttpClient } from "../../../shared/http";
import { Location } from "../../../shared/schemas";
import { describe, it, expect } from "@jest/globals";

describe("LocationLib", () => {
  it("should call LocationHttpClient.getLocations and return its mocked response", async () => {
    const searchText = "London";
    const mockLocation: Location[] = [
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

    const getLocationSpy = jest
      .spyOn(LocationHttpClient.prototype, "getLocations")
      .mockResolvedValue(mockLocation);

    const results = await LocationLib.getLocations(searchText);

    expect(getLocationSpy).toHaveBeenCalledTimes(1);
    expect(getLocationSpy).toHaveBeenCalledWith(searchText);
    expect(results).toEqual(mockLocation);
  });
});
