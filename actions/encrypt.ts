"use server";

import { ABE } from "@/crypt/abe";

const staticPolicies = {
    PATIENT: {
        telephone: ["AGENT", "RECEPTION"],
        email: ["AGENT", "RECEPTION"],
        address: ["AGENT", "RECEPTION"],
    },
    MEDECIN: {
        telephone: ["AGENT", "ADMINISTRATION"],
        email: ["AGENT", "ADMINISTRATION"],
    },
    AGENT: {
        telephone: ["AGENT", "ADMINISTRATION"],
        email: ["AGENT", "ADMINISTRATION"],
    },
    INFIRMIER: {
        telephone: ["AGENT", "ADMINISTRATION"],
        email: ["AGENT", "ADMINISTRATION"],
    },
    LABORANTIN: {
        telephone: ["AGENT", "ADMINISTRATION"],
        email: ["AGENT", "ADMINISTRATION"],
    },
    RADIOLOGUE: {
        telephone: ["AGENT", "ADMINISTRATION"],
        email: ["AGENT", "ADMINISTRATION"],
    },
    COMPTABLE: {
        telephone: ["AGENT", "ADMINISTRATION"],
        email: ["AGENT", "ADMINISTRATION"],
    },
    FACTURE: {
        montant: ["COMPTABLE", "PATIENT"],
    },
}

export type Policies = keyof typeof staticPolicies
type SubPolicies<T extends Policies> = keyof typeof staticPolicies[T] & string

export async function encryptData<T extends Policies, G extends keyof typeof staticPolicies[T] & string>(table: T, column: G, data: string, service?: string): Promise<string> {
    const policy = staticPolicies[table][column]
    const encrypted = await ABE.encrypt(table, column, data, service)
    return encrypted.encrypted_data
}

export async function decryptTable<T extends { id: string, abe_user_key: string | null }, G extends (keyof T) & string>(table: T, fields: G[]) {
    const newTable = {
        ...table
    }
    for (const field of fields) {
        newTable[field] = (await ABE.decrypt(table[field] as string, table.abe_user_key!)).decrypted_data as T[G]
    }
    return newTable
}