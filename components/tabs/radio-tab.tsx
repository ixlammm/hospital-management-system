"use client"

import type React from "react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useDatabase } from "@/lib/database"
import { Radio } from "@/lib/database/types"
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

export function RadioTab() {
    const { t } = useI18n()
    const searchState = useNamedState("")
    const database = useDatabase()
    const initialState: Radio = {
        date: new Date(),
        type: "",
        result: "",
        doctorId: "",
        patientId: ""
    }
    const radio = useNamedState(initialState)
    const dialog = useAddDialog()

    const handleAdd = async () => {
        await database.doAddRadio(radio.value)
        radio.update(initialState)
    }

    const deleteDialog = useConfirmDeleteDialog(async (item) => {
        await database.doDeleteRadio(item)
    })

    return (
        <div>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">{t("radio.title")}</h2>
                        <Total array={database.radios}/>
                    </div>
                    <DialogAdd
                        addText={t("radio.addRadio")}
                        title={t("radio.addNewRadio")}
                        description={t("radio.addNewRadioDescription")}
                        dialog={dialog}
                        handleAdd={handleAdd}
                    >
                        <DialogTextInput state={radio} name={"type"} title="Test" />
                        <DialogRow>
                            <SelectDoctor state={radio} />
                            <SelectPatient state={radio} />
                        </DialogRow>
                    </DialogAdd>
                </div>
                <Card className="border-[#E5E7EB] shadow-sm py-0 gap-0">
                    <CardSearchHeader searchState={searchState} />
                    <CardContent className="p-4">
                        <DataTable
                            array={database.radios}
                            header={[t("common.date"), t("common.type"), t("common.doctor"), t("common.patient")]}
                            cols={["date", "type", "staff.name", "patient.name"]}
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
