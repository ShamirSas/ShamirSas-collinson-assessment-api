import { LocationHttpClient } from "../../shared/http";
import { Location } from "../../shared/schemas";

export class LocationLib {
  public static async getLocations(searchText: string): Promise<Location[]> {
    return new LocationHttpClient().getLocations(searchText);
  }
}
