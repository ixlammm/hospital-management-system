"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"
import { saltAndHashPassword } from "@/lib/password"
import { Staff } from "@/lib/database/types"
import { authWrapper } from "./auth-wrapper"
import { ABE } from "@/crypt/abe"
import { decryptTable, encryptData } from "./encrypt"

const roles: { [key: string]: any } = {
  "admin": "AGENT",
  "medecin": "AGENT",
  "infirmier": "AGENT",
  "radiologue": "AGENT",
  "laborantin": "AGENT",
  "comptable": "AGENT",
}

export const getStaff = authWrapper(async (session) => {
  const user = await prisma.staff.findUnique({
    where: {
      userId: session.id
    }
  })
  if (session.role == "admin" || session.role == "reception") {
    const staff = await prisma.staff.findMany()
    return await Promise.all(staff.map((s) => {
      return decryptTable(s, ["email", "contact"], user?.abe_user_key!)
    }))
  }
  else {
    const st = await prisma.staff.findUnique({
      where: {
        userId: session.id
      },
    })
    console.log(st)
    if (st) {
      return await decryptTable(st, ["email", "contact"], user?.abe_user_key!)
    }
    return []
  }
})

export async function addStaff({ staff, password }: { staff: Staff, password: string }) {
  const session = await requireAuth()
  const authUser = await prisma.staff.findUnique({
    where: {
      userId: session.id
    },
  })
  return await prisma.$transaction(async tx => {
    const user = await tx.user.create({
      data: {
        email: staff.email,
        pswdHash: saltAndHashPassword(password),
        role: staff.role,
      }
    })
    const st = await tx.staff.create({
      data: {
        ...staff,
        email: await encryptData("AGENT", "email", staff.email!, "ADMINISTRATION"),
        contact: await encryptData("AGENT", "telephone", staff.contact, "ADMINISTRATION"),
        userId: user.id,
      },
    })
    let role = session.role.toUpperCase()
    if (role == "ADMIN")
      role = "AGENT"
    const key = await ABE.generateUserKey([
      [role as any, staff.department?.toUpperCase()],
      ["AGENT", "ADMINISTRATION"],
    ])
    const newStaff = await tx.staff.update({
      where: { id: st.id },
      data: {
        abe_user_key: key.user_key,
      }
    })
    return await decryptTable(newStaff, ["email", "contact"], authUser?.abe_user_key!)
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