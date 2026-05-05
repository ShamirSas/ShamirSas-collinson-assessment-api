import { Location } from "../../schemas";
import { FetchHttpClient } from "../base";
import { IHttpClient } from "../base/http-client.interface";

export class LocationHttpClient {
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
  async getLocation(searchText: string): Promise<Location> {
    const response = await this.httpClient.getJson<{ results: Location }>(
      `https://geocoding-api.open-meteo.com/v1/search?name=${searchText}`,
    );
    return response.results;
  }
}
