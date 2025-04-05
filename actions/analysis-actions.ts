"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Analysis } from "@/lib/database/types"
import { authWrapper } from "./auth-wrapper"

export const getAnalyses = authWrapper(async (session) => {
    return await prisma.analysis.findMany({
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
})

export async function addAnalysis(analysis: Analysis) {
    await requireAuth()
    return await prisma.analysis.create({
        data: analysis,
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

export async function deleteAnalysis(id: string) {
    await requireAuth()
    return await prisma.analysis.delete({
        where: {
            id,
        },
    })
}

export async function updateAnalysis(id: string, analysis: Partial<Analysis>) {
    await requireAuth()
    return await prisma.analysis.update({
        where: { id },
        data: analysis,
    })
}