"use client"

import type React from "react"
import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { useI18n } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"
import { useDatabase } from "@/lib/database"
import { Skeleton } from "../ui/skeleton"
import { Sample } from "@/lib/database/types"

export function SamplesTab() {
    const { t } = useI18n()
    const { toast } = useToast()
    const database = useDatabase()
    const [searchTerm, setSearchTerm] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [sampleToDelete, setSampleToDelete] = useState<string | null>(null)
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)

    const [newSample, setNewSample] = useState<Sample>({
        date: new Date(),
        observation: "",
        temperature: 0,
        bloodPressure: "",
        heartRate: 0,
        patientId: "",
        doctorId: "",
    })


    const handleDeleteSample = (id: string) => {
        setSampleToDelete(id)
        setConfirmDeleteDialogOpen(true)
    }

    const confirmDeleteSample = async () => {
        if (sampleToDelete) {
            await database.doDeleteSample(sampleToDelete)
            toast({
                title: t("prescriptions.deleteSuccess"),
                description: t("prescriptions.deleteSuccessMessage"),
            })
            setConfirmDeleteDialogOpen(false)
            setSampleToDelete(null)
        }
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setNewSample((prev) => ({
            ...prev,
            [id]: id === "temperature" || id === "heartRate" ? parseFloat(value) : value,
        }))
    }

    const handleAddSample = async () => {
        setIsLoading(true)
        try {
            await database.doAddSample(newSample)
            toast({ title: t("samples.addSuccess"), description: t("samples.addSuccessMessage") })
            setDialogOpen(false)
            setNewSample({
                date: new Date(),
                observation: "",
                temperature: 0,
                bloodPressure: "",
                heartRate: 0,
                patientId: "",
                doctorId: "",
            })
        } catch (error) {
            toast({ title: t("samples.addError"), description: t("samples.addErrorMessage"), variant: "destructive" })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelectChange = (field: string, value: string) => {
        setNewSample((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t("samples.title")}</h2>
                <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    {t("samples.addNew")}
                </Button>
            </div>

            <Card>
                <CardHeader className="flex items-center gap-4">
                    <Input placeholder={t("samples.search")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("samples.date")}</TableHead>
                                <TableHead>{t("samples.patient")}</TableHead>
                                <TableHead>{t("samples.observation")}</TableHead>
                                <TableHead>{t("samples.actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {database.samples.loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                database.samples.data.map((sample) => (
                                    <TableRow key={sample.id}>
                                        <TableCell>{sample.date.toDateString()}</TableCell>
                                        <TableCell>{sample.patientId}</TableCell>
                                        <TableCell>{sample.observation}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>{t("samples.edit")}</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleDeleteSample(sample.id)} className="text-destructive">{t("samples.delete")}</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Sample</DialogTitle>
                        <DialogDescription>Fill in the details of the sample.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="observation">Observation</Label>
                            <Textarea id="observation" value={newSample.observation} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="temperature">Temperature</Label>
                            <Input id="temperature" type="number" value={newSample.temperature} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bloodPressure">Blood Pressure</Label>
                            <Input id="bloodPressure" value={newSample.bloodPressure} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="heartRate">Heart Rate</Label>
                            <Input id="heartRate" type="number" value={newSample.heartRate} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="flex gap-4">

                        <div className="flex-1 flex flex-col gap-4">
                            <Label htmlFor="doctorId">{t("appointments.selectDoctor")}</Label>
                            <Select
                                defaultValue="Select a doctor"
                                value={newSample.doctorId}
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
                                value={newSample.patientId}
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
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddSample} disabled={isLoading}>
                            {isLoading ? "Adding..." : "Add Sample"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


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
                        <Button variant="destructive" onClick={confirmDeleteSample}>
                            {t("common.delete")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div >
    )
}
