"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"
import { Patient } from "@/lib/database/types"

export async function getPatients() {
  const session = await requireAuth()
  if (session.user.role == "admin" || session.user.role == "reception")
    return await prisma.patient.findMany()
  else {
    return (await prisma.user.findUnique({
      where: {
        id: session.user.id,
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

export async function addPatient(patient: Patient) {
  await requireAuth()
  return await prisma.patient.create({
    data: patient,
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