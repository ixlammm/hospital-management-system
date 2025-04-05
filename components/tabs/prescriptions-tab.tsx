"use client"

import type React from "react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useDatabase } from "@/lib/database"
import { Prescription, Radio } from "@/lib/database/types"
import { useI18n } from "@/lib/i18n"
import { Card, CardContent } from "../ui/card"
import SelectDoctor from "../inputs/select-doctor"
import SelectPatient from "../inputs/select-patient"
import ConfirmDeleteDialog, { useConfirmDeleteDialog } from "../inputs/delete-dialog"
import CardSearchHeader from "../inputs/card-search"
import useNamedState from "@/hooks/use-namedstate"
import DialogTextInput from "../inputs/text-input"
import DialogAdd, { useAddDialog } from "../inputs/add-dialog"
import { DialogRow } from "../inputs/dialog-layout"
import DataTable from "../inputs/data-table"
import Total from "../inputs/total"
import DialogTextarea from "../inputs/textarea-input"

export function PrescriptionsTab() {
    const { t } = useI18n()
    const searchState = useNamedState("")
    const database = useDatabase()
    const initialState: Prescription = {
        date: new Date(),
        doctorId: "",
        patientId: "",
        description: ""
    }
    const prescription = useNamedState(initialState)
    const dialog = useAddDialog()

    const handleAdd = async () => {
        await database.doAddPrescription(prescription.value)
        prescription.update(initialState)
    }

    const deleteDialog = useConfirmDeleteDialog(async (item) => {
        await database.doDeletePrescription(item)
    })

    return (
        <div>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">{t("prescription.title")}</h2>
                        <Total array={database.prescriptions}/>
                    </div>
                    <DialogAdd
                        addText={t("prescription.addPrescription")}
                        title={t("prescription.addNewPrescription")}
                        description={t("prescription.addNewPrescriptionDescription")}
                        dialog={dialog}
                        handleAdd={handleAdd}
                    >
                        <DialogTextarea state={prescription} name={"description"} title="Description" />
                        <DialogRow>
                            <SelectDoctor state={prescription} />
                            <SelectPatient state={prescription} />
                        </DialogRow>
                    </DialogAdd>
                </div>
                <Card className="border-[#E5E7EB] shadow-sm py-0 gap-0">
                    <CardSearchHeader searchState={searchState} />
                    <CardContent className="p-4">
                        <DataTable
                            array={database.prescriptions}
                            header={[t("common.date"), t("common.doctor"), t("common.patient"), t("common.description")]}
                            cols={["date", "staff.name", "patient.name", "description"]}
                            transform={{
                                "date": (value: Date) => value.toLocaleDateString(),
                            }}
                            deleteDialog={deleteDialog}
                        >
                        </DataTable>
                    </CardContent>
                </Card>
            </div>
            <ConfirmDeleteDialog confirmDeleteDialog={deleteDialog} />
        </div>
    )
}
