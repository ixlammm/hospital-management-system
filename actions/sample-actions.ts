"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"
import { Sample } from "../lib/database/types"
import { authWrapper } from "./auth-wrapper"
import { decryptTable } from "./encrypt"
import { ABE } from "@/crypt/abe"

export const getSamples = authWrapper(async (session) => {
  const samples = await prisma.sample.findMany({
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
  return Promise.all(samples.map(async (sample) => decryptTable(sample, ["temperature", "observation", "heartRate", "bloodPressure"])))
})

export async function addSample(sample:Sample) {
  const user = await requireAuth()
  const staff = await prisma.staff.findUnique({
    include: {
      user: true
    },
    where: {
      userId: user.id
    }
  })
  return await prisma.$transaction(async tx => {
    const s = await tx.sample.create({
      data: {
        ...sample,
        heartRate: (await ABE.encrypt("prelevement", "pulsation", sample.heartRate, staff?.role)).encrypted_data,
        bloodPressure: (await ABE.encrypt("tension_art", "pulsation", sample.heartRate, staff?.role)).encrypted_data,
        observation:  (await ABE.encrypt("observation", "pulsation", sample.heartRate, staff?.role)).encrypted_data,
        temperature: (await ABE.encrypt("observation", "temperature", sample.heartRate, staff?.role)).encrypted_data
      },
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
    const key = await ABE.generateUserKey([ [ "MEDECIN", staff?.department! ], [ "INFIRMIER", staff?.department! ] ])
    const a = await tx.sample.update({
      where: {
        id: s.id
      },
      data: {
        abe_user_key: key.user_key
      }
    })
    return decryptTable(a, ["temperature", "observation", "heartRate", "bloodPressure"])
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