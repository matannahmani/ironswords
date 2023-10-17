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
  users,
} from "@/server/db/schema";
import { SQL, SQLWrapper, and, eq, inArray, like, not, sql } from "drizzle-orm";
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
import { encodeInvite } from "@/shared/utils/invite-encoder";

const toBase64 = (str: string) => Buffer.from(str).toString("base64");

export const operatorInvitesRouter = createTRPCRouter({
  createOne: adminProcedure
    .input(insertOperatorInviteSchema)
    .mutation(async ({ ctx, input }) => {
      const oneWeekFromNow = new Date(
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
      );
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
      await ctx.db.transaction(async (trx) => {
        // delete previous invite if exists
        await trx
          .delete(operatorsInvite)
          .where(and(eq(operatorsInvite.email, input.email)))
          .execute();
        const result = await trx
          .insert(operatorsInvite)
          .values({
            email: input.email,
            payload: {
              name: input.payload.name,
              email: input.payload.email,

              phone: input.payload.phone,
              location_ids: input.payload.location_ids,
              contact_info: input.payload.contact_info ?? undefined,
            },
            expires: oneWeekFromNow,
            invite_id,
          })
          .execute();
      });
      const newOpInvite = await ctx.db.query.operatorsInvite.findFirst({
        where: (tb, op) => op.eq(tb.invite_id, invite_id),
      });
      console.log(newOpInvite);

      await sendEmail({
        to: input.email,
        from: env.EMAIL_FROM,
        subject: "הזמנה להצטרפות למערכת - חרבות ברזל",
        react: OperatorInviteEmail({
          inviteLink: `${
            env.NODE_ENV === "development"
              ? getBaseUrl()
              : "https://ironswords.xyz"
          }/operator-invite/${encodeInvite({
            invite_id,
            expires: newOpInvite?.expires?.getTime() ?? 0,
          })}`,
        }),

        // OperatorInviteEmail({
        //   inviteLink: `${getBaseUrl()}/operator-invite/${invite_id}/${Number(
        //     oneWeekFromNow,
        //   )}`,
      });
      return {
        status: "OK",
      };
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
            op.eq(tb.expires, new Date(parseInt(input.expires))),
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
  claimInvite: protectedProcedure
    .input(
      z.object({
        expires: z.string(),
        invite_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const expires = new Date(parseInt(input.expires));
      const targetInvite = await ctx.db.query.operatorsInvite.findFirst({
        where: (tb, op) =>
          and(op.eq(tb.invite_id, input.invite_id), op.eq(tb.expires, expires)),
      });
      if (!targetInvite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invite not found",
        });
      }
      const { payload } = targetInvite;
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
      if (!payload.location_ids?.length || payload.location_ids?.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No locations selected",
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
              eq(operatorsInvite.expires, expires),
            ),
          )
          .execute();
        const operator_id = nanoid();
        const operator = await trx.insert(operators).values({
          user_id: targetUser.id,
          ...targetInvite.payload,
          operator_id,
        });
        const updateUser = await trx
          .update(users)
          .set({
            role: "OPERATOR",
          })
          .where(
            and(eq(users.id, targetUser.id), not(eq(users.role, "ADMIN"))),
          );
        const createLocationOperators = await trx
          .insert(locationOperators)
          .values(
            payload.location_ids.map((location_id) => ({
              location_id,
              operator_id,
            })),
          );
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
