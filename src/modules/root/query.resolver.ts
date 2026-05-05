import { LocationSearchResponse } from "../../shared/http/integrations/location-http-client.interface";
import { LocationLib } from "../location";
export class QueryResolver {
  public getLocations(
    _: any,
    { name }: { name: string },
  ): Promise<LocationSearchResponse> {
    return LocationLib.getLocations(name);
  }
}
