import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { UserNav } from "./components/user-nav";
import { taskSchema } from "./data/schema";
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
export const metadata: Metadata = {
  title: "Tickets",
  description: "Track all your call requests",
};

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const cookiesJar = cookies();

  const fetchInput = getLocationTicketsSchema.safeParse({
    limit: 10,
    offset: 1,
    ...searchParams,
  });

  if (!fetchInput.success) {
    console.log("fetchInput.error", fetchInput.error);
    return (
      <div className="flex flex-col gap-2">
        <span className="text-lg font-semibold">
          נמצא שגיאה בפרמטרים אנא עדכן את החיפוש שלך
        </span>
      </div>
    );
  }
  const data = await api.location.tickets.query(fetchInput.data);

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
                <RequestCard />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <DataTable data={data.page ?? []} columns={columns} />
      </div>
    </>
  );
}
