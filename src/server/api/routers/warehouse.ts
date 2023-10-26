import {z} from "zod";
import {adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure} from "@/server/api/trpc";
import {locations, warehouses} from "@/server/db/schema";
import {insertWarehouseSchema, pageSchema} from "@/shared/zod/base";
import {eq, sql} from "drizzle-orm";

export const warehouseRouter = createTRPCRouter({
    createOne: protectedProcedure
        .input(insertWarehouseSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.insert(warehouses).values(input).execute();
        }),
    createMany: protectedProcedure
        .input(z.array(insertWarehouseSchema))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.insert(warehouses).values(input).execute();
        }),
    getMany: adminProcedure.input(pageSchema).query(async ({ ctx, input }) => {
        return await ctx.db.query.warehouses.findMany({
            offset: input.offset,
            limit: input.limit,
        });
    }),
    all: protectedProcedure.input(pageSchema).query(async ({ ctx, input }) => {
        const dataP = await ctx.db.query.warehouses.findMany({
            offset: input.offset,
            limit: input.limit,
        });
        const totalP = ctx.db
            .select({ count: sql<number>`count(*)` })
            .from(warehouses)
            .execute();
        const [page, total] = await Promise.all([dataP, totalP]);

        return {
            total: Number(total?.[0]?.count ?? 0),
            page,
            totalPages: Math.ceil((total?.[0]?.count ?? 0) / input?.limit ?? 10),
        };
        // return await ctx.db.query.warehouses.findMany();
    }),
    getOne: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
        return await ctx.db.query.warehouses.findFirst({
            where: (tb, op) => op.eq(tb.warehouse_id, input),
        });
    }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                data: insertWarehouseSchema,
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, data } = input;
            await ctx.db.update(warehouses)
                .set(data)
                .where(eq( warehouses.warehouse_id, id ))
                .execute();
            return { message: "Warehouse updated successfully" };
        }),
    delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
        await ctx.db.delete(warehouses).where(eq( warehouses.warehouse_id, input )).execute();
        return { message: "Warehouse deleted successfully" };
    }),
    getWarehousesInCity: publicProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            return await ctx.db.select().from(warehouses).innerJoin(locations, eq(warehouses.location_id, locations.location_id)).where(eq(locations.city_id, input)).execute();
        }),
});
