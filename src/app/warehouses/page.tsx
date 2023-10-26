import {Metadata} from "next";
import {api} from "@/trpc/server";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTrigger,} from "@/components/ui/dialog";
import {pageSchema} from "@/shared/zod/base";
import {OperatorCard} from "@/components/cards/operator-card";
import {columns} from "@/app/warehouses/components/columns";
import {DataTable} from "@/app/warehouses/components/data-table";

export const metadata: Metadata = {
    title: "Warehouses",
    description: "Track all your warehouses",
};

export default async function WarehousePage({
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
    const warehouses = api.warehouse.all.query(fetchInput.data);
    const [data] = await Promise.all([warehouses]);

    return (
        <>
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
                    <div className="flex flex-wrap items-center gap-4 space-x-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="">הזמן מתאם</Button>
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
