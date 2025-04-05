"use client"

import type React from "react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useDatabase } from "@/lib/database"
import { Analysis, Radio } from "@/lib/database/types"
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

export function AnalysisTab() {
    const { t } = useI18n()
    const searchState = useNamedState("")
    const database = useDatabase()
    const initialState: Analysis = {
        date: new Date(),
        doctorId: "",
        patientId: "",
        details: "",
        exam: ""
    }
    const analysis = useNamedState(initialState)
    const dialog = useAddDialog()

    const handleAdd = async () => {
        await database.doAddAnalysis(analysis.value)
        analysis.update(initialState)
    }

    const deleteDialog = useConfirmDeleteDialog(async (analysis) => {
        await database.doDeleteAnalysis(analysis)
    })

    return (
        <div>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">{t("analysis.title")}</h2>
                        <Total array={database.analyses}/>
                    </div>
                    <DialogAdd
                        addText={t("analysis.addAnalysis")}
                        title={t("analysis.addNewAnalysis")}
                        description={t("analysis.addNewAnalysisDescription")}
                        dialog={dialog}
                        handleAdd={handleAdd}
                    >
                        <DialogTextInput state={analysis} name={"details"} title="Details" />
                        <DialogTextInput state={analysis} name={"exam"} title="Exam Result" />
                        <DialogRow>
                            <SelectDoctor state={analysis} />
                            <SelectPatient state={analysis} />
                        </DialogRow>
                    </DialogAdd>
                </div>
                <Card className="border-[#E5E7EB] shadow-sm py-0 gap-0">
                    <CardSearchHeader searchState={searchState} />
                    <CardContent className="p-4">
                        <DataTable
                            array={database.analyses}
                            header={[t("common.date"), t("common.doctor"), t("common.patient"), t("common.details"), t("common.exam")]}
                            cols={["date", "staff.name", "patient.name", "details", "exam"]}
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
