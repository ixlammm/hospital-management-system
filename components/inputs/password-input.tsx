"use client"

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useNamedState from "@/hooks/use-namedstate";

export default function DialogPasswordInput<T extends { [key: string]: any }>(props: {
    state: ReturnType<typeof useNamedState<T>>,
    name: string & keyof T,
    title: string
}) {
    return <div className="space-y-2">
        <Label htmlFor={props.name}>{props.title}</Label>
        <Input type="password" id={props.name} value={props.state.value[props.name]} onChange={(e) => {
            props.state.update((prev) => ({
                ...prev,
                [props.name]: e.target.value
            }))
        }} />
    </div>
}