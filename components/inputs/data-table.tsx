import useAsyncArray from "@/hooks/use-asyncarray";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { getValue, RecursiveKey } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useConfirmDeleteDialog } from "./delete-dialog";

export default function DataTable<T extends { id: string }>(props: {
    array: ReturnType<typeof useAsyncArray<T>>,
    header: string[],
    cols: RecursiveKey<T>[],
    deleteDialog: ReturnType<typeof useConfirmDeleteDialog>,
    transform: { [key in RecursiveKey<T>]?: (value: any) => string }
}) {
    const { t } = useI18n()

    return <Table>
        <TableHeader>
            <TableRow>
                {
                    props.header.map((head, index) => (
                        <TableHead key={index}>{head}</TableHead>
                    ))
                }
                <TableHead className="text-right">{t("common.action")}</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {
                props.array.loading ?
                    new Array(4).fill(0).map((_, index) => (
                        <TableRow key={index}>
                            {
                                new Array(5).fill(0).map((_, index) => (
                                    <TableCell key={index} className="table-cell">
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    ))
                    : props.array.data.length > 0 ? props.array.data.map((row, index) => (
                        <TableRow key={index}>
                            {
                                props.cols.map((col, index) => (
                                    <TableCell key={index} className="table-cell">
                                        {
                                            props.transform[col] ? props.transform[col](getValue(row, col)) : getValue(row, col)
                                        }
                                    </TableCell>
                                ))
                            }
                            <TableCell className="table-cell text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">{t("common.openMenu")}</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[180px]">
                                        <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive" onClick={() => props.deleteDialog.confirmDelete(row.id)}>
                                            {t("common.delete")}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )) : <TableRow>
                        <TableCell colSpan={props.header.length + 1} className="text-center h-44">
                            {t("common.noData")}
                        </TableCell>
                    </TableRow>
            }
        </TableBody>
    </Table>
}