import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { taskSchema } from "./data/schema";
import { api } from "@/trpc/server";
import { RouterInputs } from "@/trpc/shared";
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
import { pageSchema } from "@/shared/zod/base";
import { LocationCard } from "@/components/cards/location-card";
import { OperatorCard } from "@/components/cards/operator-card";
import { CitiesInitailizer } from "./components/cities-context";
export const metadata: Metadata = {
  title: "Operators",
  description: "Track all your operators requests",
};

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const fetchInput = pageSchema.safeParse({
    limit: Number(searchParams.limit) || 10,
    offset: Number(searchParams.offset) || 0,
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
  const citiesP = api.city.all.query();
  const dataP = api.operator.getMany.query(fetchInput.data);
  const [cities, data] = await Promise.all([citiesP, dataP]);

  return (
    <>
      <CitiesInitailizer cities={cities} />
      <div className="flex h-full flex-1 flex-col space-y-4 p-4  md:space-y-8 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              ברוך שובך למערכת חרבות ברזל!
            </h2>
            <p className="text-muted-foreground">
              כאן תוכל לצפות רשימת המתאמים שלך
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="">צור מתאם</Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] sm:max-w-[425px]">
                <OperatorCard />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <DataTable
          initalPage={{
            pageSize: fetchInput.data.limit,
            pageIndex: fetchInput.data.offset,
          }}
          data={data}
          columns={columns}
          initalFilters={{
            ...fetchInput.data,
          }}
        />
      </div>
    </>
  );
}
