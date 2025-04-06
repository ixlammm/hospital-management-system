"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"
import { saltAndHashPassword } from "@/lib/password"
import { Staff } from "@/lib/database/types"
import { authWrapper } from "./auth-wrapper"
import { ABE } from "@/crypt/abe"
import { decryptTable, encryptData } from "./encrypt"

// patient: TEL, EMAIL, ADDRESS ['staff', 'reception']
// medecin: TEL, EMAIL ['staff', 'administration']
// agent: TEL, EMAIL ['staff', 'administration']
// infirmier: TEL, EMAIL ['staff', 'administration']
// laborantin: TEL, EMAIL ['staff', 'administration']
// radiologue: TEL, EMAIL ['staff', 'administration']
// comptable: TEL, EMAIL ['staff', 'administration']
// facture: montant ['comptable', 'administration']

const roles: { [key: string]: any } = {
  "admin": "AGENT",
  "medecin": "AGENT",
  "infirmier": "AGENT",
  "radiologue": "AGENT",
  "laborantin": "AGENT",
  "comptable": "AGENT",
}

// async function decryptStaff(staff: Staff & { id: string, abe_user_key: string }) {
//   return {
//     ...staff,
//     contact: (await ABE.decrypt(staff.contact, staff.abe_user_key!)).decrypted_data,
//     email: (await ABE.decrypt(staff.email!, staff.abe_user_key!)).decrypted_data,
//   }
// }


export const getStaff = authWrapper(async (session) => {
  if (session.role == "admin" || session.role == "reception") {
    const staff = await prisma.staff.findMany()
    return await Promise.all(staff.map(async (s) => {
      return await decryptTable(s, ["email", "contact"])
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
      return [await decryptTable(st, ["email", "contact"])]
    }
    return []
  }
})

export async function addStaff({ staff, password }: { staff: Staff, password: string }) {
  const session = await requireAuth()
  return await prisma.$transaction(async tx => {
    const user = await tx.user.create({
      data: {
        email: staff.email,
        pswdHash: saltAndHashPassword(password),
        role: staff.role,
      }
    })
    console.log(staff)
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
    const key = await ABE.generateUserKey([ role as any,  "ADMINISTRATION" ])
    const newStaff = await tx.staff.update({
      where: { id: st.id },
      data: {
        abe_user_key: key.user_key,
      }
    })
    return await decryptTable(newStaff, ["email", "contact"])
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