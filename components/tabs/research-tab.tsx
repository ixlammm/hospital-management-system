"use client"

import type React from "react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useDatabase } from "@/lib/database"
import { Radio, Research } from "@/lib/database/types"
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

export function ResearchTab() {
    const { t } = useI18n()
    const searchState = useState("")
    const database = useDatabase()
    const initialState: Research = {
        date: new Date(),
        doctorId: "",
        description: "",
        subject: ""
    }
    const research = useNamedState(initialState)
    const dialog = useAddDialog()

    const handleAdd = async () => {
        await database.doAddResearch(research.value)
        research.update(initialState)
    }

    const deleteDialog = useConfirmDeleteDialog(async (research) => {
        await database.doDeleteResearch(research)
    })

    return (
        <div>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">{t("research.title")}</h2>
                        <Total array={database.researches}/>
                    </div>
                    <DialogAdd
                        addText={t("research.addResearch")}
                        title={t("research.addNewResearch")}
                        description={t("research.addNewResearchDescription")}
                        dialog={dialog}
                        handleAdd={handleAdd}
                    >
                        <DialogTextInput state={research} name={"subject"} title="Subject" />
                        <DialogTextarea state={research} name={"description"} title="Exam Result" />
                        <SelectDoctor state={research} />
                    </DialogAdd>
                </div>
                <Card className="border-[#E5E7EB] shadow-sm py-0 gap-0">
                    <CardSearchHeader searchState={searchState} />
                    <CardContent className="p-4">
                        <DataTable
                            array={database.researches}
                            header={[t("common.date"), t("common.doctor"), t("common.subject"), t("common.description")]}
                            cols={["date", "staff.name", "subject", "description"]}
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
