import { NoDataFoundMessage } from "../../shared/classes";
import {
  LocationHttpClient,
  LocationSearchApiResponseData,
  LocationSearchResponse,
} from "../../shared/http";

export class LocationLib {
  public static async getLocations(
    searchText: string,
  ): Promise<LocationSearchResponse> {
    const { results: locations }: LocationSearchApiResponseData =
      await new LocationHttpClient().getLocations(searchText);

    if (Array.isArray(locations) && locations.length > 0) {
      return { locations };
    }

    return new NoDataFoundMessage();
  }
}
