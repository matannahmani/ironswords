import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { locationRouter } from "./routers/location";
import { cityRouter } from "./routers/city";
import { ticketsRouter } from "./routers/tickets";
import { operatorRouter } from "./routers/operator";
import { operatorInvitesRouter } from "./routers/operator-invites";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  location: locationRouter,
  operator: operatorRouter,
  operatorInvites: operatorInvitesRouter,
  city: cityRouter,
  tickets: ticketsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
