"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"

export type Patient = Prisma.PatientGetPayload<{ omit: { id: true } }>

export async function getPatients() {
  await requireAuth()
  return await prisma.patient.findMany()
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