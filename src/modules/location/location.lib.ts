import { LocationHttpClient } from "../../shared/http";
import { Location } from "../../shared/schemas";

export class LocationLib {
  public static async getLocation(searchText: string): Promise<Location> {
    return new LocationHttpClient().getLocation(searchText);
  }
}
