import { RankingActivity } from "./ranking-activities.enum";

export interface ActivityParams {
    name: RankingActivity;
    minTemperature: number | null;
    maxTemperature: number | null;
    minWindSpeed: number | null;
    maxWindSpeed: number | null;
    rainMin: number | null;
    rainMax: number | null;
    visibilityMin: number | null;
  }
  
  