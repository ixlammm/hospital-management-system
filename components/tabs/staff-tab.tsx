"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import type React from "react"

import { useState } from "react"
import { ChevronDown, Download, Filter, MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { useI18n } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"
import { useDatabase } from "@/lib/database"
import { Skeleton } from "../ui/skeleton"
import { Staff } from "@/lib/database/types"

const roles = {
  "reception": "Réceptionniste",
  "medecin": "Médecin",
  "infirmier": "Infirmier",
  "radiologue": "Radiologue",
  "laborantin": "Laborantin",
  "comptable": "Comptable",
}

export function StaffTab() {
  const { t } = useI18n()
  const { toast } = useToast()
  const { staff, doAddStaff, doDeleteStaff, doUpdateStaff } = useDatabase()
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [staffToUpdateStatus, setStaffToUpdateStatus] = useState<{ id: string; name: string; status: string } | null>(
    null,
  )

  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    role: "medecin",
    department: "cardiology",
    email: "",
    phone: "",
    address: "",
    gender: "female",
    notes: "",
    password: "",

  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewStaff((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setNewStaff((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleRadioChange = (value: string) => {
    setNewStaff((prev) => ({
      ...prev,
      gender: value,
    }))
  }

  const handleAddStaff = async () => {
    // Create the staff object
    const staffMember = {
      name: `${newStaff.role === "doctor" ? "Dr. " : ""}${newStaff.firstName} ${newStaff.lastName}`,
      role: newStaff.role as Staff["role"],
      status: "On Duty",
      contact: newStaff.phone,
      email: newStaff.email,
      joined: new Date(),
      gender: newStaff.gender as Staff["gender"],
      address: newStaff.address,
      notes: newStaff.notes,
      userId: null,
    }


    // Add the staff member to the database
    await doAddStaff(staffMember as any, newStaff.password)

    toast({
      title: t("staff.addSuccess"),
      description: t("staff.addSuccessMessage"),
    })

    // Close the dialog and reset the form
    setDialogOpen(false)
    setNewStaff({
      firstName: "",
      lastName: "",
      role: "nurse",
      department: "cardiology",
      email: "",
      phone: "",
      address: "",
      gender: "male",
      notes: "",
      password: ""
    })
  }

  const handleDeleteStaff = (id: string) => {
    setStaffToDelete(id)
    setConfirmDeleteDialogOpen(true)
  }

  const confirmDeleteStaff = async () => {
    if (staffToDelete) {
      await doDeleteStaff(staffToDelete)
      toast({
        title: t("staff.deleteSuccess"),
        description: t("staff.deleteSuccessMessage"),
      })
      setConfirmDeleteDialogOpen(false)
      setStaffToDelete(null)
    }
  }

  const handleUpdateStatus = (id: string, name: string, currentStatus: string) => {
    setStaffToUpdateStatus({ id, name, status: currentStatus })
    setStatusDialogOpen(true)
  }

  const confirmUpdateStatus = async (newStatus: string) => {
    if (staffToUpdateStatus) {
      await doUpdateStaff(staffToUpdateStatus.id, { status: newStatus })
      toast({
        title: t("staff.statusUpdateSuccess"),
        description: t("staff.statusUpdateSuccessMessage"),
      })
      setStatusDialogOpen(false)
      setStaffToUpdateStatus(null)
    }
  }

  // Filter staff based on search term and department filter
  const filteredStaff = staff.data.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight">{t("staff.title")}</h2>
          <Badge variant="outline" className="ml-2">
            {staff.data.length} {t("common.total")}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("common.filter")}</span>
          </Button>
          <Button variant="outline">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("common.export")}</span>
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-3.5 w-3.5" />
                <span>{t("staff.addStaff")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("staff.addNewStaff")}</DialogTitle>
                <DialogDescription>{t("staff.staffInfo")}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("staff.firstName")}</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      value={newStaff.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("staff.lastName")}</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      value={newStaff.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">{t("staff.role")}</Label>
                    <Select value={newStaff.role} onValueChange={(value) => handleSelectChange("role", value)}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          Object.entries(roles).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">{t("staff.department")}</Label>
                    <Select
                      value={newStaff.department}
                      onValueChange={(value) => handleSelectChange("department", value)}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardiology">{t("staff.cardiology")}</SelectItem>
                        <SelectItem value="neurology">{t("staff.neurology")}</SelectItem>
                        <SelectItem value="pediatrics">{t("staff.pediatrics")}</SelectItem>
                        <SelectItem value="orthopedics">{t("staff.orthopedics")}</SelectItem>
                        <SelectItem value="emergency">{t("staff.emergency")}</SelectItem>
                        <SelectItem value="surgery">{t("staff.surgery")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">{t("staff.gender")}</Label>
                  <RadioGroup value={newStaff.gender} onValueChange={handleRadioChange} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">{t("staff.female")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">{t("staff.male")}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("staff.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="staff@example.com"
                      value={newStaff.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("staff.phone")}</Label>
                    <Input
                      id="phone"
                      placeholder="(555) 123-4567"
                      value={newStaff.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("staff.password")}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="John1234"
                      value={newStaff.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">{t("staff.address")}</Label>
                  <Input
                    id="address"
                    placeholder="Street address"
                    value={newStaff.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">{t("staff.notes")}</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes"
                    value={newStaff.notes}
                    onChange={handleInputChange}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleAddStaff}>{t("staff.addStaff")}</Button>
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
                placeholder={t("staff.searchStaff")}
                className="w-full pl-10 border-gray-200 bg-[#F9FAFB]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-8">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("staff.allDepartments")}</SelectItem>
                  <SelectItem value="cardiology">{t("staff.cardiology")}</SelectItem>
                  <SelectItem value="neurology">{t("staff.neurology")}</SelectItem>
                  <SelectItem value="pediatrics">{t("staff.pediatrics")}</SelectItem>
                  <SelectItem value="surgery">{t("staff.surgery")}</SelectItem>
                  <SelectItem value="emergency">{t("staff.emergency")}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("common.view")}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <Table className="p-4">
            <TableHeader>
              <TableRow>
                <TableHead>{t("staff.name")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("staff.role")}</TableHead>
                <TableHead>{t("staff.status")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("staff.contact")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("staff.joined")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                staff.loading ?
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
                  : filteredStaff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/doctor.png" alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{member.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{member.role}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            member.status === "On Duty"
                              ? "default"
                              : member.status === "Off Duty"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{member.contact}</TableCell>
                      <TableCell className="hidden md:table-cell">{member.joined.toDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                toast({
                                  title: t("staff.viewProfile"),
                                  description: `${t("staff.viewingProfile")} ${member.name}`,
                                })
                              }
                            >
                              {t("staff.viewProfile")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toast({
                                  title: t("staff.editDetails"),
                                  description: `${t("staff.editingDetails")} ${member.name}`,
                                })
                              }
                            >
                              {t("staff.editDetails")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUpdateStatus(member.id, member.name, member.status)}>
                              {t("staff.changeStatus")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toast({
                                  title: t("staff.schedule"),
                                  description: `${t("staff.viewingSchedule")} ${member.name}`,
                                })
                              }
                            >
                              {t("staff.schedule")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteStaff(member.id)}>
                              {t("staff.deleteStaff")}
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
            <DialogTitle>{t("staff.confirmDelete")}</DialogTitle>
            <DialogDescription>{t("staff.confirmDeleteMessage")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteStaff}>
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("staff.changeStatus")}</DialogTitle>
            <DialogDescription>
              {staffToUpdateStatus && `${t("staff.currentStatus")}: ${staffToUpdateStatus.status}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>{t("staff.selectNewStatus")}</Label>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="justify-start" onClick={() => confirmUpdateStatus("On Duty")}>
                  <Badge variant="default" className="mr-2">
                    {t("staff.onDuty")}
                  </Badge>
                  {t("staff.availableForWork")}
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => confirmUpdateStatus("Off Duty")}>
                  <Badge variant="secondary" className="mr-2">
                    {t("staff.offDuty")}
                  </Badge>
                  {t("staff.notCurrentlyWorking")}
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => confirmUpdateStatus("On Leave")}>
                  <Badge variant="outline" className="mr-2">
                    {t("staff.onLeave")}
                  </Badge>
                  {t("staff.onVacationOrLeave")}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

