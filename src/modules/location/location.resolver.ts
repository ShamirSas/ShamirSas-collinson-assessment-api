import { ResolveType } from "../../shared/classes";
import { LocationSearchResponse } from "../../shared/http";
import { ResolveTypeFunction } from "../../shared/interfaces";

export class LocationsSearchResponseResolver extends ResolveType {
  public __resolveType: ResolveTypeFunction<
    LocationSearchResponse,
    "Locations" | "ResponseMessage"
  > = (obj: LocationSearchResponse) => {
    
    if ("locations" in obj) {
      return "Locations";
    }

    if ("message" in obj) {
      return "ResponseMessage";
    }

    return null;
  };
}
