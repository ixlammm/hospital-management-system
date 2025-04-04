"use client"

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useNamedState from "@/hooks/use-namedstate";
import { Textarea } from "../ui/textarea";

export default function DialogTextarea<T extends { [key: string]: any }>(props: {
    state: ReturnType<typeof useNamedState<T>>,
    name: string & keyof T,
    title: string,
    placeholder?: string
}) {
    return <div className="space-y-2">
        <Label htmlFor={props.name}>{props.title}</Label>
        <Textarea
            className="min-h-[80px]"
            placeholder={props.placeholder ?? "Enter some text..."}
            id={props.name} value={props.state.value[props.name]} onChange={(e) => {
                props.state.update((prev) => ({
                    ...prev,
                    [props.name]: e.target.value
                }))
            }}
        />
    </div>
}