import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState, useTransition } from "react";
import { useI18n } from "@/lib/i18n";
import { DialogCol } from "./dialog-layout";

export function useUpdateDialog() {
    const [open, setOpen] = useState(false);
    return { open, setOpen };
}

export default function DialogUpdate(props: {
    dialog: ReturnType<typeof useUpdateDialog>;
    children?: React.ReactNode;
    handleUpdate: () => Promise<void>;
    updateText: string;
    title: string;
    description: string;
    hideTrigger?: boolean;
}) {
    const { t } = useI18n()
    const [isLoading, startTransition] = useTransition()

    return <Dialog open={props.dialog.open} onOpenChange={props.dialog.setOpen}>
        <DialogTrigger asChild>
            {
                !props.hideTrigger ?
                    <Button>
                        <Plus className="h-4 w-4" /> {props.updateText}
                    </Button>
                    : null
            }
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
                        await props.handleUpdate()
                        props.dialog.setOpen(false)
                    })
                }} disabled={isLoading}>
                    {isLoading ? t("common.updating") : props.updateText}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}