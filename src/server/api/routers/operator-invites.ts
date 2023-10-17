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
  citys,
  tickets,
  operatorsInvite,
  operators,
} from "@/server/db/schema";
import { SQL, SQLWrapper, and, eq, inArray, like, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { getLocationTicketsSchema } from "@/shared/zod/tickets";
import {
  insertLocationOperatorSchema,
  insertCitySchema,
  pageSchema,
  insertOperatorInviteSchema,
} from "@/shared/zod/base";
import { nanoid } from "nanoid";
import { sendEmail } from "@/server/email/resend";
import OperatorInviteEmail from "@/server/email/operator-invite";
import { getBaseUrl } from "@/trpc/shared";
import { env } from "@/env.mjs";

export const operatorInvitesRouter = createTRPCRouter({
  createOne: adminProcedure
    .input(insertOperatorInviteSchema)
    .mutation(async ({ ctx, input }) => {
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      // check if the email is already an operator
      const isExists = await ctx.db.query.operators.findFirst({
        where: (tb, op) => op.eq(tb.email, input.email),
      });
      if (!!isExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is already an operator",
        });
      }
      const invite_id = nanoid();
      const result = await ctx.db
        .insert(operatorsInvite)
        .values({
          ...input,
          expires: oneWeekFromNow,
          invite_id,
        })
        .execute();
      await sendEmail({
        to: input.email,
        from: env.EMAIL_FROM,
        subject: "הזמנה להצטרפות למערכת - חרבות ברזל",
        react: OperatorInviteEmail({
          inviteLink: `${getBaseUrl()}/operator-invite/${invite_id}/${Number(
            oneWeekFromNow,
          )}`,
        }),
      });
      return {
        status: "OK",
      };
    }),
  createMany: adminProcedure
    .input(z.array(insertOperatorInviteSchema))
    .mutation(async ({ ctx, input }) => {
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      return await ctx.db
        .insert(operatorsInvite)
        .values(
          input.map((payload) => ({
            ...payload,
            expires: oneWeekFromNow,
          })),
        )
        .execute();
    }),
  getMany: adminProcedure.input(pageSchema).query(async ({ ctx, input }) => {
    const pageP = ctx.db.query.operatorsInvite.findMany({
      limit: input.limit,
      offset: input.offset,
    });
    const totalP = ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(operatorsInvite)
      .execute();
    const [page, total] = await Promise.all([pageP, totalP]);

    return {
      total: Number(total?.[0]?.count ?? 0),
      page,
      totalPages: Math.ceil((total?.[0]?.count ?? 0) / input.limit),
    };
  }),
  findInvite: publicProcedure
    .input(
      z.object({
        expires: z.string(),
        invite_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const invite = await ctx.db.query.operatorsInvite.findFirst({
        where: (tb, op) =>
          and(
            op.eq(tb.invite_id, input.invite_id),
            op.eq(tb.expires, new Date(input.expires)),
          ),
      });
      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invite not found",
        });
      }
      return invite;
    }),
  claimInvite: publicProcedure
    .input(
      z.object({
        expires: z.string(),
        invite_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const targetInvite = await ctx.db.query.operatorsInvite.findFirst({
        where: (tb, op) =>
          and(
            op.eq(tb.invite_id, input.invite_id),
            op.eq(tb.expires, new Date(input.expires)),
          ),
      });
      if (!targetInvite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invite not found",
        });
      }
      if (targetInvite.is_claimed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invite already claimed",
        });
      }
      const targetUser = await ctx.db.query.users.findFirst({
        where: (tb, op) => op.eq(tb.email, targetInvite.email),
      });
      if (!targetUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist",
        });
      }
      const result = await ctx.db.transaction(async (trx) => {
        const invite = await trx
          .update(operatorsInvite)
          .set({
            is_claimed: true,
          })
          .where(
            and(
              eq(operatorsInvite.invite_id, input.invite_id),
              eq(operatorsInvite.expires, new Date(input.expires)),
            ),
          )
          .execute();
        const operator = await trx.insert(operators).values({
          user_id: targetUser.id,
          ...targetInvite.payload,
        });
        return [invite, operator];
      });
      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
      return {
        success: result[0]?.rowsAffected === 1 && result[1]?.rowsAffected === 1,
      };
    }),
});
