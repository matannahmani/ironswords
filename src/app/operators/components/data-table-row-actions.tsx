"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";

import { labels } from "../data/data";
import { taskSchema } from "../data/schema";
import { Pen, View } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RequestCard } from "@/components/cards/request-card";
import { OperatorCard } from "@/components/cards/operator-card";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-fit">
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Pen className="me-2 h-4 w-4" />
              <span>ערוך</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            {/* @ts-expect-error - generic is not fully typed yet. */}
            <OperatorCard {...row.original} />
          </DialogContent>
        </Dialog>
        <DropdownMenuSeparator />
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <View className="me-2 h-4 w-4" />
              <span>צפה</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            {/* @ts-expect-error - generic is not fully typed yet. */}
            <OperatorCard {...row.original} readonly />
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
