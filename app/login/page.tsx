"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signIn } from "@/auth"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const auth = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-primary p-2">
            <Activity className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Hospital Management System</CardTitle>
            <CardDescription className="text-center">Enter your credentials to sign in</CardDescription>
          </CardHeader>
          <CardContent>
            {auth.login.error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{auth.login.error}</AlertDescription>
              </Alert>
            )}
            <form action={auth.login.run} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="admin@hospital.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full" disabled={auth.login.loading}>
                {auth.login.loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="mt-2 text-center text-sm text-muted-foreground">
              <span>Default credentials: </span>
              <span className="font-medium">admin@hospital.com / admin123</span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

