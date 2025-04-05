"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"
import { Prescription } from "@/lib/database/types"
import { authWrapper } from "./auth-wrapper"

export const getPrescriptions = authWrapper(async (session) => {
  return await prisma.prescription.findMany({
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

export async function addPrescription(prescription: Prescription) {
  await requireAuth()
  return await prisma.prescription.create({
    data: prescription,
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

export async function deletePrescription(id: string) {
  await requireAuth()
  return await prisma.prescription.delete({
    where: {
      id,
    },
  })
}

export async function updatePrescription(id: string, prescription: Partial<Prescription>) {
  await requireAuth()
  return await prisma.prescription.update({
    where: { id },
    data: prescription,
  })
}