import { QueryResolver } from "../modules/root";
import { LocationSearchResponse } from "../shared/http/integrations/location-http-client.interface";

export const resolvers = {
  Query: new QueryResolver(),
  LocationsSearchResponse: {
    __resolveType(obj: LocationSearchResponse) {
      if ("locations" in obj) {
        return "Locations";
      }
      if ("message" in obj) {
        return "ResponseMessage";
      }
      return null;
    },
  },
};
