import { z } from "zod";

const periodSchema = z.object({
  time: z.array(z.number()),
  temperature_2m: z.array(z.number()),
  temperature_2m_max: z.array(z.number()),
  temperature_2m_min: z.array(z.number()),
  wind_speed_10m_max: z.array(z.number()),
  rain_sum: z.array(z.number()),
  showers_sum: z.array(z.number()),
  snowfall_sum: z.array(z.number()),
  wind_gusts_10m_max: z.array(z.number()),
  visibility: z.array(z.number()),
  snowfall: z.array(z.number()),
  rain: z.array(z.number()),
  wind_speed_10m: z.array(z.number()),
});

const unitsSchema = z.object({
  temperature_2m: z.string(),
  temperature_2m_max: z.string(),
  temperature_2m_min: z.string(),
  wind_speed_10m_max: z.string(),
  rain_sum: z.string(),
  showers_sum: z.string(),
  snowfall_sum: z.string(),
  wind_gusts_10m_max: z.string(),
});

const forecastSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number(),
  utc_offset_seconds: z.number(),
  timezone: z.string(),
  timezone_abbreviation: z.string(),
  elevation: z.number(),
  hourly_units: unitsSchema,
  hourly: periodSchema,
});

export type Forecast = z.infer<typeof forecastSchema>;
