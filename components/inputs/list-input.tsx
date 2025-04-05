"use client"

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useNamedState from "@/hooks/use-namedstate";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";

export default function DialogListInput<T extends { [key: string]: any }>(props: {
  state: ReturnType<typeof useNamedState<T>>,
  name: string & keyof T,
  title: string,
  options: { key: string, label: string }[],
  placeholder?: string
}) {
  return <div className="grow space-y-2">
    <Label htmlFor={props.name}>{props.title}</Label>
    <Select defaultValue={props.options[0].key} onValueChange={(value) => {
      props.state.update((prev) => ({
        ...prev,
        [props.name]: value
      }))
    }}>
      <SelectTrigger className="grow w-full">
        <SelectValue placeholder={props.placeholder ?? 'Select Value'} />
      </SelectTrigger>
      <SelectContent>
        {
          props.options.map((option) => (
            <SelectItem key={option.key} value={option.key}>
              {option.label}
            </SelectItem>
          ))
        }
      </SelectContent>
    </Select>
  </div>
}


