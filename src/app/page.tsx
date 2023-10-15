import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Sidebar from "@/components/navigation/sidebar";
import SearchFilter from "@/components/filters/search-filter";
import { createSelectSchema } from "drizzle-zod";
import { tickets } from "@/server/db/schema";
import { Badge } from "@/components/ui/badge";
import CardsContainer from "./cards-container";
import { randomInt } from "crypto";
import { priotityToHE, statusToHE } from "@/shared/zod/base";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { TicketsFilter } from "@/components/filters/tickets-filter";
import { RouterInputs } from "@/trpc/shared";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RequestCallCard } from "@/components/cards/request-call-card";
// array of numbers 1-50
const array50 = Array.from(Array(50).keys()).map((i) => ({ id: i + 1 }));

const RenderCards = async () => {
  const data = await api.city.tickets.query({
    limit: 10,
    offset: 1,
    city_id: "66rnmiNulGHzRz_qKLTeW",
  });

  return (
    <CardsContainer
      initalData={data}
      hasNextPage={data.hasNextPage}
      hasPreviousPage={data.hasPreviousPage}
    />
  );
};

const TicketModal = async ({ ticket_id }: { ticket_id?: string }) => {
  if (!ticket_id) return null;
  const data = await api.tickets.getOne.query(ticket_id);
  if (!data) return null;

  return (
    <Dialog defaultOpen={true}>
      <DialogContent className="!w-fit">
        <RequestCallCard
          id={data.ticket_id}
          urgency={data.priority}
          date={
            data.created_at?.toLocaleDateString("he-IL", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            }) || ""
          }
          {...data}
          description={data.description ?? ""}
          urgencyLabel={priotityToHE(data.priority ?? "LOW").label}
          statusLabel={statusToHE(data.status ?? "OPEN")?.label ?? "פתוחה"}
          className="border-none"
        />
      </DialogContent>
    </Dialog>
  );
};

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const offset = parseInt(searchParams.page as string) || 1;
  return (
    <>
      <div className="flex h-full flex-1 flex-col space-y-4 p-4  md:space-y-8 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              ברוך הבא למערכת חרבות ברזל!
            </h2>
            <p className="text-muted-foreground">להלן רשימת הפניות</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button disabled className="">
              שתף
              <Share className="ms-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <TicketsFilter />
          <Suspense
            fallback={
              <Loader2 className="m-auto h-8 w-8 animate-spin text-primary" />
            }
          >
            <RenderCards />
          </Suspense>
        </div>
      </div>
      <Suspense>
        <TicketModal
          ticket_id={
            typeof searchParams.ticket_id === "string"
              ? searchParams.ticket_id
              : undefined
          }
        />
      </Suspense>
    </>
  );
}
