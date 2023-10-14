import { z } from "zod";
import { insertTicketsSchema, pageSchema } from "./base";

export const getLocationTicketsSchema = pageSchema.merge(
  z.object({
    location_id: insertTicketsSchema.shape.location_id.unwrap().unwrap(),
    title: insertTicketsSchema.shape.title.optional(),
    priority: insertTicketsSchema.shape.priority
      .unwrap()
      .unwrap()
      .array()
      .optional(),
    status: insertTicketsSchema.shape.status
      .unwrap()
      .unwrap()
      .array()
      .optional(),
  }),
);
