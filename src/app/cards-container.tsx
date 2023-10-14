"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const CardsContainer: React.FC<{
  children: React.ReactNode | React.ReactNode[];
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}> = ({ children, hasNextPage, hasPreviousPage }) => {
  const [parent] = useAutoAnimate();
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
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
      <div className="flex flex-row flex-wrap gap-4" ref={parent}>
        {children}
      </div>
      <div className="flex flex-row justify-end gap-2">
        <Button
          disabled={!hasPreviousPage}
          onClick={() => handlePageMove("previous")}
          variant="outline"
        >
          Previous Page
        </Button>
        <Button disabled={!hasNextPage} onClick={() => handlePageMove("next")}>
          Next Page
        </Button>
      </div>
    </>
  );
};

export default CardsContainer;
