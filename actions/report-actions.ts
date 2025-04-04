"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"
import { MonthlyReport } from "@/lib/database/types"

export async function getMonthlyReports() {
    const session = await requireAuth()
    return await prisma.monthlyReport.findMany({
        include: {
            staff: {
                select: {
                    name: true,
                },
            },
        }
    })
}

export async function addMonthlyReport(monthlyReport: MonthlyReport) {
    await requireAuth()
    return await prisma.monthlyReport.create({
        data: monthlyReport,
        include: {
            staff: {
                select: {
                    name: true,
                },
            },
        }
    })
}

export async function deleteMonthlyReport(id: string) {
    await requireAuth()
    return await prisma.monthlyReport.delete({
        where: {
            id,
        },
    })
}

export async function updateMonthlyReport(id: string, monthlyReport: Partial<MonthlyReport>) {
    await requireAuth()
    return await prisma.monthlyReport.update({
        where: { id },
        data: monthlyReport,
    })
}