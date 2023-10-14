import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { createInsertSchema } from "drizzle-zod";
import { locationOperators, locations } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

// @ts-expect-error - TODO: fix this type error
const locationSchema = createInsertSchema(locations);

// @ts-expect-error - TODO: fix this type error
const locationOperatorSchema = createInsertSchema(locationOperators);

const pageSchema = z.object({
  limit: z.number().int().positive().default(10),
  offset: z.number().int().positive().default(0),
});

export const locationRouter = createTRPCRouter({
  createOne: adminProcedure
    .input(locationSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(locations).values(input).execute();
    }),
  createMany: adminProcedure
    .input(z.array(locationSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(locations).values(input).execute();
    }),
  getMany: adminProcedure.input(pageSchema).query(async ({ ctx, input }) => {
    return await ctx.db.query.locations.findMany({
      offset: input.offset,
      limit: input.limit,
    });
  }),
  getOne: adminProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.db.query.locations.findFirst({
      where: (tb, op) => op.eq(tb.location_id, input),
    });
  }),
  addOperator: adminProcedure
    .input(locationOperatorSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(locationOperators).values(input).execute();
    }),
  removeOperator: adminProcedure
    .input(
      z.object({
        location_id: z.number(),
        operator_id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(locationOperators)
        .where(
          and(
            eq(locationOperators.location_id, input.location_id),
            eq(locationOperators.operator_id, input.operator_id),
          ),
        )
        .execute();
    }),
});
