"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"
import { Patient } from "@/lib/database/types"
import { saltAndHashPassword } from "@/lib/password"

export async function getPatients() {
  const session = await requireAuth()
  console.log("GET PATIENTS")
  console.log(session)
  if (session.role == "admin" || session.role == "reception")
    return await prisma.patient.findMany()
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
      }
    }))?.staff?.appointments.map((a) => a.patient) || []
  }
}

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
    return await tx.patient.create({
      data: {
        ...patient,
        userId: user.id,
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