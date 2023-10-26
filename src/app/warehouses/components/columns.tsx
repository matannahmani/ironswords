/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import {type ColumnDef, type RowData} from "@tanstack/react-table";
import {Checkbox} from "@ui/checkbox";
import {DataTableColumnHeader} from "./data-table-column-header";
import {DataTableRowActions} from "./data-table-row-actions";
import {type RouterOutputs} from "@/trpc/shared";

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    title: string;
  }
}
export const columns: ColumnDef<
  RouterOutputs["warehouse"]["getMany"][number]
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
    accessorKey: "warehouse_id",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="מזהה" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("warehouse_id")}</div>,
    enableSorting: false,
    enableHiding: false,
    meta: {
      title: "מזהה",
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="
      שם
      "
      />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.);

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
    meta: {
      title: "שם המתאם",
    },
  },
  {
    accessorKey: "location_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="איימל" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.original.location_id}</span>
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
    accessorKey: "capacity",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="איימל" />
    ),
    cell: ({ row }) => {
      return (
          <div className="flex items-center">
            <span>{row.original.capacity}</span>
          </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      title: "נפח",
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
