import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  whoami: publicProcedure.query(({ ctx }) => {
    return {
      session: ctx.session,
    };
  }),
});
