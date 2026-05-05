import { Forecast } from "../../schemas";
import { FetchHttpClient, IHttpClient } from "../base";
import { IntegrationHttpClientBase } from "./integration-http-client-base";

export class OpenMeteoHttpClient extends IntegrationHttpClientBase {
  private readonly httpClient: IHttpClient = new FetchHttpClient();

  /**
   * Inject the http client desired to be used for http requests.
   */
  constructor(httpClient: IHttpClient = new FetchHttpClient()) {
    super(httpClient);
    this.httpClient = httpClient;
  }

  /*
  * Get the forecast for a given longitude and latitude.
  * @param longitude - The longitude of the location.
  * @param latitude - The latitude of the location.
  * @returns The forecast.
  */
  public async getForecast(
    longitude: number,
    latitude: number,
  ): Promise<Forecast> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&&hourly=temperature_2m,visibility,snowfall,rain,wind_speed_10m&timezone=auto&format=json&timeformat=unixtime`;
    const result = await this.httpClient.getJson<Forecast>(url);
    return result;
  }
}
