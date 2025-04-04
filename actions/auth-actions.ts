"use server"

import { auth, signIn, signOut } from "@/auth"
import { saltAndHashPassword } from "@/lib/password"
import prisma from "@/lib/prisma"
import { Session } from "next-auth"
import { NextResponse } from "next/server"

export async function requireAuth(logic?: (session: Session) => boolean) {
  const session = await auth()
  if (!session) {
    throw new Error("You must be logged in to access this resource.")
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })
  if (!user || (logic && !logic(session)) || !user?.passwordChanged) {
    throw new Error("You do not have permission to access this resource.")
  }
  return user
}

export async function signin(formData: FormData) {
  return await signIn("credentials", {
    redirect: false,
    email: formData.get("email"),
    password: formData.get("password"),
  })
}

export async function signout() {
  return await signOut({
    redirect: false,
  })
}

export async function isPasswordChanged() {
  const session = await auth()
  if (!session) {
    return null
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })
  if (user) {
    return user.passwordChanged
  }
  return null
}

export async function changePassword(password: string) {
  const session = await auth()
  if (!session) {
    throw new Error("You must be logged in to access this resource.")
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })
  console.log(user)
  if (user && !user.passwordChanged) {
    return await prisma.user.update({
      where: { id: session.user.id },
      data: {
        pswdHash: saltAndHashPassword(password),
        passwordChanged: true
      },
    })
  }
  return null
}