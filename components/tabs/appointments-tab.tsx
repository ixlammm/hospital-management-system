"use client"

import type React from "react"
import moment from "moment"

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
import Moment from "react-moment"
import { useSession } from "next-auth/react"

function formatRelativeDate(date: Date) {
  return moment(date).calendar(null, {
    sameDay: "[Today]",
    nextDay: "[Tomorrow]",
    nextWeek: "dddd", // Example: "Thursday"
    sameElse: "MMMM YYYY", // Example: "April 2025"
  });
}

export function AppointmentsTab() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const { t } = useI18n()
  const database = useDatabase()
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)
  const [appToDelete, setAppToDelete] = useState<string | null>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const session = useSession()

  useEffect(() => {
    (async () => {
      const formatedDate = moment(date).format("YYYY-MM-DD")
      const filterDate = moment.utc(formatedDate).toDate()
      const appointments = await getAppointments(filterDate)
      setAppointments(appointments)
      setNewAppointment((prev) => ({
        ...prev,
        date: formatedDate,
      }))
    })()
  }, [date])

  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    doctorId: "",
    date: date?.toISOString(),
    time: "09:00",
    duration: "30",
    type: "check-up",
    notes: "",
    status: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    console.log(id, value)
    setNewAppointment((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setNewAppointment((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCancelAppointment = (id: string) => {
    setAppToDelete(id)
    setConfirmDeleteDialogOpen(true)
  }

  const handleAddAppointment = async () => {
    // Here you would typically send this data to your backend
    console.log("Adding new appointment:", newAppointment)

    await database.doAddAppointment({
      ...newAppointment,
      date: new Date(newAppointment.date ?? ""),
    })

    // For demo purposes, we'll just close the dialog
    setDialogOpen(false)

    // Reset the form
    setNewAppointment({
      patientId: "",
      doctorId: "",
      date: "",
      time: "09:00",
      duration: "30",
      type: "check-up",
      notes: "",
      status: "Scheduled"
    })
  }

  const confirmDeleteAppointment = async () => {
    if (appToDelete) {
      await database.doDeleteAppointment(appToDelete)
      toast({
        title: t("patients.deleteSuccess"),
        description: t("patients.deleteSuccessMessage"),
      })
      setConfirmDeleteDialogOpen(false)
      setAppToDelete(null)
    }
  }

  const formattedDate = date ? format(date, "MMMM d, yyyy") : ""

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">Manage and schedule patient appointments</p>
        </div>
        {
          session.status == "authenticated" && (session.data.user.role == "admin" || session.data.user.role == "reception") &&

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-3.5 w-3.5" />
                <span>New Appointment</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>Enter appointment details to schedule a new patient appointment.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-4">
                  <Label htmlFor="patientId">{t("appointments.selectPatient")}</Label>
                  <Select
                    defaultValue="Select a patient"
                    value={newAppointment.patientId}
                    onValueChange={(value) => handleSelectChange("patientId", value)}
                  >
                    <SelectTrigger id="patientId">
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {database.patients.data.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-4">
                  <Label htmlFor="doctorId">{t("appointments.selectDoctor")}</Label>
                  <Select
                    defaultValue="Select a doctor"
                    value={newAppointment.doctorId}
                    onValueChange={(value) => handleSelectChange("doctorId", value)}
                  >
                    <SelectTrigger id="doctorId">
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {database.staff.data.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">{t("appointments.date")}</Label>
                    <Input id="date" type="date" value={newAppointment.date} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">{t("appointments.time")}</Label>
                    <Input id="time" type="time" value={newAppointment.time} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">{t("appointments.duration")}</Label>
                    <Select
                      value={newAppointment.duration}
                      onValueChange={(value) => handleSelectChange("duration", value)}
                    >
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 {t("appointments.minutes")}</SelectItem>
                        <SelectItem value="30">30 {t("appointments.minutes")}</SelectItem>
                        <SelectItem value="45">45 {t("appointments.minutes")}</SelectItem>
                        <SelectItem value="60">60 {t("appointments.minutes")}</SelectItem>
                        <SelectItem value="90">90 {t("appointments.minutes")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">{t("appointments.type")}</Label>
                    <Select value={newAppointment.type} onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="check-up">{t("appointments.checkup")}</SelectItem>
                        <SelectItem value="consultation">{t("appointments.consultation")}</SelectItem>
                        <SelectItem value="follow-up">{t("appointments.followup")}</SelectItem>
                        <SelectItem value="emergency">{t("appointments.emergency")}</SelectItem>
                        <SelectItem value="procedure">{t("appointments.procedure")}</SelectItem>
                        <SelectItem value="surgery">{t("appointments.surgery")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">{t("appointments.notes")}</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional notes"
                    value={newAppointment.notes}
                    onChange={handleInputChange}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleAddAppointment}>{t("appointments.scheduleNew")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            <div className="space-y-2 p-4 pt-0">
              {appointments.map((appointment) => (
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
                    <Badge className="ml-auto" variant="outline">{appointment.status}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Reschedule</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleCancelAppointment(appointment.id)}>Cancel appointment</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
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

