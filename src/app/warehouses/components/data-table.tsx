"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@ui/table";

import {DataTablePagination} from "@/components/table/data-table-pagination";
import {DataTableToolbar} from "./data-table-toolbar";
import {api} from "@/trpc/react";
import {RouterInputs, RouterOutputs} from "@/trpc/shared";
import {Loader2} from "lucide-react";
import {useViewValue} from "./view-switch";
import {useAutoAnimate} from "@formkit/auto-animate/react";

interface DataTableProps<TValue> {
  columns: ColumnDef<
    RouterOutputs["warehouse"]["getMany"]["page"][number],
    TValue
  >[];
  data: RouterOutputs["warehouse"]["getMany"];
  initalPage: PaginationState;
  initalFilters: RouterInputs["warehouse"]["getMany"];
}

const usePagination = ({ initalPage }: { initalPage: PaginationState }) => {
  const viewMode = useViewValue();
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>(initalPage);

  React.useEffect(() => {
    setPagination((prev) => ({
      pageIndex: 0,
      pageSize: prev.pageSize,
    }));
  }, [viewMode]);

  return [{ pageIndex, pageSize }, setPagination] as const;
};

export function DataTable<TValue>({
  columns,
  data: initalData,
  initalPage,
  initalFilters,
}: DataTableProps<TValue>) {
  const viewMode = useViewValue();
  const [{ pageIndex, pageSize }, setPagination] = usePagination({
    initalPage,
  });
  const [animateRef] = useAutoAnimate();
  const [filters, setFilters] = React.useState({
    ...initalFilters,
  });

  const { data: queryData, isLoading: isWarehouseLoading } =
    api.warehouse.getMany.useQuery(
      {
        limit: pageSize,
        offset: pageIndex,
      },
      {
        enabled: viewMode === "operators",
        initialData: initalData,
        keepPreviousData: true,
        refetchInterval: 10000,
      },
    );
  const isLoading = isWarehouseLoading;
  const data = queryData.page;
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const table = useReactTable({
    data: data,
    columns: columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination,
      columnFilters,
    },
    enableRowSelection: true,
    pageCount: queryData.totalPages,
    manualPagination: true,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div ref={animateRef} className="flex flex-1 flex-col space-y-4">
      {viewMode === "operators" && <DataTableToolbar table={table} />}
      <div
        key={`viewmode-con-${viewMode}`}
        className="relative flex-1 rounded-md border"
      >
        <Table key={`viewmode-${viewMode}`}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="h-full w-full">
            {table.getRowModel()?.rows?.length ? (
              table.getRowModel()?.rows?.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  לא נמצאו תוצאות
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {
          <div
            data-state={isLoading ? "open" : "closed"}
            className="absolute top-10 mb-8 flex h-[calc(100%_-_48px)] w-full items-center justify-center duration-200 data-[state=closed]:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          >
            <Loader2 className="z-10 h-8 w-8 animate-spin text-primary " />
            <div
              data-state={isLoading ? "open" : "closed"}
              className="absolute inset-0 h-full w-full bg-background/10 backdrop-blur-sm duration-200 data-[state=closed]:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            />
          </div>
        }
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
