import { Resolver } from "../../shared/classes";
import { LocationSearchResponse } from "../../shared/http/integrations/location-http-client.interface";
import { LocationLib } from "../location";
import { RankingLib, OrderedRankingActivities } from "../ranking";

export class QueryResolver extends Resolver {
  /**
   * Get the locations for a given name.
   * @param _ - The root object.
   * @param {string} name - The name of the location.
   * @returns The locations.
   */
  public getLocations(
    _: any,
    { name }: { name: string },
  ): Promise<LocationSearchResponse> {
    return LocationLib.getLocations(name);
  }

  /**
   * Get the activities ranking for a given longitude and latitude.
   * @param _ - The root object.
   * @param {number} longitude - The longitude of the location.
   * @param {number} latitude - The latitude of the location.
   * @returns The ranking.
   */
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
