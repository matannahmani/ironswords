import {
  locations,
  locationOperators,
  tickets,
  citys,
  operators,
  operatorsInvite,
} from "@/server/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const insertLocationSchema = createInsertSchema(locations);

export const insertLocationOperatorSchema =
  createInsertSchema(locationOperators);

export const insertTicketsSchema = createInsertSchema(tickets);
export const selectTicketsSchema = createSelectSchema(tickets);
export const insertCitySchema = createInsertSchema(citys);
export const insertOperatorSchema = createInsertSchema(operators).merge(
  z.object({
    email: z.string().email(),
  }),
);
export const insertOperatorInviteSchema = createInsertSchema(operatorsInvite)
  .merge(
    z.object({
      payload: insertOperatorSchema
        .omit({
          user_id: true,
          operator_id: true,
          invite_id: true,
          is_claimed: true,
        })
        .merge(
          z.object({
            location_ids: z.array(z.string()),
          }),
        ),
    }),
  )
  .omit({
    expires: true,
  });

export const pageSchema = z.object({
  limit: z.number().int().default(10),
  offset: z.number().int().default(0),
});

export const priotityToHE = (
  priority: typeof tickets.$inferSelect.priority,
) => {
  switch (priority) {
    case "HIGH":
      return {
        i18n: "HIGH",
        label: "דחיפות גבוהה",
        color: "destructive",
      };
    case "MID":
      return {
        i18n: "MID",
        label: "דחיפות בינונית",
        color: "warning",
      };
    case "LOW":
      return {
        i18n: "LOW",
        label: "דחיפות נמוכה",
        color: "secondary",
      };
    case "URGENT":
      return {
        i18n: "URGENT",
        label: "דחיפות קריטית",
        color: "primary",
      };
    default:
      return {
        i18n: "LOW",
        label: "דחיפות נמוכה",
        color: "secondary",
      };
  }
};

export const statusToHE = (status: typeof tickets.$inferSelect.status) => {
  switch (status) {
    case "OPEN":
      return {
        i18n: "OPEN",
        label: "פתוח",
        color: "success",
      };
    case "CLOSED":
      return {
        i18n: "CLOSED",
        label: "סגור",
        color: "secondary",
      };
    case "ASSIGNED":
      return {
        i18n: "ASSIGNED",
        label: "בטיפול",
        color: "warning",
      };
  }
};
