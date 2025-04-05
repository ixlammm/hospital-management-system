"use client"

import type React from "react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useDatabase } from "@/lib/database"
import { Invoice, Radio, Research } from "@/lib/database/types"
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
import DialogListInput from "../inputs/list-input"
import DialogNumberInput from "../inputs/number-input"

export function InvoiceTab() {
    const { t } = useI18n()
    const searchState = useNamedState("")
    const database = useDatabase()
    const initialState: Invoice = {
        date: new Date(),
        doctorId: "",
        patientId: "",
        amount: 0,
        status: "paid"
    }
    const invoice = useNamedState(initialState)
    const dialog = useAddDialog()

    const handleAdd = async () => {
        await database.doAddInvoice(invoice.value)
        invoice.update(initialState)
    }

    const deleteDialog = useConfirmDeleteDialog(async (invoice) => {
        await database.doDeleteInvoice(invoice)
    })

    return (
        <div>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">{t("invoice.title")}</h2>
                        <Total array={database.invoices} />
                    </div>
                    <DialogAdd
                        addText={t("invoice.addInvoice")}
                        title={t("invoice.addNewInvoice")}
                        description={t("invoice.addNewInvoiceDescription")}
                        dialog={dialog}
                        handleAdd={handleAdd}
                    >
                        <DialogRow>
                            <DialogListInput
                                name="status"
                                title="Status"
                                state={invoice}
                                options={[
                                    { key: "paid", label: "Paid" },
                                    { key: "unpaid", label: "Unpaid" },
                                    { key: "pending", label: "Pending" },
                                ]}
                                placeholder="Select Status"
                            />
                            <DialogNumberInput
                                name="amount"
                                title="Amount"
                                state={invoice}
                                min={0}
                                max={1000000}
                            />
                        </DialogRow>
                        <DialogRow>
                            <SelectDoctor state={invoice} />
                            <SelectPatient state={invoice} />
                        </DialogRow>
                    </DialogAdd>
                </div>
                <Card className="border-[#E5E7EB] shadow-sm py-0 gap-0">
                    <CardSearchHeader searchState={searchState} />
                    <CardContent className="p-4">
                        <DataTable
                            array={database.invoices}
                            header={[t("common.date"), t("common.doctor"), t("common.patient"), t("common.amount"), t("common.status")]}
                            cols={["date", "staff.name", "patient.name", "amount", "status"]}
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
