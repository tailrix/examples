"use client"
import React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowData,
    Row,
    useReactTable,
} from "@tanstack/react-table";
import {
    DndContext,
    DragEndEvent,
    MouseSensor,
    TouchSensor,
    KeyboardSensor,
    UniqueIdentifier,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    IconChevronDown,
    IconLayoutColumns,
} from "@tabler/icons-react"
import { createUser } from "@/app/actions/users"
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import {
    IconGripVertical,
} from "@tabler/icons-react";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Paginator } from "@/components/paginator";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export interface DataTableProps<TData extends { id: UniqueIdentifier }> {
    data: TData[];
    columns: ColumnDef<TData>[];
    initialPageSize?: number;
    enableRowReorder?: boolean;
    getRowId?: (row: TData) => UniqueIdentifier;
    onReorder?: (rows: TData[]) => void;
    addNewDialogue?: React.ReactNode
}

export function DataTable<TData extends { id: UniqueIdentifier }>(props: DataTableProps<TData>) {
    const {
        data: initialData,
        columns,
        initialPageSize = 10,
        enableRowReorder = false,
        getRowId = (row) => row.id as UniqueIdentifier,
        onReorder,
        addNewDialogue
    } = props;

    const [data, setData] = React.useState<TData[]>(() => initialData);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: initialPageSize,
    });

    const ids = React.useMemo<UniqueIdentifier[]>(
        () => data.map((r) => getRowId(r)),
        [data, getRowId]
    );

    const sortableId = React.useId()
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor)
    );

    const handleDragEnd = (evt: DragEndEvent) => {
        if (!enableRowReorder) return;
        const { active, over } = evt;
        if (active && over && active.id !== over.id) {
            setData((old) => {
                const oldIdx = ids.indexOf(active.id);
                const newIdx = ids.indexOf(over.id);
                const newRows = arrayMove(old, oldIdx, newIdx);
                onReorder?.(newRows);
                return newRows;
            });
        }
    };

    const dragColumn: ColumnDef<TData> | null = enableRowReorder
        ? {
            id: "drag",
            header: () => null,
            cell: ({ row }) => <DragHandle id={row.id as UniqueIdentifier} />,
            enableSorting: false,
            enableHiding: false,
            size: 24,
        }
        : null;

    const table = useReactTable<TData>({
        data,
        columns: dragColumn ? [dragColumn, ...columns] : columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,

        getRowId: (row) => getRowId(row).toString(),

        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <IconLayoutColumns />
                            <span className="hidden lg:inline">Customize Columns</span>
                            <span className="lg:hidden">Columns</span>
                            <IconChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) =>
                                    typeof column.accessorFn !== "undefined" &&
                                    column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
                {addNewDialogue}
            </div>
            <div className="overflow-hidden rounded-lg border">
                <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                    id={sortableId}
                >
                    <Table>
                        <TableHeader className="sticky top-0 z-10 bg-muted">
                            {table.getHeaderGroups().map((hg) => (
                                <TableRow key={hg.id}>
                                    {hg.headers.map((header) => (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className="**:data-[slot=table-cell]:first:w-8">
                            {table.getRowModel().rows.length ? (
                                <SortableContext
                                    items={ids}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {table.getRowModel().rows.map((row) => (
                                        <DraggableRow<TData> key={row.id} row={row} />
                                    ))}
                                </SortableContext>
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DndContext>
            </div>

            <div className="flex items-center justify-between px-4">
                <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <Paginator
                    getPageIndex={() => table.getState().pagination.pageIndex}
                    getPageCount={table.getPageCount}
                    getPageSize={() => table.getState().pagination.pageSize}
                    setPageSize={table.setPageSize}
                    setPageIndex={table.setPageIndex}
                    getCanPreviousPage={table.getCanPreviousPage}
                    getCanNextPage={table.getCanNextPage}
                    previousPage={table.previousPage}
                    nextPage={table.nextPage}
                />
            </div>
        </div>
    );
}

function DragHandle({ id }: { id: UniqueIdentifier }) {
    const { attributes, listeners } = useSortable({ id });
    return (
        <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:bg-transparent"
            {...attributes}
            {...listeners}
        >
            <IconGripVertical className="size-3 text-muted-foreground" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    );
}

function DraggableRow<TData extends RowData>({
    row,
}: {
    row: Row<TData>;
}) {
    const { setNodeRef, transform, transition, isDragging } = useSortable({
        id: row.id,
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    );
}