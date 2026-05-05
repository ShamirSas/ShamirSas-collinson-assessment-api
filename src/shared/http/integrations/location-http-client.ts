import { FetchHttpClient, IHttpClient } from "../base";
import { IntegrationHttpClientBase } from "./integration-http-client-base";
import { LocationSearchApiResponseData } from "./location-http-client.interface";

export class LocationHttpClient extends IntegrationHttpClientBase {
  /**
   * Inject the http client desired to be used for http requests.
   */
  constructor(readonly httpClient: IHttpClient = new FetchHttpClient()) {
    super(httpClient);
  }

  /**
   * Get location by search text
   * @param searchText - The search text to get the location
   * @returns The location
   */
  async getLocations(name: string): Promise<LocationSearchApiResponseData> {
    return this.httpClient.getJson<LocationSearchApiResponseData>(
      `https://geocoding-api.open-meteo.com/v1/search?name=${name}`,
    );
  }
}
