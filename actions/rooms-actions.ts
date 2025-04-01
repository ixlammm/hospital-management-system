"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "./auth-actions"
import { Prisma } from "@prisma/client"

export type Room = Prisma.RoomGetPayload<{}>

export async function getRooms() {
  await requireAuth()
  return await prisma.room.findMany({
    include:  {
      patient: true
    }
  })
}

export async function addRoom(room: Room) {
  await requireAuth()
  return await prisma.room.create({
    data: room,
    include: {
      patient: true
    }
  })
}

export async function deleteRoom(name: string) {
  await requireAuth()
  return await prisma.room.delete({
    where: { name },
  })
}

export async function updateRoom(name: string, room: Partial<Room>) {
  await requireAuth()
  return await prisma.room.update({
    where: { name },
    data: room,
  })
}