import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Sidebar from "@/components/navigation/sidebar";
import SearchFilter from "@/components/filters/search-filter";
import { createSelectSchema } from "drizzle-zod";
import { tickets } from "@/server/db/schema";
import { Badge } from "@/components/ui/badge";
import { RequestCallCard } from "@/components/cards/request-call-card";
import CardsContainer from "./cards-container";
import { randomInt } from "crypto";

// array of numbers 1-50
const array50 = Array.from(Array(50).keys()).map((i) => ({ id: i + 1 }));

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const page = parseInt(searchParams.page as string) || 1;
  console.log("page", page);
  return (
    <div className="container flex flex-1 grow flex-col gap-4 py-4 md:py-8">
      <div className="flex flex-col gap-2">
        <Badge className="w-fit font-semibold">Urgency</Badge>
        <SearchFilter
          label="Urgency"
          paramName="urgency"
          items={[
            ...tickets.priority.enumValues.map((value) => ({
              value: value,
              label: value,
            })),
          ]}
        />
      </div>
      <div className="flex flex-col gap-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          On Going Requests
        </h4>
        <CardsContainer hasNextPage={page < 5} hasPreviousPage={page > 1}>
          {array50.slice((page - 1) * 10, page * 10).map((_, index) => (
            <RequestCallCard
              key={`id_${_.id}`}
              title={`Request #${_.id}`}
              description="This is a description"
              urgency="High"
              date="2021-09-01"
              status="On Going"
              id={_.id}
            />
          ))}
        </CardsContainer>
      </div>
    </div>
  );
}
