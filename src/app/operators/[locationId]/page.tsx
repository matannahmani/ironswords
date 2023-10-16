import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

import { columns } from "./tickets/components/columns";
import { DataTable } from "./tickets/components/data-table";
import { UserNav } from "./tickets/components/user-nav";
import { taskSchema } from "./tickets/data/schema";
import { api } from "@/trpc/server";
import { RouterInputs } from "@/trpc/shared";
import { getLocationTicketsSchema } from "@/shared/zod/tickets";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { SelectLocations } from "@/components/navigation/select-locations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequestCard } from "@/components/cards/request-card";
import { auth } from "@/server/auth";
export const metadata: Metadata = {
  title: "Tickets",
  description: "Track all your call requests",
};

export default async function TicketsPage({
  searchParams,
  params,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  params: {
    locationId: string;
  };
}) {
  const fetchInput = getLocationTicketsSchema.safeParse({
    limit: Number(searchParams.limit) || 10,
    offset: Number(searchParams.offset) || 0,
    ...searchParams,
    location_id: params.locationId === "all" ? undefined : params.locationId,
  });

  if (!fetchInput.success) {
    console.log("fetchInput.error", fetchInput.error);
    return (
      <div className="flex flex-col gap-2 p-4">
        <span className="text-lg font-semibold">
          נמצא שגיאה בפרמטרים אנא עדכן את החיפוש שלך <br />
          אנא וודא שבחרת מיקום
        </span>
      </div>
    );
  }

  const dataP = api.location.tickets.query(fetchInput.data);

  const meP = api.user.myLocations.query();
  const [data, me] = await Promise.all([dataP, meP]);
  return (
    <>
      <div className="flex h-full flex-1 flex-col space-y-4 p-4  md:space-y-8 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              ברוך שובך למערכת חרבות ברזל!
            </h2>
            <p className="text-muted-foreground">
              זהו רשימת הפניות שלך לשבוע זה!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="">פתיחת פנייה</Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] sm:max-w-[425px]">
                <RequestCard
                  operator_id={me.operator.operator_id}
                  location_id={fetchInput.data.location_id}
                  city_id={
                    me.locations.find(
                      (l) => l.location_id === fetchInput.data.location_id,
                    )?.location?.city_id ?? "_"
                  }
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <DataTable
          initalPage={{
            pageSize: fetchInput.data.limit,
            pageIndex: fetchInput.data.offset,
          }}
          initalFilters={{
            location_id: fetchInput.data.location_id,
          }}
          data={data}
          columns={columns}
        />
      </div>
    </>
  );
}
