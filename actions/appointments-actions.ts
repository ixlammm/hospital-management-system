"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"
import { Appointment } from "@/lib/database/types"
import { IBE } from "@/crypt/ibe"
import { authWrapper } from "./auth-wrapper"

async function decryptAppointement<T extends Appointment>(appointment: T) {
  const patient = await prisma.patient.findUnique({
    where: {
      id: appointment.patientId
    }
  })
  if (!patient) throw new Error("Patient not found")
  const decryptedNotes = await IBE.dechiffrer(appointment.notes!, patient.ibe_r!, patient.ibe_a!)
  const decryptedDescription = await IBE.dechiffrer(appointment.description!, patient.ibe_r!, patient.ibe_a!)
  return {
    ...appointment,
    notes: decryptedNotes.message_clair,
    description: decryptedDescription.message_clair
  }
}

export const getAppointments = authWrapper(async (session, date?: Date) => {
  if (session.role == "admin" || session.role == "reception") {
    const appointements = await prisma.appointment.findMany({
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
      },
      ...(date ? {
        where: {
          date
        }
      } : {})
    });
    const decryptedAppointments = await Promise.all(appointements.map(decryptAppointement))
    return decryptedAppointments
  }
  else {
    const appointements = await prisma.appointment.findMany({
      include: {
        patient: {
          select: {
            name: true
          }
        },
        staff: {
          select: {
            name: true,
            user: true
          }
        }
      },
      where: {
        staff: {
          user: {
            id: session.id
          }
        },
        date: date?.toISOString()
      }
    })
    const decryptedAppointments = await Promise.all(appointements.map(decryptAppointement))
    return decryptedAppointments
  }
}, [])

export const getAppointmentsByStaff = authWrapper(async (session, staffId: string) => {
  const appointments = await prisma.appointment.findMany({
    where: {
      staff: {
        id: staffId
      }
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
  const decryptedAppointments = await Promise.all(appointments.map(decryptAppointement))
  return decryptedAppointments
})

export async function addAppointment(appointment: Appointment) {
  await requireAuth((session) => session.user.role == "admin" || session.user.role == "reception")
  const {
    notes,
    description,
    ...rest
  } = appointment
  const patient = await prisma.patient.findUnique({
    where: {
      id: appointment.patientId
    }
  })
  if (!patient) throw new Error("Patient not found")
  const encryptedNotes = await IBE.chiffrer(notes ?? "", patient.ibe_a!)
  const encryptedDescription = await IBE.chiffrer(description ?? "", patient.ibe_a!)
  const app = await prisma.appointment.create({
    data: {
      ...rest,
      notes: encryptedNotes.message_chiffre,
      description: encryptedDescription.message_chiffre,
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
  return decryptAppointement(app)
}

export async function updateAppointment(id: string, appointment: Partial<Appointment & { id: string }>) {
  await requireAuth((session) => session.user.role == "admin" || session.user.role == "reception" || session.user.role == "medecin")
  const {
    id: _,
    notes,
    description,
    ...rest 
  } = appointment
  const patient = await prisma.patient.findUnique({
    where: {
      id: appointment.patientId
    }
  })
  if (!patient) throw new Error("Patient not found")
  const encryptedNotes = notes ? await IBE.chiffrer(notes, patient.ibe_a!) : undefined
  const encryptedDescription = description ? await IBE.chiffrer(description, patient.ibe_a!) : undefined
  const app = await prisma.appointment.update({
    where: {
      id
    },
    data: {
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      type: appointment.type,
      duration: appointment.duration,
      notes: encryptedNotes?.message_chiffre,
      description: encryptedDescription?.message_chiffre,
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
  return decryptAppointement(app)
}

export async function deleteAppointment(id: string) {
  await requireAuth((session) => session.user.role == "admin" || session.user.role == "reception")
  return await prisma.appointment.delete({
    where: { id },
  })
}