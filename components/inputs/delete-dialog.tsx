import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useI18n } from "@/lib/i18n";

export function useConfirmDeleteDialog(del: (item: string) => Promise<void>) {
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState("");

    const confirmDelete = (item: string) => {
        setDeleteItem(item);
        setConfirmDeleteDialogOpen(true);
    };

    return { del, deleteItem, confirmDelete, confirmDeleteDialogOpen, setConfirmDeleteDialogOpen };
}

export default function ConfirmDeleteDialog({ confirmDeleteDialog }: {  confirmDeleteDialog: ReturnType<typeof useConfirmDeleteDialog> }) {

    const { t } = useI18n();
    const { del, deleteItem, confirmDeleteDialogOpen, setConfirmDeleteDialogOpen } = confirmDeleteDialog;
    const [isLoading, startTransition] = useTransition();

    return <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t("common.confirmDelete")}</DialogTitle>
                <DialogDescription>{t("common.confirmDeleteMessage")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmDeleteDialogOpen(false)}>
                    {t("common.cancel")}
                </Button>
                <Button variant="destructive" onClick={async () => {
                    startTransition(async () => {
                        await del(deleteItem);
                        setConfirmDeleteDialogOpen(false);
                    })
                }}>
                    {isLoading ? t("common.deleting") : t("common.delete")}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}