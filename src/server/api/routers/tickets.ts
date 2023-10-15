import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  operatorProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { createInsertSchema } from "drizzle-zod";
import {
  locationOperators,
  locations,
  ticketResponses,
  tickets,
} from "@/server/db/schema";
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
  acceptTicket: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        ticket_id: z.string(),
        freeText: z.string(),
        telephone: z.string(),
        needTransport: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // find ticket
      const ticket = await ctx.db.query.tickets.findFirst({
        where: (tb, op) => op.eq(tb.ticket_id, input.ticket_id),
      });
      // if no ticket or ticket is already accepted throw error
      if (!ticket || ticket.status !== "OPEN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to accept this ticket",
        });
      }
      // update ticket status to accepted and create a new ticket response
      const updateP = ctx.db
        .update(tickets)
        .set({
          status: "ASSIGNED",
        })
        .where(and(eq(tickets.ticket_id, input.ticket_id)));
      const insertP = ctx.db.insert(ticketResponses).values({
        ticket_id: input.ticket_id,
        user_id: ctx.session.user.id,
        is_requesting_transportion: input.needTransport,
        content: `הפנייה אושרה על ידי: ${input.name} והיא ממתינה לטיפול\מ פרטי קשר: ${input.telephone} הערות שולים: ${input.freeText}`,
      });
      const [update, insert] = await Promise.all([updateP, insertP]);
      return update;
    }),
});
