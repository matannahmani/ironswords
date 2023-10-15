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
  insertTicketsSchema,
  pageSchema,
  selectTicketsSchema,
} from "@/shared/zod/base";

export const ticketsRouter = createTRPCRouter({
  updateOne: operatorProcedure
    .input(selectTicketsSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.operator_id !== ctx.session.operator.operator_id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to update this ticket",
        });
      }
      const update = await ctx.db
        .update(tickets)
        .set(input)
        .where(
          and(
            eq(tickets.ticket_id, input.ticket_id),
            eq(tickets.operator_id, input.operator_id),
          ),
        );
      return update;
    }),
  createOne: operatorProcedure
    .input(insertTicketsSchema)
    .mutation(async ({ ctx, input }) => {
      // validate if location exists in operator's locations
      const hasLocation = ctx.session.operator.locationOperators.some(
        (locationOperator) => {
          if (locationOperator.location_id === input.location_id) {
            return true;
          }
        },
      );
      const isSameOperatorId =
        ctx.session.operator.operator_id === input.operator_id;
      if (!hasLocation || !isSameOperatorId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to create tickets for this location",
        });
      }
      return await ctx.db.insert(tickets).values(input).execute();
    }),
  createMany: operatorProcedure
    .input(z.array(insertTicketsSchema))
    .mutation(async ({ ctx, input }) => {
      input.forEach((location) => {
        // validate if location exists in operator's locations
        const hasLocation = ctx.session.operator.locationOperators.some(
          (locationOperator) => {
            if (locationOperator.location_id === location.location_id) {
              return true;
            }
          },
        );
        const isSameOperatorId =
          ctx.session.operator.operator_id === location.operator_id;
        if (!hasLocation || !isSameOperatorId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not allowed to create tickets for this location",
          });
        }
      });
      return await ctx.db.insert(tickets).values(input).execute();
    }),
  getMany: publicProcedure.input(pageSchema).query(async ({ ctx, input }) => {
    return await ctx.db.query.tickets.findMany({
      offset: input.offset,
      limit: input.limit,
    });
  }),
  getOne: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.query.tickets.findFirst({
      where: (tb, op) => op.eq(tb.location_id, input),
    });
  }),
});
