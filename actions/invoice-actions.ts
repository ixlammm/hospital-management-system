"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Invoice } from "@/lib/database/types"

export async function getInvoices() {
    const session = await requireAuth()
    return await prisma.invoice.findMany({
        include: {
            staff: {
                select: {
                    name: true,
                },
            },
            patient: {
                select: {
                    name: true,
                },
            },
        }
    })
}

export async function addInvoice(invoice: Invoice) {
    await requireAuth()
    return await prisma.invoice.create({
        data: invoice,
        include: {
            staff: {
                select: {
                    name: true,
                },
            },
            patient: {
                select: {
                    name: true,
                },
            },
        }
    })
}

export async function deleteInvoice(id: string) {
    await requireAuth()
    return await prisma.invoice.delete({
        where: {
            id,
        },
    })
}

export async function updateInvoice(id: string, invoice: Partial<Invoice>) {
    await requireAuth()
    return await prisma.invoice.update({
        where: { id },
        data: invoice,
    })
}