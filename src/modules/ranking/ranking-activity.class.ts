import { Forecast } from "../../shared/schemas";
import { ActivityParams } from "./ranking-activity.interface";
import { RankingActivity } from "./ranking-activities.enum";

export class Activity implements ActivityParams {
  constructor(
    public name: RankingActivity,
    public minTemperature: number | null,
    public maxTemperature: number | null,
    public minWindSpeed: number | null,
    public maxWindSpeed: number | null,
    public rainMin: number | null,
    public rainMax: number | null,
    public visibilityMin: number | null,
  ) {}

  public isMoreOrEqualThan(value: number, min: number | null): boolean {
    if (min == null) {
      return true;
    }
    return value >= min;
  }

  public checkMinMaxValue(
    value: number,
    min: number | null,
    max: number | null,
  ): boolean {
    if (min == null || max == null) {
      return true;
    }
    return value >= min && value <= max;
  }

  public calculateScore(forecast: Forecast): number {
    let score = 0;
    for (let i = 0; i < forecast.hourly.time.length; i++) {
      const temperature = forecast.hourly.temperature_2m[i];
      const visibility = forecast.hourly.visibility[i];
      const rain = forecast.hourly.rain[i];
      const windSpeed = forecast.hourly.wind_speed_10m[i];

      if (
        this.checkMinMaxValue(
          temperature,
          this.minTemperature,
          this.maxTemperature,
        ) &&
        this.isMoreOrEqualThan(visibility, this.visibilityMin) &&
        this.checkMinMaxValue(
          windSpeed,
          this.minWindSpeed,
          this.maxWindSpeed,
        ) &&
        this.checkMinMaxValue(rain, this.rainMin, this.rainMax)
      ) {
        score++;
      }
    }
    return score;
  }
}
