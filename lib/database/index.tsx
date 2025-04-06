"use client"

import { addAppointment, deleteAppointment, getAppointments, updateAppointment } from "@/actions/appointments-actions";
import { addPatient, deletePatient, getPatients } from "@/actions/patient-actions";
import { addStaff, deleteStaff, getStaff, updateStaff } from "@/actions/staff-actions";
import useAsyncArray from "@/hooks/use-asyncarray";
import { Analysis, Appointment, Archive, Invoice, MonthlyReport, Patient, Prescription, Radio, Research, Sample, Staff } from "./types";
import { addPrescription, deletePrescription, getPrescriptions, updatePrescription } from "@/actions/prescription-actions";
import { addSample, deleteSample, getSamples } from "@/actions/sample-actions";
import { addRadio, deleteRadio, getRadios, updateRadio } from "@/actions/radio-actions";
import { createContext, useContext } from "react";
import { addAnalysis, deleteAnalysis, getAnalyses } from "@/actions/analysis-actions";
import { addMonthlyReport, deleteMonthlyReport, getMonthlyReports } from "@/actions/report-actions";
import { addInvoice, deleteInvoice, getInvoices } from "@/actions/invoice-actions";
import { addArchive, deleteArchive, getArchives } from "@/actions/archive-actions";
import { addResearch, deleteResearch, getResearches } from "@/actions/research-actions";

const Database = createContext<ReturnType<typeof getDatabase> | null>(null)

