import { z } from "zod";

import {
  createTRPCRouter,
  operatorProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  whoami: publicProcedure.query(({ ctx }) => {
    return {
      session: ctx.session,
    };
  }),
  myLocations: operatorProcedure.query(({ ctx }) => {
    return {
      locations: ctx.session.operator.locationOperators,
    };
  }),
});
