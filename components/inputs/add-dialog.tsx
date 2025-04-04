import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState, useTransition } from "react";
import { useI18n } from "@/lib/i18n";
import { DialogCol } from "./dialog-layout";

export function useAddDialog() {
    const [open, setOpen] = useState(false);
    return { open, setOpen };
}

export default function DialogAdd(props: {
    dialog: ReturnType<typeof useAddDialog>;
    children?: React.ReactNode;
    handleAdd: () => Promise<void>;
    addText: string;
    title: string;
    description: string;
}) {
    const { t } = useI18n()
    const [isLoading, startTransition] = useTransition()

    return <Dialog open={props.dialog.open} onOpenChange={props.dialog.setOpen}>
        <DialogTrigger asChild>
            <Button>
                <Plus className="h-4 w-4" /> {props.addText}
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{props.title}</DialogTitle>
                <DialogDescription>
                    {props.description}
                </DialogDescription>
            </DialogHeader>
            <DialogCol>
                {props.children}
            </DialogCol>
            <DialogFooter>
                <Button variant="outline" onClick={() => props.dialog.setOpen(false)}>
                    {t("common.cancel")}
                </Button>
                <Button onClick={() => {
                    startTransition(async () => {
                        await props.handleAdd()
                        props.dialog.setOpen(false)
                    })
                }} disabled={isLoading}>
                    {isLoading ? t("common.adding") : props.addText}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}