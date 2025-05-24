"use client"

import * as React from "react"
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export interface PaginatorProps {
    getPageIndex: () => number
    getPageCount: () => number
    getPageSize: () => number
    setPageSize: (size: number) => void
    setPageIndex: (index: number) => void
    getCanPreviousPage: () => boolean
    getCanNextPage: () => boolean
    previousPage: () => void
    nextPage: () => void
}
export const Paginator = ({
    getPageIndex,
    getPageCount,
    getPageSize,
    setPageSize,
    setPageIndex,
    getCanPreviousPage,
    getCanNextPage,
    previousPage,
    nextPage
}: PaginatorProps) => {
    return (
        <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                    Rows per page
                </Label>
                <Select
                    value={`${getPageSize()}`}
                    onValueChange={(value) => {
                        setPageSize(Number(value))
                    }}
                >
                    <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                        <SelectValue
                            placeholder={getPageSize()}
                        />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {getPageIndex() + 1} of{" "}
                {getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => setPageIndex(0)}
                    disabled={!getCanPreviousPage()}
                >
                    <span className="sr-only">Go to first page</span>
                    <IconChevronsLeft />
                </Button>
                <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => previousPage()}
                    disabled={!getCanPreviousPage()}
                >
                    <span className="sr-only">Go to previous page</span>
                    <IconChevronLeft />
                </Button>
                <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => nextPage()}
                    disabled={!getCanNextPage()}
                >
                    <span className="sr-only">Go to next page</span>
                    <IconChevronRight />
                </Button>
                <Button
                    variant="outline"
                    className="hidden size-8 lg:flex"
                    size="icon"
                    onClick={() => setPageIndex(getPageCount() - 1)}
                    disabled={!getCanNextPage()}
                >
                    <span className="sr-only">Go to last page</span>
                    <IconChevronsRight />
                </Button>
            </div>
        </div>)
}