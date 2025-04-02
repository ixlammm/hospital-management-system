"use server"

import { auth, signIn, signOut } from "@/auth"
import { Session } from "next-auth"
import { NextResponse } from "next/server"

export async function requireAuth(logic?: (session: Session) => boolean) {
  const session = await auth()
  if (!session) {
    throw new Error("You must be logged in to access this resource.")
  }
  if (logic && !logic(session)) {
    throw new Error("You do not have permission to access this resource.")
  }
  return session
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

