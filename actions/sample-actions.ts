"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"
import { Sample } from "../lib/database/types"
import { authWrapper } from "./auth-wrapper"

export const getSamples = authWrapper(async (session) => {
  return await prisma.sample.findMany({
    include: {
      patient: {
        select: {
          name: true,
        },
      },
      staff: {
        select: {
          name: true,
        },
      },
    }
  })
})

export async function addSample(sample:Sample) {
  await requireAuth()
  return await prisma.sample.create({
    data: sample,
    include: {
      patient: {
        select: {
          name: true,
        },
      },
      staff: {
        select: {
          name: true,
        },
      },
    }
  })
}

export async function deleteSample(id: string) {
  await requireAuth()
  return await prisma.sample.delete({
    where: {
      id,
    },
  })
}

export async function updateSample(id: string, sample: Partial<Sample>) {
  await requireAuth()
  return await prisma.sample.update({
    where: { id },
    data: sample,
  })
}