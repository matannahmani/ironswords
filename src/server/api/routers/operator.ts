import { adminProcedure } from "./../trpc";

import { z } from "zod";

import {
  createTRPCRouter,
  operatorProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { insertOperatorSchema, pageSchema } from "@/shared/zod/base";
import { locationOperators, operators, users } from "@/server/db/schema";
import { and, eq, not, notInArray, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";

export const operatorRouter = createTRPCRouter({
  getMany: adminProcedure.input(pageSchema).query(async ({ ctx, input }) => {
    const pageP = ctx.db.query.operators.findMany({
      with: {
        locationOperators: {
          with: {
            location: {
              with: {
                city: true,
              },
            },
          },
        },
      },
      offset: (input.offset ?? 0) * (input.limit ?? 10),
      limit: input.limit ?? 10,
    });
    const totalP = ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(operators)
      .execute();
    const [page, total] = await Promise.all([pageP, totalP]);

    return {
      total: Number(total?.[0]?.count ?? 0),
      page,
      totalPages: Math.ceil((total?.[0]?.count ?? 0) / input.limit),
    };
  }),
  createOne: adminProcedure
    .input(
      insertOperatorSchema.merge(
        z.object({
          location_ids: z.array(z.string()),
          email: z.string().email(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      // first find email in users table
      const user = await ctx.db.query.users.findFirst({
        where: (tb, op) => op.eq(tb.email, input.email),
      });
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist",
          cause: z.makeIssue({
            data: input.email,
            path: ["email"],
            issueData: {
              code: "custom",
              fatal: true,
              message: "לא נמצא משתמש עם כתובת המייל הזו",
            },
            errorMaps: [],
          }),
        });
      }
      const operator_id = nanoid();
      await ctx.db.transaction(async (trx) => {
        await trx
          .insert(operators)
          .values({ ...input, operator_id, user_id: user.id })
          .execute();

        // inset new location operators
        await trx
          .insert(locationOperators)
          .values([
            ...input.location_ids.map((location_id) => ({
              location_id,
              operator_id,
            })),
          ])
          .execute();
        if (user.role === "USER")
          await trx
            .update(users)
            .set({ role: "OPERATOR" })
            .where(eq(users.id, user.id))
            .execute();
      });
      return "INSERTED";
    }),
  updateOne: adminProcedure
    .input(
      insertOperatorSchema.merge(
        z.object({
          location_ids: z.array(z.string()),
          operator_id: z.string(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      // update locationOperators
      await ctx.db.transaction(async (trx) => {
        // first delete all location operators ids that are not in the new list
        await trx
          .delete(locationOperators)
          .where(
            and(
              eq(locationOperators.operator_id, input.operator_id),
              notInArray(locationOperators.location_id, input.location_ids),
            ),
          )
          .execute();
        // then insert new location operators
        await trx
          .insert(locationOperators)
          .values(
            input.location_ids.map((location_id) => ({
              location_id,
              operator_id: input.operator_id,
            })),
          )
          /**
           * drizzle mysql https://orm.drizzle.team/docs/insert#on-conflict-do-nothing
           * While MySQL does not directly support doing nothing on conflict,
           * you can perform a no-op by setting any column's value to itself and achieve the same effect:
           */
          .onDuplicateKeyUpdate({ set: { operator_id: input.operator_id } })
          .execute();
        await trx
          .update(operators)
          .set({
            name: input.name,
            phone: input.phone,
            contact_info: input.contact_info,
          })
          .where(eq(operators.operator_id, input.operator_id))
          .execute();
      });
      return "OK";
    }),
  deleteOne: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(operators)
        .where(eq(operators.user_id, input))
        .execute();
    }),
});
