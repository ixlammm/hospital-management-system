"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"

export type Staff = Prisma.StaffGetPayload<{ omit: { id: true } }>

export async function getStaff() {
  await requireAuth()
  return await prisma.staff.findMany()
}

export async function addStaff(staff: Staff) {
  await requireAuth()
  return await prisma.staff.create({
    data: staff,
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