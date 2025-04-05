import { useState } from "react";

export function useSelectionDialog(fn: () => Promise<void>) {
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState("");

    const confirm = async () => {
        await fn()
        setOpen(true);
    };

    return { fn, confirm, item, open, setOpen };
}