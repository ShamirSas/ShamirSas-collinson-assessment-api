import { LocationsSearchResponseResolver } from "../modules/location";
import { QueryResolver } from "../modules/root";

export const resolvers = {
  Query: new QueryResolver(),
  LocationsSearchResponse: new LocationsSearchResponseResolver(),
};
