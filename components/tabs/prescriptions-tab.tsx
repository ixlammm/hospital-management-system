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
import { Patient, Prescription } from "@/lib/database/types"

export function PrescriptionsTab() {
  const { t } = useI18n()
  const { toast } = useToast()
  const database = useDatabase()
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<string | null>(null)

  const [newPrescription, setNewPrescription] = useState<Prescription>({
    date: new Date(),
    doctorId: "",
    patientId: "",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewPrescription((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleAddPrescription = async () => {
    setIsLoading(true)
    try {

      await database.doAddPrescription(newPrescription)

      toast({
        title: t("prescriptions.addSuccess"),
        description: t("prescriptions.addSuccessMessage"),
      })

      // Close the dialog and reset the form
      setDialogOpen(false)
      setNewPrescription({
        date: new Date(),
        doctorId: "",
        patientId: "",
        description: "",
      })
    } catch (error) {
      console.error("Error adding patient:", error)
      toast({
        title: t("descriptions.addError"),
        description: t("descriptions.addErrorMessage"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePrescription = (id: string) => {
    setPrescriptionToDelete(id)
    setConfirmDeleteDialogOpen(true)
  }

  const confirmDeletePatient = async () => {
    if (prescriptionToDelete) {
      await database.doDeletePrescription(prescriptionToDelete)
      toast({
        title: t("prescriptions.deleteSuccess"),
        description: t("prescriptions.deleteSuccessMessage"),
      })
      setConfirmDeleteDialogOpen(false)
      setPrescriptionToDelete(null)
    }
  }

  const filteredPrescriptions = database.prescriptions.data.filter((prescription) => {
    const matchesSearch =
      prescription.id.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  
  const handleSelectChange = (field: string, value: string) => {
    setNewPrescription((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight">{t("staff.title")}</h2>
          <Badge variant="outline" className="ml-2">
            {database.prescriptions.data.length} {t("common.total")}
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
                <span>{t("")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("prescription.addnewPrescription")}</DialogTitle>
                <DialogDescription>{t("prescription.patientInfo")}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="description">{t("prescription.notes")}</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter prescription description"
                    value={newPrescription.description}
                    onChange={handleInputChange}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Label htmlFor="doctorId">{t("appointments.selectDoctor")}</Label>
                  <Select
                    defaultValue="Select a doctor"
                    value={newPrescription.doctorId}
                    onValueChange={(value) => handleSelectChange("doctorId", value)}
                  >
                    <SelectTrigger id="doctorId">
                      <SelectValue placeholder="Select a doctor" />
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
                <div className="flex flex-col gap-4">
                  <Label htmlFor="patientId">{t("appointments.selectDoctor")}</Label>
                  <Select
                    defaultValue="Select a patient"
                    value={newPrescription.patientId}
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
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleAddPrescription} disabled={isLoading}>
                  {isLoading ? t("common.adding") : t("prescription.addPatient")}
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
                placeholder={t("prescription.searchPatients")}
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
                  <SelectItem value="all">{t("prescription.allStatuses")}</SelectItem>
                  <SelectItem value="active">{t("prescription.active")}</SelectItem>
                  <SelectItem value="inactive">{t("prescription.inactive")}</SelectItem>
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
                <TableHead className="table-header">{t("prescription.name")}</TableHead>
                <TableHead className="table-header">{t("patient.name")}</TableHead>
                <TableHead className="table-header">{t("doctor.name")}</TableHead>
                <TableHead className="table-header">{t("description.name")}</TableHead>
                <TableHead className="table-header text-right">{t("common.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                database.prescriptions.loading ?
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
                  filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="table-cell font-medium">{prescription.id}</TableCell>
                      <TableCell className="table-cell">{prescription.staff.name}</TableCell>
                      <TableCell className="table-cell">{prescription.patient.name}</TableCell>
                      <TableCell className="table-cell">{prescription.description}</TableCell>
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
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeletePrescription(prescription.id)}>
                              {t("prescription.delete")}
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
            <DialogTitle>{t("prescription.confirmDelete")}</DialogTitle>
            <DialogDescription>{t("prescription.confirmDeleteMessage")}</DialogDescription>
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

