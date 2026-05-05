import { OpenMeteoHttpClient } from "../../shared/http/integrations/open-meteo-http-client";
import { Forecast } from "../../shared/schemas";
import { RankingActivities } from "./ranking-activities.class";
import { OrderedRankingActivities } from "./ranking.interface";

export class RankingLib {
  public static async getRanking(
    longitude: number,
    latitude: number,
  ): Promise<OrderedRankingActivities> {
    const forecast: Forecast = await new OpenMeteoHttpClient().getForecast(
      longitude,
      latitude,
    );

    return {
      activities: RankingActivities.getRankingActivitiesByForecast(forecast),
    };
  }
}
