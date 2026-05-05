import { LocationLib } from "../location/location.lib";
export class QueryResolver {
  public getLocation = (_: any, { search }: { search: string }) => {
    return LocationLib.getLocation(search);
  };
}
