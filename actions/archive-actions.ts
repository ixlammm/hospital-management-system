"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Archive } from "@/lib/database/types"

export async function getArchives() {
    const session = await requireAuth()
    return await prisma.archive.findMany({
        include: {
            patient: {
                select: {
                    name: true,
                },
            },
        }
    })
}

export async function addArchive(archive: Archive) {
    await requireAuth()
    return await prisma.archive.create({
        data: archive,
        include: {
            patient: {
                select: {
                    name: true,
                },
            },
        }
    })
}

export async function deleteArchive(id: string) {
    await requireAuth()
    return await prisma.archive.delete({
        where: {
            id,
        },
    })
}

export async function updateArchive(id: string, archive: Partial<Archive>) {
    await requireAuth()
    return await prisma.archive.update({
        where: { id },
        data: archive,
    })
}