function getDatabase() {

  const patients = useAsyncArray(getPatients);
  const staff = useAsyncArray(getStaff as any);
  const appointments = useAsyncArray(getAppointments);
  const prescriptions = useAsyncArray(getPrescriptions);
  const samples = useAsyncArray(getSamples)
  const radios = useAsyncArray(getRadios)
  const analyses = useAsyncArray(getAnalyses)
  const monthlyReports = useAsyncArray(getMonthlyReports)
  const invoices = useAsyncArray(getInvoices)
  const archives = useAsyncArray(getArchives)
  const researches = useAsyncArray(getResearches)

  async function doAddPatient(patient: Patient, password: string) {
    try {
      const r = await addPatient({ patient, password })
      if (r)
        patients.setData((prev) => [r, ...prev as any])
    }
    catch (e) {
      console.error(e)
    }
  }

  async function doDeletePatient(id: string) {
    try {
      const r = await deletePatient(id)
      if (r)
        patients.setData((prev) => prev.filter((p) => p.id !== id))
    }
    catch (e) {
      console.error(e)
    }
  }

  async function doAddStaff(s: Staff, password: string) {
    try {
      const r = await addStaff({ staff: s, password })
      if (r)
        staff.setData((prev) => [r, ...prev as any])
    }
    catch (e) {
      console.error(e)
    }
  }

  async function doDeleteStaff(id: string) {
    try {
      const r = await deleteStaff(id)
      if (r)
        staff.setData((prev) => prev.filter((s: any) => s.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  async function doUpdateStaff(id: string, s: Partial<Staff>) {
    try {
      const r = await updateStaff(id, s)
      if (r)
        staff.setData((prev: any) => prev.map((s: any) => (s.id === id ? {
          ...s, ...r
        } : s)))
    } catch (e) {
      console.error(e)
    }
  }

  async function doAddAppointment(appointment: Appointment) {
    try {
      const r = await addAppointment(appointment)
      if (r)
        appointments.setData((prev) => [r, ...prev as any])
    } catch (e) {
      console.error(e)
    }
  }

  async function doDeleteAppointment(id: string) {
    try {
      const r = await deleteAppointment(id)
      if (r)
        appointments.setData((prev) => prev.filter((a) => a.id !== id))

    } catch (e) {
      console.error(e)
    }
  }

  async function doUpdateAppointment(id: string, appointment: Partial<Appointment>) {
    try {
      const r = await updateAppointment(id, appointment)
      if (r)
        appointments.setData((prev) => prev.map((a) => (a.id === id ? {
          ...a, ...r as any
        } : a)))
    } catch (e) {
      console.error(e)
    }
  }

  async function doAddPrescription(prescription: Prescription) {
    try {
      const r = await addPrescription(prescription)
      if (r)
        prescriptions.setData((prev) => [r, ...prev])
    } catch (e) {
      console.error(e)
    }
  }

  async function doDeletePrescription(id: string) {
    try {
      const r = await deletePrescription(id)
      if (r)
        prescriptions.setData((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  async function doUpdatePrescription(id: string, prescription: Partial<Prescription>) {
    try {
      const r = await updatePrescription(id, prescription)
      if (r)
        prescriptions.setData((prev) => prev.map((p) => (p.id === id ? {
          ...p, ...r
        } : p)))
    } catch (e) {
      console.error(e)
    }
  }

  async function doAddSample(sample: Sample) {
    try {
      const r = await addSample(sample)
      if (r)
        samples.setData((prev) => [r, ...prev as any])
    } catch (e) {
      console.error(e)
    }
  }
  async function doDeleteSample(id: string) {
    try {
      const r = await deleteSample(id)
      if (r)
        samples.setData((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  async function doAddRadio(radio: Radio) {
    try {
      const r = await addRadio(radio)
      if (r)
        radios.setData((prev) => [r, ...prev])
    } catch (e) {
      console.error(e)
    }
  }

  async function doDeleteRadio(id: string) {
    try {
      const r = await deleteRadio(id)
      if (r)
        radios.setData((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  async function doUpdateRadio(id: string, radio: Partial<Radio>) {
    try {
      const r = await updateRadio(id, radio)
      if (r)
        radios.setData((prev) => prev.map((p) => p.id == id ? {
          ...p, ...r
        } : p))
    } catch (e) {
      console.error(e)
    }
  }

  async function doAddAnalysis(analysis: Analysis) {
    try {
      const r = await addAnalysis(analysis)
      if (r)
        analyses.setData((prev) => [r, ...prev])
    } catch (e) {
      console.error(e)
    }
  }

  async function doAddMonthlyReport(report: MonthlyReport) {
    try {
      const r = await addMonthlyReport(report)
      if (r)
        monthlyReports.setData((prev) => [r, ...prev])
    } catch (e) {
      console.error(e)
    }
  }

  async function doAddInvoice(invoice: Invoice) {
    try {
      const r = await addInvoice(invoice)
      if (r)
        invoices.setData((prev) => [r, ...prev])
    } catch (e) {
      console.error(e)
    }
  }

  async function doAddArchive(archive: Archive) {
    try {
      const r = await addArchive(archive)
      if (r)
        archives.setData((prev) => [r, ...prev])
    } catch (e) {
      console.error(e)
    }
  }

  async function doAddResearch(research: Research) {
    try {
      const r = await addResearch(research)
      if (r)
        researches.setData((prev) => [r, ...prev])
    } catch (e) {
      console.error(e)
    }
  }

  async function doDeleteAnalysis(id: string) {
    try {
      const r = await deleteAnalysis(id)
      if (r)
        analyses.setData((prev) => prev.filter((a) => a.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  async function doDeleteMonthlyReport(id: string) {
    try {
      const r = await deleteMonthlyReport(id)
      if (r)
        monthlyReports.setData((prev) => prev.filter((a) => a.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  async function doDeleteInvoice(id: string) {
    try {
      const r = await deleteInvoice(id)
      if (r)
        invoices.setData((prev) => prev.filter((a) => a.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  async function doDeleteArchive(id: string) {
    try {
      const r = await deleteArchive(id)
      if (r)
        archives.setData((prev) => prev.filter((a) => a.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  async function doDeleteResearch(id: string) {
    try {
      const r = await deleteResearch(id)
      if (r)
        researches.setData((prev) => prev.filter((a) => a.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const database = {
    patients,
    doAddPatient,
    doDeletePatient,
    staff,
    doAddStaff,
    doDeleteStaff,
    doUpdateStaff,
    appointments,
    doAddAppointment,
    doDeleteAppointment,
    doUpdateAppointment,
    prescriptions,
    doAddPrescription,
    doDeletePrescription,
    doUpdatePrescription,
    samples,
    doAddSample,
    doDeleteSample,
    radios,
    doAddRadio,
    doDeleteRadio,
    doUpdateRadio,
    analyses,
    doAddAnalysis,
    doDeleteAnalysis,
    monthlyReports,
    doAddMonthlyReport,
    doDeleteMonthlyReport,
    invoices,
    doAddInvoice,
    doDeleteInvoice,
    archives,
    doAddArchive,
    doDeleteArchive,
    researches,
    doAddResearch,
    doDeleteResearch
  }

  return database
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const database = getDatabase()
  return <Database.Provider value={database}>
    {children}
  </Database.Provider>
}

export function useDatabase() {
  const context = useContext(Database)
  if (!context)
    throw new Error("useDatabase must be used within a DatabaseProvider")
  return context
}