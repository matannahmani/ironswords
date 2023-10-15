"use client";
import { RequestCallCard } from "@/components/cards/request-call-card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { priotityToHE, statusToHE } from "@/shared/zod/base";
import { api } from "@/trpc/react";
import { RouterInputs, RouterOutputs } from "@/trpc/shared";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { atom, useAtomValue } from "jotai";

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
  children: React.ReactNode | React.ReactNode[];
  hasNextPage?: boolean;
  initalData: RouterOutputs["city"]["tickets"];
  hasPreviousPage?: boolean;
}> = ({ children, hasNextPage, hasPreviousPage, initalData }) => {
  const [parent] = useAutoAnimate();
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const filters = useAtomValue(filterAtoms);
  const [data] = api.city.tickets.useSuspenseQuery(
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
    <>
      <div
        className="mt-auto flex flex-1 flex-row flex-wrap gap-4"
        ref={parent}
      >
        {data.page.map((row, index) => (
          <RequestCallCard
            key={`${row.ticket_id}`}
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
    </>
  );
};

export default CardsContainer;
