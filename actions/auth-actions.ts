"use server"

import { auth, signIn, signOut } from "@/auth"
import { NextResponse } from "next/server"

export async function requireAuth() {
  const session = await auth()
  if (!session) {
    throw new Error("You must be logged in to access this resource.")
  }
  return session
}

export async function login(formData: FormData) {
  return await signIn("credentials", formData)
}

export async function logout() {
  await signOut()
  return NextResponse.redirect(new URL("/login", window.location.origin))
}

