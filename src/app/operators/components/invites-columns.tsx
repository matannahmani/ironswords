/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { type RowData, type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@ui/badge";
import { Checkbox } from "@ui/checkbox";

import { labels, ticketPriority, ticketStatus } from "../data/data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { type RouterOutputs } from "@/trpc/shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    title: string;
  }
}
export const inviteColumns: ColumnDef<
  RouterOutputs["operatorInvites"]["getMany"]["page"][number]
>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="ms-4 translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "invite_id",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="מזהה" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("invite_id")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      title: "מזהה",
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="איימל" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.original.email}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      title: "איימל",
    },
  },
  {
    accessorKey: "is_claimed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="האם אושרה" />
    ),
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.is_claimed ? "secondary" : "destructive"}>
          {row.original.is_claimed ? "כן" : "לא"}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
