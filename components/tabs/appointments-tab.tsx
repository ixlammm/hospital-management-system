"use client"

import type React from "react"
const Moment = dynamic(() => import("react-moment"), { ssr: false })

import { useEffect, useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, MoreHorizontal, Plus } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useI18n } from "@/lib/i18n"
import { useDatabase } from "@/lib/database"
import { toast } from "@/hooks/use-toast"
import useAsyncArray from "@/hooks/use-asyncarray"
import { getAppointments } from "@/actions/appointments-actions"
import moment from "moment"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import DialogUpdate, { useUpdateDialog } from "../inputs/update-dialog"
import { Appointment } from "@/lib/database/types"
import DialogDateInput from "../inputs/date-input"
import useNamedState from "@/hooks/use-namedstate"
import { DialogRow } from "../inputs/dialog-layout"
import SelectPatient from "../inputs/select-patient"
import SelectDoctor from "../inputs/select-doctor"
import DialogTimeInput from "../inputs/time-input"
import DialogListInput from "../inputs/list-input"
import DialogTextarea from "../inputs/textarea-input"
import DialogAdd, { useAddDialog } from "../inputs/add-dialog"

export function AppointmentsTab() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const { t } = useI18n()
  const database = useDatabase()
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const session = useSession()
  const initialState: Appointment = {
    patientId: "",
    doctorId: "",
    date: date ?? new Date(),
    time: "09:00",
    duration: "30",
    type: "check-up",
    notes: "",
    description: "",
    status: ""
  }

  const app = useNamedState(initialState)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    console.log(id, value)
    app.update((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSelectChange = (field: string, value: string) => {
    app.update((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEditAppointment = (id: string) => {
    setSelectedApp(id)
    const appointment = database.appointments.data.find((app) => app.id === id)
    if (appointment) {
      app.update({
        ...appointment,
        date: moment(appointment.date).toDate(),
        time: appointment.time,
      })
      updateDialog.setOpen(true)
    }
  }

  const handleCancelAppointment = (id: string) => {
    setSelectedApp(id)
    setConfirmDeleteDialogOpen(true)
  }

  const handleAddAppointment = async () => {
    // Here you would typically send this data to your backend
    console.log("Adding new appointment:", app.value)

    await database.doAddAppointment({
      ...app.value,
      date: new Date(app.value.date ?? ""),
    })

    // For demo purposes, we'll just close the dialog
    setDialogOpen(false)

    // Reset the form
    app.update(initialState)
  }

  const confirmDeleteAppointment = async () => {
    if (selectedApp) {
      await database.doDeleteAppointment(selectedApp)
      toast({
        title: t("patients.deleteSuccess"),
        description: t("patients.deleteSuccessMessage"),
      })
      setConfirmDeleteDialogOpen(false)
      setSelectedApp(null)
    }
  }

  const formattedDate = date ? format(date, "MMMM d, yyyy") : ""
  const updateDialog = useUpdateDialog()
  const addDialog = useAddDialog()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">Manage and schedule patient appointments</p>
        </div>
        {
          session.status == "authenticated" && (session.data.user.role == "admin" || session.data.user.role == "reception") &&
          <>
            <DialogUpdate
              description="Update appointment details"
              dialog={updateDialog}
              handleUpdate={async () => {
                if (selectedApp) {
                  await database.doUpdateAppointment(selectedApp, app.value)
                }
              }}
              title="Update Appointment"
              updateText="Update Appointment"
              hideTrigger
            >
              <DialogRow>
                <SelectPatient
                  state={app}
                />
                <SelectDoctor
                  state={app}
                />
              </DialogRow>
              <DialogRow>
                <DialogDateInput
                  state={app}
                  name="date"
                  title={t("appointments.date")}
                />
                <DialogTimeInput
                  state={app}
                  name="time"
                  title={t("appointments.time")}
                />
              </DialogRow>
              <DialogRow>
                <DialogListInput
                  state={app}
                  name="type"
                  title={t("appointments.type")}
                  options={[
                    { key: "check-up", label: t("appointments.checkup") },
                    { key: "consultation", label: t("appointments.consultation") },
                    { key: "follow-up", label: t("appointments.followup") },
                    { key: "emergency", label: t("appointments.emergency") },
                    { key: "procedure", label: t("appointments.procedure") },
                    { key: "surgery", label: t("appointments.surgery") },
                  ]}
                />
                <DialogListInput
                  state={app}
                  name="duration"
                  title={t("appointments.duration")}
                  options={[
                    { key: "15", label: "15 minutes" },
                    { key: "30", label: "30 minutes" },
                    { key: "45", label: "45 minutes" },
                    { key: "60", label: "60 minutes" },
                    { key: "90", label: "90 minutes" },
                  ]}
                />
              </DialogRow>
              <DialogTextarea
                state={app}
                name="description"
                title={t("appointments.description")}
                placeholder="Enter description"
              />
              <DialogTextarea
                state={app}
                name="notes"
                title={t("appointments.notes")}
                placeholder="Enter any additional notes"
              />
            </DialogUpdate>
            <DialogAdd
              description="Add new appointment"
              dialog={addDialog}
              handleAdd={async () => {
                await database.doAddAppointment(app.value)
              }}
              title="Add Appointment"
              addText="New Appointment"
            >
              <DialogRow>
                <SelectPatient
                  state={app}
                />
                <SelectDoctor
                  state={app}
                />
              </DialogRow>
              <DialogRow>
                <DialogDateInput
                  state={app}
                  name="date"
                  title={t("appointments.date")}
                />
                <DialogTimeInput
                  state={app}
                  name="time"
                  title={t("appointments.time")}
                />
              </DialogRow>
              <DialogRow>
                <DialogListInput
                  state={app}
                  name="type"
                  title={t("appointments.type")}
                  options={[
                    { key: "check-up", label: t("appointments.checkup") },
                    { key: "consultation", label: t("appointments.consultation") },
                    { key: "follow-up", label: t("appointments.followup") },
                    { key: "emergency", label: t("appointments.emergency") },
                    { key: "procedure", label: t("appointments.procedure") },
                    { key: "surgery", label: t("appointments.surgery") },
                  ]}
                />
                <DialogListInput
                  state={app}
                  name="duration"
                  title={t("appointments.duration")}
                  options={[
                    { key: "15", label: "15 minutes" },
                    { key: "30", label: "30 minutes" },
                    { key: "45", label: "45 minutes" },
                    { key: "60", label: "60 minutes" },
                    { key: "90", label: "90 minutes" },
                  ]}
                />
              </DialogRow>
              <DialogTextarea
                state={app}
                name="description"
                title={t("appointments.description")}
                placeholder="Enter description"
              />
              <DialogTextarea
                state={app}
                name="notes"
                title={t("appointments.notes")}
                placeholder="Enter any additional notes"
              />
            </DialogAdd>
          </>
        }
      </div>
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card className="p-0 gap-0">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">Calendar</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
            </CardContent>
          </Card>

          <Card className="p-0 gap-0">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-4">
                {
                  database.appointments.loading ?
                    <div className="flex items-center justify-center">
                      <p className="py-10 text-sm text-muted-foreground">Loading...</p>
                    </div>
                    :
                    database.appointments.data.filter(x => x.date > new Date()).sort((a, b) => a.date.getSeconds() - b.date.getSeconds()).slice(0, 3).map((appointment) => {
                      const time = moment(appointment.time, "hh:mm")
                      appointment.date.setHours(time.hours(), time.minutes())
                      return (
                        <div key={appointment.id} className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">
                              {appointment.staff.name} - {appointment.type}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <Moment fromNow date={appointment.date} />
                            </p>
                          </div>
                        </div>
                      )
                    })
                }
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="p-0">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Appointments for {formattedDate}</CardTitle>
              <Badge variant="outline" className="ml-2">
                {appointments.length} total
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous day</span>
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Select date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next day</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {
              database.appointments.loading ?
                <div className="grow flex items-center justify-center">
                  <span>Loading ...</span>
                </div>
                :
                <div className="space-y-2 p-4 pt-0">
                  {database.appointments.data.filter((p) => moment(p.date).format("YYYY-MM-DD") == moment(date).format("YYYY-MM-DD")).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{appointment.time}</div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-lg border shadow-xs p-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/doctor.png" alt={appointment.patientId} />
                          </Avatar>
                          <div>
                            <div className="text-xs text-muted-foreground">With <b>{appointment.patient.name}</b></div>
                          </div>
                        </div>
                        <div className="hidden md:block text-sm">
                          <div className="font-medium">{appointment.notes}</div>
                        </div>
                        <div className="hidden md:block text-sm">
                          <div className="font-medium">{appointment.description}</div>
                        </div>
                        <Badge className="ml-auto" variant="outline">{appointment.type}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditAppointment(appointment.id)}>Edit appointment</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCancelAppointment(appointment.id)}>Cancel appointment</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </CardContent>
        </Card>
      </div>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("appointments.confirmDelete")}</DialogTitle>
            <DialogDescription>{t("appointments.confirmDeleteMessage")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAppointment}>
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

