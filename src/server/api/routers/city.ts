import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  operatorProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { createInsertSchema } from "drizzle-zod";
import { locationOperators, citys, tickets } from "@/server/db/schema";
import { SQL, SQLWrapper, and, eq, inArray, like, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { getLocationTicketsSchema } from "@/shared/zod/tickets";
import {
  insertLocationOperatorSchema,
  insertCitySchema,
  pageSchema,
} from "@/shared/zod/base";

export const cityRouter = createTRPCRouter({
  createOne: adminProcedure
    .input(insertCitySchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(citys).values(input).execute();
    }),
  createMany: adminProcedure
    .input(z.array(insertCitySchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(citys).values(input).execute();
    }),
  getMany: adminProcedure.input(pageSchema).query(async ({ ctx, input }) => {
    return await ctx.db.query.citys.findMany({
      offset: input.offset,
      limit: input.limit,
    });
  }),
  getOne: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.query.citys.findFirst({
      where: (tb, op) => op.eq(tb.city_id, input),
    });
  }),
  locations: publicProcedure
    .input(
      z.object({
        city_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const locations = await ctx.db.query.locations.findMany({
        where: (tb, op) => op.eq(tb.city_id, input.city_id),
      });
      return locations;
    }),
  tickets: operatorProcedure
    .input(
      getLocationTicketsSchema
        .pick({
          title: true,
          priority: true,
          status: true,
        })
        .extend({
          city_id: z.string(),
        })
        .merge(pageSchema),
    )
    .query(async ({ ctx, input }) => {
      const { title, priority, city_id, status } = input;

      const filters = and(
        eq(tickets.city_id, city_id),
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
      const hasNextPage = page.length === input.limit;
      const hasPreviousPage = input.offset > 1;
      return {
        total: total?.[0]?.count ?? 0,
        page,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
