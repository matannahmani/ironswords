import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  operatorProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { createInsertSchema } from "drizzle-zod";
import { locationOperators, locations, tickets } from "@/server/db/schema";
import { SQL, SQLWrapper, and, eq, inArray, like, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { getLocationTicketsSchema } from "@/shared/zod/tickets";
import {
  insertLocationOperatorSchema,
  insertLocationSchema,
  pageSchema,
} from "@/shared/zod/base";

export const locationRouter = createTRPCRouter({
  createOne: adminProcedure
    .input(insertLocationSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(locations).values(input).execute();
    }),
  createMany: adminProcedure
    .input(z.array(insertLocationSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(locations).values(input).execute();
    }),
  getMany: adminProcedure.input(pageSchema).query(async ({ ctx, input }) => {
    return await ctx.db.query.locations.findMany({
      offset: input.offset,
      limit: input.limit,
    });
  }),
  getOne: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.query.locations.findFirst({
      where: (tb, op) => op.eq(tb.location_id, input),
    });
  }),
  myLocations: operatorProcedure.query(({ ctx }) => {
    return ctx.session.operator.locationOperators;
  }),
  tickets: operatorProcedure
    .input(getLocationTicketsSchema)
    .query(async ({ ctx, input }) => {
      const { title, priority, location_id, status } = input;
      // first  check if the operator is assigned to the location
      const hasLocation = ctx.session.operator.locationOperators.find(
        (location) => location.location_id === input.location_id,
      );
      if (!hasLocation) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const filters = and(
        eq(tickets.location_id, location_id),
        ...(title ? [like(tickets.title, `%${title}%`)] : []),
        ...(!!priority ? [inArray(tickets.priority, priority)] : []),
        ...(!!status ? [inArray(tickets.status, status)] : []),
      );
      const totalP = ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(tickets)
        .where(filters)
        .execute();
      const pageP = ctx.db.query.tickets.findMany({
        where: (tb, op) => filters,
        offset: input.offset,
        limit: input.limit,
      });
      const [total, page] = await Promise.all([totalP, pageP]);
      return {
        total: total?.[0]?.count ?? 0,
        page,
      };
    }),
  addOperator: adminProcedure
    .input(insertLocationOperatorSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(locationOperators).values(input).execute();
    }),
  removeOperator: adminProcedure
    .input(
      z.object({
        location_id: z.string(),
        operator_id: z.string(),
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
