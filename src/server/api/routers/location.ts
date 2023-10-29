import {z} from "zod";

import {adminProcedure, createTRPCRouter, operatorProcedure,} from "@/server/api/trpc";
import {locationOperators, locations, tickets} from "@/server/db/schema";
import {and, eq, inArray, like, sql} from "drizzle-orm";
import {TRPCError} from "@trpc/server";
import {getLocationTicketsSchema} from "@/shared/zod/tickets";
import {insertLocationOperatorSchema, insertLocationSchema, pageSchema,} from "@/shared/zod/base";

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
    const locationsP = ctx.db.query.locations.findMany({
      offset: input.offset,
      limit: input.limit,
      with: {
        city: true,
      },
    });
    const countsP = ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(locations)
      .execute();
    const [locationData, counts] = await Promise.all([locationsP, countsP]);
    return {
      total: Number(counts?.[0]?.count ?? 0),
      page: locationData,
      totalPages: Math.ceil((counts?.[0]?.count ?? 0) / input.limit),
    };
  }),
  getOne: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.query.locations.findFirst({
      where: (tb, op) => op.eq(tb.location_id, input),
    });
  }),
  all: adminProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.query.locations.findMany();
  }),
  updateOne: adminProcedure
    .input(
      insertLocationSchema.merge(
        z.object({
          location_id: z.string(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(locations)
        .set(input)
        .where(eq(locations.location_id, input.location_id))
        .execute();
    }),
  myLocations: operatorProcedure.query(({ ctx }) => {
    const d = ctx.session.operator.locationOperators;
    return d;
  }),
  tickets: operatorProcedure
    .input(getLocationTicketsSchema)
    .query(async ({ ctx, input }) => {
      const { title, priority, location_id, status } = input;

      let locationId: null | string | undefined = null;
      let locationIds: string[] = [];
      // check if location_id is undefined if so pick the first location
      if (
        (!location_id || location_id === "all") &&
        !!ctx.session.operator.locationOperators?.length
      ) {
        // locationId = ctx.session?.operator.locationOperators.at(0)?.location_id;
        locationId = "all";
        locationIds = ctx.session.operator.locationOperators
          .filter((loc) => !!loc.location_id)
          .map((location) => location.location_id as string);
      }
      // else check if the operator is assigned to the location
      else
        locationId = ctx.session.operator.locationOperators.find(
          (location) => location.location_id === input.location_id,
        )?.location_id;
      if (!locationId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const filters = and(
        locationId === "all"
          ? inArray(tickets.location_id, locationIds)
          : eq(tickets.location_id, location_id as string),
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
        offset: input.offset * input.limit,
        limit: input.limit,
      });
      const [total, page] = await Promise.all([totalP, pageP]);
      return {
        total: Number(total?.[0]?.count ?? 0),
        page,
        totalPages: Math.ceil((total?.[0]?.count ?? 0) / input.limit),
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
