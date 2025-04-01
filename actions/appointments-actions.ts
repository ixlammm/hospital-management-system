"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"
import { Patient } from "./patient-actions"

export type Appointment = Prisma.AppointmentGetPayload<{ omit: { id: true } }>

export async function getAppointments() {
  await requireAuth()
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: {
        select: {
          name: true
        }
      },
      staff: {
        select: {
          name: true
        }
      }
    }
  })
  return appointments
}

export async function getAppointmentsByDate(date: Date) {
  await requireAuth()
  const appointments = await prisma.appointment.findMany({
    where: {
      date
    },
    include: {
      patient: {
        select: {
          name: true
        }
      },
      staff: {
        select: {
          name: true
        }
      }
    }
  })
  return appointments
}

export async function addAppointment(appointment: Appointment) {
  await requireAuth()
  return await prisma.appointment.create({
    data: appointment,
    include: {
      patient: {
        select: {
          name: true
        }
      },
      staff: {
        select: {
          name: true
        }
      }
    }
  })
}

export async function deleteAppointment(id: string) {
  await requireAuth()
  return await prisma.appointment.delete({
    where: { id },
  })
}