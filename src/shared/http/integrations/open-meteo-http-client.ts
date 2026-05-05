import { Forecast } from "../../schemas";
import { FetchHttpClient, IHttpClient } from "../base";
import { IntegrationHttpClientBase } from "./integration-http-client-base";

interface RankingParams {
    minTemperature: number;
    maxTemperature: number;
    minWindSpeed: number;
    maxWindSpeed: number;
    minRain: number;
    maxRain: number;
    minSnowfall: number;
    maxSnowfall: number;
    visibility: number;
}
export class OpenMeteoHttpClient extends IntegrationHttpClientBase {
    private readonly rankingParams = {
        surfing: {
            minTemperature: 18,
            maxTemperature: 28,
            minWindSpeed: 10,
            maxWindSpeed: 20,
            minRain: 0,
            maxRain: 10,
            minShowers: 0,
            maxShowers: 10,
            minSnowfall: 0,
        }
    };
  private readonly httpClient: IHttpClient = new FetchHttpClient();
  constructor(httpClient: IHttpClient = new FetchHttpClient()) {
    super(httpClient);
    this.httpClient = httpClient;
  }

  public async getForecast(
    longitude: number,
    latitude: number,
  ): Promise<Forecast> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&&hourly=temperature_2m,visibility,snowfall,rain,wind_speed_10m&timezone=auto&format=json&timeformat=unixtime`;
    const result = await this.httpClient.getJson<Forecast>(url);
    return result;
  }
}
