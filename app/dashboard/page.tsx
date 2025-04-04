"use client"

import { changePassword, isPasswordChanged } from "@/actions/auth-actions"
import { DashboardPage } from "@/components/dashboard-page"
import { DialogCol } from "@/components/inputs/dialog-layout"
import DialogPasswordInput from "@/components/inputs/password-input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/sonner"
import useNamedState from "@/hooks/use-namedstate"
import { useI18n } from "@/lib/i18n"
import { useSession } from "next-auth/react"
import { useEffect, useState, useTransition } from "react"

export default function Dashboard() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const user = useNamedState({
    password: "",
    confirmPassword: "",
  })
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      if (!await isPasswordChanged()) {
        setOpen(true)
      }
    })
  }, [])

  const handleChangePassword = async () => {
    startTransition(async () => {
      if (user.value.password !== user.value.confirmPassword) {
        return
      }
      try {
        const result = await changePassword(user.value.password)
        if (!result)
          throw new Error("Error changing password")
        window.location.reload()
        setOpen(false)
      }
      catch (error) {
        console.error(error)
      }
    })
  }

  return (
    <>
      <DashboardPage />
      <Toaster />
      <Dialog modal open={open} defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("common.changePasswordTitle")}</DialogTitle>
            <DialogDescription>
              {t("common.changePasswordDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogCol>
            <DialogPasswordInput state={user} name="password" title={t("common.password")} />
            <DialogPasswordInput state={user} name="confirmPassword" title={t("common.confirmPassword")} />
          </DialogCol>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleChangePassword()}>
              {loading ? t("common.changingPassword") : t("common.changePassword")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

