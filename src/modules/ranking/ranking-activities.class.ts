import { Forecast } from "../../shared/schemas";
import { Activity } from "./ranking-activity.class";
import { RankingActivity } from "./ranking-activities.enum";

export class RankingActivities {
  private static calculateActivityScores(forecast: Forecast): [number, Activity][] {
    const activities: Record<RankingActivity, Activity> = {
        [RankingActivity.SURFING]: new Activity(RankingActivity.SURFING, 15, 28, 5, 20, 0, 2, 5),
        [RankingActivity.SKIING]: new Activity(RankingActivity.SKIING, -10, -2, 0, 25, null, null, 10),
        [RankingActivity.SIGHTSEEING_OUTDOORS]: new Activity(RankingActivity.SIGHTSEEING_OUTDOORS, 18, 25, 0, 15, null, null, 10),
        [RankingActivity.SIGHTSEEING_INDOOR]: new Activity(RankingActivity.SIGHTSEEING_INDOOR, null, null, 0, 40, null, null, null),
    };
    const scores: [number, Activity][] = [
      [0, activities[RankingActivity.SURFING]],
      [0, activities[RankingActivity.SIGHTSEEING_OUTDOORS]],
      [0, activities[RankingActivity.SIGHTSEEING_INDOOR]],
      [0, activities[RankingActivity.SKIING]],
    ];

    for (const score of scores) {
      score[0] = score[1].calculateScore(forecast);
    }

    return scores;
  }

  private static sortScoresDescending(scores: [number, Activity][]): string[] {
    return scores.sort((a, b) => b[0] - a[0]).map((score) => score[1].name);
  }

  public static getRankingActivitiesByForecast(forecast: Forecast): string[] {
    const scores = this.calculateActivityScores(forecast);
    return this.sortScoresDescending(scores);
  }
}
