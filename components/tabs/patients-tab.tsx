"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { ChevronDown, Download, Filter, MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { useI18n } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"
import useAsyncArray from "@/hooks/use-asyncarray"
import { addPatient, deletePatient, getPatients } from "@/actions/patient-actions"
import { useDatabase } from "@/lib/database"
import { Skeleton } from "../ui/skeleton"

export function PatientsTab() {
  const { t } = useI18n()
  const { toast } = useToast()
  const database = useDatabase()
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null)

  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "female",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    insurance: "",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewPatient((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleRadioChange = (value: string) => {
    setNewPatient((prev) => ({
      ...prev,
      gender: value,
    }))
  }

  const handleAddPatient = async () => {
    setIsLoading(true)
    try {
      // Calculate age from date of birth
      const dob = new Date(newPatient.dob)
      const today = new Date()
      let age = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--
      }

      // Create the patient object
      const patient = {
        name: `${newPatient.firstName} ${newPatient.lastName}`,
        age: age,
        gender: newPatient.gender.charAt(0).toUpperCase() + newPatient.gender.slice(1),
        contact: newPatient.phone,
        email: newPatient.email,
        address: newPatient.address,
        city: newPatient.city,
        state: newPatient.state,
        zipCode: newPatient.zipCode,
        insurance: newPatient.insurance,
        status: "Active",
        lastVisit: new Date(),
        doctor: "Unassigned",
        notes: newPatient.notes,
      }

      // Add the patient to the database
      await database.doAddPatient(patient)

      toast({
        title: t("patients.addSuccess"),
        description: t("patients.addSuccessMessage"),
      })

      // Close the dialog and reset the form
      setDialogOpen(false)
      setNewPatient({
        firstName: "",
        lastName: "",
        dob: "",
        gender: "female",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        insurance: "",
        notes: "",
      })
    } catch (error) {
      console.error("Error adding patient:", error)
      toast({
        title: t("patients.addError"),
        description: t("patients.addErrorMessage"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePatient = (id: string) => {
    setPatientToDelete(id)
    setConfirmDeleteDialogOpen(true)
  }

  const confirmDeletePatient = async () => {
    if (patientToDelete) {
      await database.doDeletePatient(patientToDelete)
      toast({
        title: t("patients.deleteSuccess"),
        description: t("patients.deleteSuccessMessage"),
      })
      setConfirmDeleteDialogOpen(false)
      setPatientToDelete(null)
    }
  }

  const filteredPatients = database.patients.data.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight">{t("staff.title")}</h2>
          <Badge variant="outline" className="ml-2">
            {database.patients.data.length} {t("common.total")}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">{t("common.filter")}</span>
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{t("common.export")}</span>
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                <span>{t("patients.addPatient")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("patients.addNewPatient")}</DialogTitle>
                <DialogDescription>{t("patients.patientInfo")}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("patients.firstName")}</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      value={newPatient.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("patients.lastName")}</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      value={newPatient.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">{t("patients.dob")}</Label>
                    <Input id="dob" type="date" value={newPatient.dob} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">{t("patients.gender")}</Label>
                    <RadioGroup
                      value={newPatient.gender}
                      onValueChange={handleRadioChange}
                      className="flex flex-wrap gap-2 pt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">{t("patients.female")}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">{t("patients.male")}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">{t("patients.other")}</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">{t("patients.status")}</Label>
                    <Select defaultValue="Active">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">{t("patients.active")}</SelectItem>
                        <SelectItem value="Inactive">{t("patients.inactive")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("patients.phone")}</Label>
                    <Input
                      id="phone"
                      placeholder="(555) 123-4567"
                      value={newPatient.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("patients.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="patient@example.com"
                      value={newPatient.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">{t("patients.address")}</Label>
                  <Input
                    id="address"
                    placeholder="Street address"
                    value={newPatient.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t("patients.city")}</Label>
                    <Input id="city" placeholder="City" value={newPatient.city} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">{t("patients.state")}</Label>
                    <Input id="state" placeholder="State" value={newPatient.state} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="zipCode">{t("patients.zipCode")}</Label>
                    <Input
                      id="zipCode"
                      placeholder="Zip code"
                      value={newPatient.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">{t("patients.insurance")}</Label>
                  <Input
                    id="insurance"
                    placeholder="Insurance provider"
                    value={newPatient.insurance}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">{t("patients.notes")}</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any initial medical notes or conditions"
                    value={newPatient.notes}
                    onChange={handleInputChange}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleAddPatient} disabled={isLoading}>
                  {isLoading ? t("common.adding") : t("patients.addPatient")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card className="border-[#E5E7EB] shadow-sm py-0 gap-0">
        <CardHeader className="p-4 border-b border-[#E5E7EB] gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder={t("patients.searchPatients")}
                className="w-full pl-10 border-gray-200 bg-[#F9FAFB]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-9 border-gray-200 bg-[#F9FAFB]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("patients.allStatuses")}</SelectItem>
                  <SelectItem value="active">{t("patients.active")}</SelectItem>
                  <SelectItem value="inactive">{t("patients.inactive")}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">{t("common.view")}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-[#E5E7EB]">
                <TableHead className="table-header">{t("patients.patientId")}</TableHead>
                <TableHead className="table-header">{t("patients.name")}</TableHead>
                <TableHead className="table-header hidden md:table-cell">{t("patients.age")}</TableHead>
                <TableHead className="table-header hidden md:table-cell">{t("patients.gender")}</TableHead>
                <TableHead className="table-header hidden lg:table-cell">{t("patients.contact")}</TableHead>
                <TableHead className="table-header">{t("patients.status")}</TableHead>
                <TableHead className="table-header hidden lg:table-cell">{t("patients.lastVisit")}</TableHead>
                <TableHead className="table-header hidden md:table-cell">{t("patients.doctor")}</TableHead>
                <TableHead className="table-header text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                database.patients.loading ?
                  new Array(4).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      {
                        new Array(8).fill(0).map((_, index) => (
                          <TableCell key={index} className="table-cell">
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))
                      }
                    </TableRow>
                  ))
                  :
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="table-cell font-medium">{patient.id}</TableCell>
                      <TableCell className="table-cell">{patient.name}</TableCell>
                      <TableCell className="table-cell hidden md:table-cell">{patient.age}</TableCell>
                      <TableCell className="table-cell hidden md:table-cell">{patient.gender}</TableCell>
                      <TableCell className="table-cell hidden lg:table-cell">{patient.contact}</TableCell>
                      <TableCell className="table-cell">
                        <Badge variant={patient.status === "Active" ? "default" : "outline"}>{patient.status}</Badge>
                      </TableCell>
                      <TableCell className="table-cell hidden lg:table-cell">{patient.lastVisit.toDateString()}</TableCell>
                      <TableCell className="table-cell hidden md:table-cell">{patient.doctor}</TableCell>
                      <TableCell className="table-cell text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                toast({
                                  title: t("patients.viewDetails"),
                                  description: `${t("patients.viewingDetails")} ${patient.name}`,
                                })
                              }
                            >
                              {t("patients.viewDetails")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toast({
                                  title: t("patients.editPatient"),
                                  description: `${t("patients.editingPatient")} ${patient.name}`,
                                })
                              }
                            >
                              {t("patients.editPatient")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                toast({
                                  title: t("patients.medicalHistory"),
                                  description: `${t("patients.viewingMedicalHistory")} ${patient.name}`,
                                })
                              }
                            >
                              {t("patients.medicalHistory")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toast({
                                  title: t("patients.scheduleAppointment"),
                                  description: `${t("patients.schedulingAppointment")} ${patient.name}`,
                                })
                              }
                            >
                              {t("patients.scheduleAppointment")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeletePatient(patient.id)}>
                              {t("patients.deletePatient")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("patients.confirmDelete")}</DialogTitle>
            <DialogDescription>{t("patients.confirmDeleteMessage")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDeletePatient}>
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

