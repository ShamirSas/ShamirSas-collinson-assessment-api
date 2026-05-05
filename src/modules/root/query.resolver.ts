import { LocationSearchResponse } from "../../shared/http/integrations/location-http-client.interface";
import { LocationLib } from "../location";
import { RankingLib, OrderedRankingActivities } from "../ranking";
export class QueryResolver {
  public getLocations(
    _: any,
    { name }: { name: string },
  ): Promise<LocationSearchResponse> {
    return LocationLib.getLocations(name);
  }

  public getRanking(
    _: any,
    {
      longitude,
      latitude,
    }: { longitude: number; latitude: number; timezone: string },
  ): Promise<OrderedRankingActivities> {
    return RankingLib.getRanking(longitude, latitude);
  }
}
