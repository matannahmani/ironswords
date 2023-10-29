import type { NextApiRequest, NextApiResponse } from "next";
import { renderTrpcPanel } from "trpc-panel";
import { appRouter } from "@/server/api/root";
import {getUrl} from "@/trpc/shared";
import { env } from "@/env.mjs";
export default async function handler(_: NextApiRequest, res: NextApiResponse) {
    return res.status(200).send(
        env.NODE_ENV === "production" ? 'Not authorized' :
        renderTrpcPanel(appRouter, {
            url: getUrl(),
            transformer: "superjson",
        })
    );
}
