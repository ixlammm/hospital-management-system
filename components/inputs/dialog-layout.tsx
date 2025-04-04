import { PropsWithChildren } from "react";

export function DialogRow({ children }: PropsWithChildren) {
    return <div className="flex gap-4">
        {children}
    </div>
}
export function DialogCol({ children }: PropsWithChildren) {
    return <div className="flex flex-col gap-6 py-2">
        {children}
    </div>
}