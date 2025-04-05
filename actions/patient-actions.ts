"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"
import { Patient } from "@/lib/database/types"
import { saltAndHashPassword } from "@/lib/password"
import { IBE } from "@/crypt/ibe"
import { authWrapper } from "./auth-wrapper"

export const getPatients = authWrapper(async (session)  =>{
  console.log("GET PATIENTS")
  console.log(session)
  if (session.role == "admin" || session.role == "reception")
    return await prisma.patient.findMany({
      omit: {
        ibe_a: true,
        ibe_r: true,
      }
    })
  else {
    return (await prisma.user.findUnique({
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
  }
})

export async function addPatient({ patient, password} : { patient: Patient, password: string }) {
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
        userId: user.id,
      },
    })
    const keys = await IBE.genererCles("PATIENT", newPatient.id)
    return await tx.patient.update({
      where: { id: newPatient.id },
      data: {
        ibe_a: keys.a,
        ibe_r: keys.r,
      },
    })
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