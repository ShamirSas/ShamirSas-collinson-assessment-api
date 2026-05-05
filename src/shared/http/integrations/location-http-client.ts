import { Location } from "../../schemas";
import { FetchHttpClient } from "../base";
import { IHttpClient } from "../base/http-client.interface";

export class LocationHttpClient {
  readonly #LOCATION_SEARCH_URL = "https://geocoding-api.open-meteo.com/v1/search";

  /**
   * Inject the http client desired to be used for http requests.
   */
  constructor(
    private readonly httpClient: IHttpClient = new FetchHttpClient(),
  ) {}

  /**
   * Get location by search text
   * @param searchText - The search text to get the location
   * @returns The location
   */
  async getLocations(name: string): Promise<Location[]> {
    const response = await this.httpClient.getJson<{ results: Location[] }>(
      this.#LOCATION_SEARCH_URL,
      {
        queryParams: {
          name,
        },
      },
    );
    return response.results;
  }
}
