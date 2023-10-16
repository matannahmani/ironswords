"use client";
import type React from "react";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { Button } from "../ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { TableFilter } from "./table-filter";
import {
  ticketPriority,
  ticketStatus,
} from "@/app/operators/[locationId]/tickets/data/data";
import { filterAtoms } from "@/app/cards-container";
import { useAtom } from "jotai";
const useDebounced = ({
  value,
  key,
}: {
  value: string | string[] | undefined;
  key: string;
}) => {
  const debouncedValue = useDebounce<string | string[] | undefined>(value, 100);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (!debouncedValue || debouncedValue === "") {
      newParams.delete(key);
      router.push(`${pathname}?${newParams.toString()}`);
    } else {
      if (Array.isArray(debouncedValue)) {
        newParams.delete(key);
        debouncedValue
          .filter((s) => s.length > 0)
          .forEach((v, index) => {
            if (index === 0) {
              newParams.set(key, v);
            } else newParams.append(key, v);
          });
      } else newParams.set(key, debouncedValue);
      router.push(`${pathname}?${newParams.toString()}`);
    }
  }, [debouncedValue]);
  return null;
};

useDebounced.displayName = "useDebounced";

// const useDebounceFilterChange = ()

export const TicketsFilter: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useAtom(filterAtoms);
  const { title, status, priority } = state;
  // useDebounced({ value: title, key: "title" });
  // useDebounced({ value: status, key: "status" });
  // useDebounced({ value: priority, key: "priority" });
  const isFiltered =
    title || (status?.length ?? 0) > 0 || (priority?.length ?? 0) > 0;
  const reset = () => {
    const newParams = new URLSearchParams();
    setState({
      title: "",
      status: [],
      priority: [],
      offset: 1,
    });
  };

  const onFilterChange = (
    target: "status" | "priority" | "title",
    val: string[] | string | undefined,
  ) => {
    if (val?.length === 0) val = undefined;
    setState((prev) => ({
      ...prev,
      [target]: val,
    }));
  };

  return (
    <div className="flex  items-center gap-2">
      <Input
        placeholder="לחיפוש לפי כותרת"
        value={title}
        onChange={(event) => onFilterChange("title", event.target.value)}
        className="h-8 w-[150px] lg:w-[250px]"
      />

      <TableFilter
        selectedValues={new Set([...(status ?? "")])}
        setFilterValue={(val) => onFilterChange("status", val)}
        title="סטטוס פנייה"
        options={ticketStatus ?? []}
      />
      <TableFilter
        selectedValues={new Set([...(priority ?? "")])}
        title="עדיפות פנייה"
        setFilterValue={(val) => onFilterChange("priority", val)}
        options={ticketPriority ?? []}
      />
      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => reset()}
          className="h-8 px-2 lg:px-3"
        >
          נקה סינון
          <Cross2Icon className="mr-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
