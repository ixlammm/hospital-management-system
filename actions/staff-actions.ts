"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"
import { saltAndHashPassword } from "@/lib/password"
import { Staff } from "@/lib/database/types"

export async function getStaff() {
  await requireAuth()
  return await prisma.staff.findMany()
}

export async function addStaff({ staff, password }: { staff: Staff, password: string }) {
  await requireAuth()
  return await prisma.$transaction(async tx => {
    const user = await tx.user.create({
      data: {
        email: staff.email,
        pswdHash: saltAndHashPassword(password),
        role: staff.role,
      }
    })
    return await tx.staff.create({
      data: {
        ...staff,
        userId: user.id,
      },
    })

  })
}

export async function deleteStaff(id: string) {
  await requireAuth()
  return await prisma.staff.delete({
    where: { id },
  })
}

export async function updateStaff(id: string, staff: Partial<Staff>) {
  await requireAuth()
  return await prisma.staff.update({
    where: { id },
    data: staff,
  })
}

export async function getStaffRoles() {
  return {
    "admin": "Administrateur",
    "medecin": "Médecin",
    "infirmier": "Infirmier",
    "radiologue": "Radiologue",
    "laborantin": "Laborantin",
    "comptable": "Comptable",
  }
}