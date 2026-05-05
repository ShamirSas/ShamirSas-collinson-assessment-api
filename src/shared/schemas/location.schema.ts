import { z } from "zod";

export const locationSchema = z.object({
  admin1_id: z.string(),
  admin1: z.string(),
  admin2_id: z.string(),
  admin2: z.string(),
  admin3_id: z.string(),
  admin3: z.string(),
  country_code: z.string(),
  country_id: z.string(),
  country: z.string(),
  elevation: z.number(),
  feature_code: z.string(),
  id: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  name: z.string(),
  timezone: z.string(),
});

export type Location = z.infer<typeof locationSchema>;
