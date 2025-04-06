"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"
import { Patient } from "@/lib/database/types"
import { saltAndHashPassword } from "@/lib/password"
import { IBE } from "@/crypt/ibe"
import { authWrapper } from "./auth-wrapper"
import { ABE } from "@/crypt/abe"
import { encryptData } from "./encrypt"

// TEL, EMAIL, ADDRESS (RECEPTION)

async function decryptPatient(patient: Patient & { id: string, abe_user_key: string }) {
  return {
    ...patient,
    contact: (await ABE.decrypt(patient.contact, patient.abe_user_key!)).decrypted_data,
    email: (await ABE.decrypt(patient.email!, patient.abe_user_key!)).decrypted_data,
    address: (await ABE.decrypt(patient.address!, patient.abe_user_key!)).decrypted_data,
  }
}

export const getPatients = authWrapper(async (session) => {
  if (session.role == "admin" || session.role == "reception") {
    const patients = await prisma.patient.findMany({
      omit: {
        ibe_a: true,
        ibe_r: true,
      }
    })
    return await Promise.all(patients.map(async (patient) => {
      return await decryptPatient(patient as any)
    }))
  }
  else {
    const patients = (await prisma.user.findUnique({
      where: {
        id: session.id,
      },
      include: {
        staff: {
          include: {
            appointments: {
              include: {
                patient: true
              }
            }
          }
        }
      },
    }))?.staff?.appointments.map((a) => a.patient) || []
    return await Promise.all(patients.map(async (patient) => {
      return await decryptPatient(patient as any)
    }))
  }
})

export async function addPatient({ patient, password }: { patient: Patient, password: string }) {
  await requireAuth()
  return await prisma.$transaction(async tx => {
    const user = await tx.user.create({
      data: {
        email: patient.email!,
        pswdHash: saltAndHashPassword(password),
        role: "patient",
      }
    })
    const newPatient = await tx.patient.create({
      data: {
        ...patient,
        email: await encryptData("PATIENT", "email", patient.email!),
        contact: await encryptData("PATIENT", "telephone", patient.contact),
        address: await encryptData("PATIENT", "address", patient.address!),
        userId: user.id,
      },
    })
    const keys = await IBE.genererCles("PATIENT", newPatient.id)
    const user_key = await ABE.generateUserKey([ "PATIENT" ])
    const np = await tx.patient.update({
      where: { id: newPatient.id },
      data: {
        ibe_a: keys.a,
        ibe_r: keys.r,
        abe_user_key: user_key.user_key,
      },
    })
    return await decryptPatient(np as any)
  })
}

export async function deletePatient(id: string) {
  await requireAuth()
  await prisma.appointment.deleteMany({
    where: {
      patientId: id,
    },
  })
  return await prisma.patient.delete({
    where: { id },
  })
}