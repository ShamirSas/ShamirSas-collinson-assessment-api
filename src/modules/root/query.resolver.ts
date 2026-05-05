import { LocationLib } from "../location/location.lib";
export class QueryResolver {
  public getLocations = (_: any, { search }: { search: string }) => {
    return LocationLib.getLocations(search);
  };
}
