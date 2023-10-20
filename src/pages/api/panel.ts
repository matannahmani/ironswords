import type { NextApiRequest, NextApiResponse } from "next";
import { renderTrpcPanel } from "trpc-panel";
import { appRouter } from "@/server/api/root";
import {getUrl} from "@/trpc/shared";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
    res.status(200).send(
        renderTrpcPanel(appRouter, {
            url: getUrl(),
            transformer: "superjson",
        })
    );
}
