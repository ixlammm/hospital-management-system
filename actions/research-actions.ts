"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"
import { Research } from "@/lib/database/types"
import { authWrapper } from "./auth-wrapper"

export const getResearches = authWrapper(async (session) => {
    return await prisma.research.findMany({
        include: {
            staff: {
                select: {
                    name: true,
                },
            },
        }
    })
})

export async function addResearch(research: Research) {
    await requireAuth()
    return await prisma.research.create({
        data: research,
        include: {
            staff: {
                select: {
                    name: true,
                },
            },
        }
    })
}

export async function deleteResearch(id: string) {
    await requireAuth()
    return await prisma.research.delete({
        where: {
            id,
        },
    })
}

export async function updateResearch(id: string, research: Partial<Research>) {
    await requireAuth()
    return await prisma.research.update({
        where: { id },
        data: research,
    })
}