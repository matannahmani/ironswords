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
import { priotityToHE, statusToHE } from "@/shared/zod/base";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { TicketsFilter } from "@/components/filters/tickets-filter";
import { RouterInputs } from "@/trpc/shared";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
// array of numbers 1-50
const array50 = Array.from(Array(50).keys()).map((i) => ({ id: i + 1 }));

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const offset = parseInt(searchParams.page as string) || 1;
  const data = await api.city.tickets.query({
    limit: 10,
    offset,
    city_id: "66rnmiNulGHzRz_qKLTeW",
  });
  return (
    // <div className="container flex flex-1 grow flex-col gap-4 py-4 md:py-8">
    //   <div className="flex flex-col gap-2">
    //     <Badge className="w-fit font-semibold">דרגת דחיפות</Badge>
    //     <SearchFilter
    //       label="דרגת דחיפות"
    //       paramName="urgency"
    //       items={[
    //         ...tickets.priority.enumValues.map((value) => {
    //           const labelData = priotityToHE(value);
    //           return {
    //             value: value,
    //             label: labelData.label,
    //             color: labelData.color,
    //           };
    //         }),
    //       ]}
    //     />
    //   </div>
    //   <div className="flex flex-1 flex-col gap-4">
    //     <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
    //       {/* On Going Requests */}
    //       פניות פתוחות
    //     </h4>
    //     <CardsContainer
    //       hasNextPage={data.hasNextPage}
    //       hasPreviousPage={data.hasPreviousPage}
    //     >
    //       {data.page.map((row, index) => (
    //         <RequestCallCard
    //           key={`${row.ticket_id}`}
    //           title={row.title ?? ""}
    //           description={row.description ?? ""}
    //           urgency={priotityToHE(row.priority)?.label ?? "לא ידוע"}
    //           // date="2021-09-01"
    //           date={row.created_at?.toLocaleDateString() ?? "לא ידוע"}
    //           status={statusToHE(row.status)?.label ?? "לא ידוע"}
    //           id={row.ticket_id}
    //         />
    //       ))}
    //     </CardsContainer>
    //   </div>
    // </div>
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
            <div className="p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              טוען נתונים
            </div>
          }
        >
          <CardsContainer
            initalData={data}
            hasNextPage={data.hasNextPage}
            hasPreviousPage={data.hasPreviousPage}
          >
            {data.page.length === 0 && (
              <div className="m-auto flex h-64 flex-col items-center justify-center self-center">
                <span className="text-lg font-semibold">לא נמצאו פניות</span>
              </div>
            )}
          </CardsContainer>
        </Suspense>
      </div>
    </div>
  );
}
