import {z} from "zod";
import {adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure} from "@/server/api/trpc";
import {citys, locations, warehouses} from "@/server/db/schema";
import {insertWarehouseSchema, pageSchema} from "@/shared/zod/base";
import {eq} from "drizzle-orm";

export const warehouseRouter = createTRPCRouter({
    createOne: protectedProcedure
        .input(insertWarehouseSchema)
        .mutation(async ({ctx, input}) => {
            return await ctx.db.insert(warehouses).values(input).execute();
        }),
    createMany: protectedProcedure
        .input(z.array(insertWarehouseSchema))
        .mutation(async ({ctx, input}) => {
            return await ctx.db.insert(warehouses).values(input).execute();
        }),
    getMany: adminProcedure.input(pageSchema).query(async ({ctx, input}) => {
        return await ctx.db.query.warehouses.findMany({
            offset: input.offset,
            limit: input.limit,
            with: {
                location: true,
            }
        });
    }),
    all: protectedProcedure.query(async ({ctx}) => {
        return await ctx.db.query.warehouses.findMany();
    }),
    getOne: adminProcedure.input(z.string()).query(async ({ctx, input}) => {
        return await ctx.db.query.warehouses.findFirst({
            where: (tb, op) => op.eq(tb.warehouse_id, input),
            with: {
                location: true,
            }
        });
    }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                data: insertWarehouseSchema,
            })
        )
        .mutation(async ({ctx, input}) => {
            const {id, data} = input;
            await ctx.db.update(warehouses)
                .set(data)
                .where(eq(warehouses.warehouse_id, id))
                .execute();
            return {message: "Warehouse updated successfully"};
        }),
    delete: protectedProcedure.input(z.string()).mutation(async ({ctx, input}) => {
        await ctx.db.delete(warehouses).where(eq(warehouses.warehouse_id, input)).execute();
        return {message: "Warehouse deleted successfully"};
    }),
    getWarehousesInCity: publicProcedure
        .input(z.string())
        .query(async ({ctx, input}) => {
            const locationIds = await ctx.db.select({location_id:locations.location_id}).from(locations).where(eq(locations.city_id, input)).execute();
            return await ctx.db.query.warehouses.findMany({
                where: (tb, op) => op.inArray(tb.location_id, locationIds.flatMap(id => id.location_id)),
                with: {
                    location: true,
                }
            }).execute();
        }),
});
