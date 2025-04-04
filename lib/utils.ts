import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type RecursiveKey<T> = T extends object
  ? { [K in keyof T]: K extends string ? `${K}` | `${K}.${RecursiveKey<T[K]>}` : never }[keyof T]
  : never;

export function getValue<T>(obj: T, key: RecursiveKey<T>) {
  let value: any = obj;
  const keys = key.split(".");
  for (const k of keys) {
    if (value === undefined || value === null) {
      return undefined;
    }
    value = value[k];
  }
  return value;
}