"use client"

import type React from "react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useDatabase } from "@/lib/database"
import { Radio, Sample } from "@/lib/database/types"
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
import DialogNumberInput from "../inputs/number-input"

export function SamplesTab() {
    const { t } = useI18n()
    const searchState = useNamedState("")
    const database = useDatabase()
    const initialState: Sample = {
        date: new Date(),
        doctorId: "",
        patientId: "",
        bloodPressure: "",
        heartRate: 0,
        temperature: 0,
        observation: "",
    }
    const sample = useNamedState(initialState)
    const dialog = useAddDialog()

    const handleAdd = async () => {
        await database.doAddSample(sample.value)
        sample.update(initialState)
    }

    const deleteDialog = useConfirmDeleteDialog(async (item) => {
        await database.doDeleteSample(item)
    })

    const filterdArray = database.samples.data.filter((item) => {
        return item.observation.toLowerCase().includes(searchState.value.toLowerCase()) ||
            item.patient.name.toLowerCase().includes(searchState.value.toLowerCase())
    })

    return (
        <div>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">{t("samples.title")}</h2>
                        <Total array={database.samples}/>
                    </div>
                    <DialogAdd
                        addText={t("samples.addSample")}
                        title={t("samples.addNewSample")}
                        description={t("samples.addNewSampleDescription")}
                        dialog={dialog}
                        handleAdd={handleAdd}
                    >
                        <DialogTextarea state={sample} name={"observation"} title="Observation" />
                        <DialogNumberInput state={sample} name={"heartRate"} title="Heart Rate" />
                        <DialogNumberInput state={sample} name={"temperature"} title="Temperature" />
                        <DialogTextInput state={sample} name={"bloodPressure"} title="Blood Pressure" />
                        <DialogRow>
                            <SelectDoctor state={sample} />
                            <SelectPatient state={sample} />
                        </DialogRow>
                    </DialogAdd>
                </div>
                <Card className="border-[#E5E7EB] shadow-sm py-0 gap-0">
                    <CardSearchHeader searchState={searchState} />
                    <CardContent className="p-4">
                        <DataTable
                            array={{
                                data: filterdArray,
                                loading: false
                            }}
                            header={[t("common.date"), t("common.patient"), t("common.observation")]}
                            cols={["date", "patient.name", "observation"]}
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
