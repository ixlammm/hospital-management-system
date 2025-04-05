"use client"

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useNamedState from "@/hooks/use-namedstate";
import moment from "moment";

export default function DialogTimeInput<T extends { [key: string]: any }>(props: {
    state: ReturnType<typeof useNamedState<T>>,
    name: string & keyof T,
    title: string,
}) {

    return <div className="grow space-y-2">
        <Label htmlFor={props.name}>{props.title}</Label>
        <Input id={props.name} type="time" value={props.state.value[props.name]} onChange={(e) => {
            props.state.update((prev) => ({
                ...prev,
                [props.name]: e.target.value,
            }))
        }} />
    </div>
}