"use client"

import { useEffect, useState } from "react"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { OverviewTab } from "@/components/tabs/overview-tab"
import { PatientsTab } from "@/components/tabs/patients-tab"
import { StaffTab } from "@/components/tabs/staff-tab"
import { AppointmentsTab } from "@/components/tabs/appointments-tab"
import { SettingsTab } from "@/components/tabs/settings-tab"
import { useI18n } from "@/lib/i18n"
import { SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { PrescriptionsTab } from "@/components/tabs/prescriptions-tab"
import { SamplesTab } from "@/components/tabs/samples-tab"
import { RadioTab } from "@/components/tabs/radio-tab"
import { AnalysisTab } from "@/components/tabs/analysis-tab"
import { ResearchTab } from "@/components/tabs/research-tab"
import { InvoiceTab } from "@/components/tabs/invoice-tab"

export default function DashboardPage({ params }: { params: Promise<{ name: string }> }) {
    const [name, setName] = useState("")

    useEffect(() => {
        (async () => {
            setName((await params).name)
        })()
    }, [])

    return (
        <>
            {name === "overview" && <OverviewTab />}
            {name === "patients" && <PatientsTab />}
            {name === "staff" && <StaffTab />}
            {name === "appointments" && <AppointmentsTab />}
            {name === "prescriptions" && <PrescriptionsTab />}
            {name === "samples" && <SamplesTab />}
            {name === "radio" && <RadioTab />}
            {name === "analysis" && <AnalysisTab />}
            {name === "research" && <ResearchTab />}
            {name === "invoice" && <InvoiceTab />}
            {name === "settings" && <SettingsTab />}
        </>
    )
}

