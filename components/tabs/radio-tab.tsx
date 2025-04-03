"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown, MoreHorizontal, Plus, Search, SlidersHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useDatabase } from "@/lib/database"
import { Radio } from "@/lib/database/types"
import { useI18n } from "@/lib/i18n"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

export function RadioTab() {
    const { t } = useI18n()
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const database = useDatabase()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)
    const [radioToDelete, setRadioToDelete] = useState<string | null>(null)
    const [newRadio, setNewRadio] = useState<Radio>({
        date: new Date(),
        type: "",
        result: "",
        doctorId: "",
        patientId: "",
    })

    const handleInputChange = (id: string, value: string) => {
        setNewRadio((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    const handleAddRadio = async () => {
        setIsLoading(true)
        try {
            await database.doAddRadio(newRadio)
            toast({ title: "Radio added successfully" })
            setDialogOpen(false)
            setNewRadio({
                date: new Date(),
                type: "",
                result: "",
                doctorId: "",
                patientId: ""
            })
        } catch (error) {
            toast({ title: "Error adding radio", variant: "destructive" })
        } finally {
            setIsLoading(false)
        }
    }


    const handleSelectChange = (field: string, value: string) => {
        setNewRadio((prev) => ({
            ...prev,
            [field]: value,
        }))
    }


    const handleDeleteRadio = (id: string) => {
        setRadioToDelete(id)
        setConfirmDeleteDialogOpen(true)
    }

    const confirmDeleteRadio = async () => {
        if (radioToDelete) {
            await database.doDeleteRadio(radioToDelete)
            toast({
                title: t("prescriptions.deleteSuccess"),
                description: t("prescriptions.deleteSuccessMessage"),
            })
            setConfirmDeleteDialogOpen(false)
            setRadioToDelete(null)
        }
    }

    return (
        <div>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">{t("staff.title")}</h2>
                        <Badge variant="outline" className="ml-2">
                            {database.radios.data.length} {t("common.total")}
                        </Badge>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4" /> Add Radio
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Radio</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-2">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Input id="type" value={newRadio.type} onChange={(e) => handleInputChange("type", e.target.value)} />
                                </div>
                                <div className="flex gap-4">

                                    <div className="flex-1 flex flex-col gap-4">
                                        <Label htmlFor="doctorId">{t("appointments.selectDoctor")}</Label>
                                        <Select
                                            defaultValue="Select a doctor"
                                            value={newRadio.doctorId}
                                            onValueChange={(value) => handleSelectChange("doctorId", value)}
                                        >
                                            <SelectTrigger className="w-full" id="doctorId">
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
                                    <div className="flex-1 flex flex-col gap-4">
                                        <Label htmlFor="patientId">{t("appointments.selectDoctor")}</Label>
                                        <Select
                                            defaultValue="Select a patient"
                                            value={newRadio.patientId}
                                            onValueChange={(value) => handleSelectChange("patientId", value)}
                                        >
                                            <SelectTrigger className="w-full" id="patientId">
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
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddRadio} disabled={isLoading}>
                                    {isLoading ? "Adding..." : "Add Radio"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
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
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    database.radios.loading ?
                                        new Array(4).fill(0).map((_, index) => (
                                            <TableRow key={index}>
                                                {
                                                    new Array(5).fill(0).map((_, index) => (
                                                        <TableCell key={index} className="table-cell">
                                                            <Skeleton className="h-4 w-full" />
                                                        </TableCell>
                                                    ))
                                                }
                                            </TableRow>
                                        ))
                                        : database.radios.data.map((radio, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="table-cell">{radio.date.toLocaleDateString()}</TableCell>
                                                <TableCell className="table-cell">{radio.type}</TableCell>
                                                <TableCell className="table-cell">{radio.staff.name}</TableCell>
                                                <TableCell className="table-cell">{radio.patient.name}</TableCell>
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
                                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteRadio(radio.id)}>
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
            </div>

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
                        <Button variant="destructive" onClick={confirmDeleteRadio}>
                            {t("common.delete")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
