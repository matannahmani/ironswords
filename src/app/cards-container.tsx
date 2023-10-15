"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { priotityToHE, statusToHE } from "@/shared/zod/base";
import { api } from "@/trpc/react";
import { RouterInputs, RouterOutputs } from "@/trpc/shared";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { atom, useAtomValue } from "jotai";
import { Suspense } from "react";
import { RequestCallCard } from "@/components/cards/request-call-card";

export const filterAtoms = atom<{
  status: RouterInputs["city"]["tickets"]["status"];
  priority: RouterInputs["city"]["tickets"]["priority"];
  offset: number;
  title: string;
}>({
  status: undefined,
  priority: undefined,
  offset: 1,
  title: "",
});

const CardsContainer: React.FC<{
  hasNextPage?: boolean;
  initalData: RouterOutputs["city"]["tickets"];
  hasPreviousPage?: boolean;
}> = ({ hasNextPage, hasPreviousPage, initalData }) => {
  const [parent] = useAutoAnimate();
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const filters = useAtomValue(filterAtoms);
  const { data, isLoading } = api.city.tickets.useQuery(
    {
      limit: 10,
      ...filters,
      city_id: "66rnmiNulGHzRz_qKLTeW",
    },
    {
      refetchInterval: 10000,
      initialData: initalData,
      keepPreviousData: true,
    },
  );
  const handlePageMove = (direction: "next" | "previous") => {
    const newParams = new URLSearchParams(params);
    const currentPage = Number(newParams.get("page"));
    if (direction === "next") {
      newParams.set("page", String(currentPage + 1));
    } else {
      newParams.set("page", String(currentPage - 1));
    }
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className="mt-auto flex flex-1 flex-row flex-wrap gap-4 py-2"
        ref={parent}
      >
        {data.page.length === 0 && (
          <div className="m-auto flex h-64 w-64 flex-col items-center justify-center self-center">
            <span className="text-lg font-semibold">לא נמצאו פניות</span>
          </div>
        )}

        {data.page.map((row, index) => (
          <RequestCallCard
            key={`row-${row.ticket_id}`}
            title={row.title ?? ""}
            description={row.description ?? ""}
            urgencyLabel={priotityToHE(row.priority)?.label ?? "לא ידוע"}
            // date="2021-09-01"
            urgency={row.priority}
            status={row.status}
            date={row.created_at?.toLocaleDateString() ?? "לא ידוע"}
            statusLabel={statusToHE(row.status)?.label ?? "לא ידוע"}
            id={row.ticket_id}
          />
        ))}
      </div>
      <div className="flex flex-row justify-end gap-2">
        <Button
          disabled={!hasPreviousPage}
          onClick={() => handlePageMove("previous")}
          variant="outline"
        >
          {/* Previous Page */}
          עמוד קודם
        </Button>
        <Button disabled={!hasNextPage} onClick={() => handlePageMove("next")}>
          {/* Next Page */}
          עמוד הבא
        </Button>
      </div>
    </Suspense>
  );
};

export default CardsContainer;
