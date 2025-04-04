"use client"

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useNamedState from "@/hooks/use-namedstate";

export default function DialogNumberInput<T extends { [key: string]: any }>(props: {
    state: ReturnType<typeof useNamedState<T>>,
    name: string & keyof T,
    title: string,
    min?: number,
    max?: number,
}) {

    return <div className="grow space-y-2">
        <Label htmlFor={props.name}>{props.title}</Label>
        <Input id={props.name} type="number" min={props.min ?? 0} max={props.max ?? 100} value={props.state.value[props.name]} onChange={(e) => {
            props.state.update((prev) => ({
                ...prev,
                [props.name]: parseInt(e.target.value)
            }))
        }} />
    </div>
}