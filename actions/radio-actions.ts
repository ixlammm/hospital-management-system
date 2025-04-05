"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"
import { Radio } from "../lib/database/types"
import { authWrapper } from "./auth-wrapper"

export const getRadios = authWrapper(async (session) => {
  return await prisma.radio.findMany({
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

export async function addRadio(radio:Radio) {
  await requireAuth()
  return await prisma.radio.create({
    data: radio,
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

export async function deleteRadio(id: string) {
  await requireAuth()
  return await prisma.radio.delete({
    where: {
      id,
    },
  })
}

export async function updateRadio(id: string, radio: Partial<Radio>) {
  await requireAuth()
  return await prisma.radio.update({
    where: { id },
    data: {
      date: radio.date,
      doctorId: radio.doctorId,
      patientId: radio.patientId,
      result: radio.result,
      type: radio.type
    },
  })
}