import { locations, locationOperators, tickets } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const insertLocationSchema = createInsertSchema(locations);

export const insertLocationOperatorSchema =
  createInsertSchema(locationOperators);

export const insertTicketsSchema = createInsertSchema(tickets);

export const pageSchema = z.object({
  limit: z.number().int().positive().default(10),
  offset: z.number().int().positive().default(0),
});
