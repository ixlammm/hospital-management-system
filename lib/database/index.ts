import { addAppointment, deleteAppointment, getAppointments } from "@/actions/appointments-actions";
import { addPatient, deletePatient, getPatients } from "@/actions/patient-actions";
import { addStaff, deleteStaff, getStaff, updateStaff } from "@/actions/staff-actions";
import useAsyncArray from "@/hooks/use-asyncarray";
import { Appointment, Patient, Prescription, Radio, Sample, Staff } from "./types";
import { addPrescription, deletePrescription, getPrescriptions, updatePrescription } from "@/actions/prescription-actions";
import { addSample, deleteSample, getSamples } from "@/actions/sample-actions";
import { addRadio, deleteRadio, getRadios } from "@/actions/radio-actions";

export function useDatabase() {

  const patients = useAsyncArray(getPatients);
  const staff = useAsyncArray(getStaff);
  const appointments = useAsyncArray(getAppointments);
  const prescriptions = useAsyncArray(getPrescriptions);
  const samples = useAsyncArray(getSamples)
  const radios = useAsyncArray(getRadios)

  async function doAddPatient(patient: Patient) {
    const r = await addPatient(patient)
    if (r)
      patients.setData((prev) => [r, ...prev])
  }

  async function doDeletePatient(id: string) {
    const r = await deletePatient(id)
    if (r)
      patients.setData((prev) => prev.filter((p) => p.id !== id))
  }

  async function doAddStaff(s: Staff, password: string) {
    const r = await addStaff({ staff: s, password })
    if (r)
      staff.setData((prev) => [r, ...prev])
  }

  async function doDeleteStaff(id: string) {
    const r = await deleteStaff(id)
    if (r)
      staff.setData((prev) => prev.filter((s) => s.id !== id))
  }

  async function doUpdateStaff(id: string, s: Partial<Staff>) {
    const r = await updateStaff(id, s)
    if (r)
      staff.setData((prev) => prev.map((s) => (s.id === id ? {
        ...s, ...r
      } : s)))
  }

  async function doAddAppointment(appointment: Appointment) {
    const r = await addAppointment(appointment)
    if (r)
      appointments.setData((prev) => [r, ...prev])
  }

  async function doDeleteAppointment(id: string) {
    const r = await deleteAppointment(id)
    if (r)
      appointments.setData((prev) => prev.filter((a) => a.id !== id))
  }

  async function doAddPrescription(prescription: Prescription) {
    const r = await addPrescription(prescription)
    if (r)
      prescriptions.setData((prev) => [r, ...prev])
  }

  async function doDeletePrescription(id: string) {
    const r = await deletePrescription(id)
    if (r)
      prescriptions.setData((prev) => prev.filter((p) => p.id !== id))
  }

  async function doUpdatePrescription(id: string, prescription: Partial<Prescription>) {
    const r = await updatePrescription(id, prescription)
    if (r)
      prescriptions.setData((prev) => prev.map((p) => (p.id === id ? {
        ...p, ...r
      } : p)))
  }

  async function doAddSample(sample: Sample) {
    const r = await addSample(sample)
    if (r)
      samples.setData((prev) => [r, ...prev])
  }
  async function doDeleteSample(id: string) {
    const r = await deleteSample(id)
    if (r)
      samples.setData((prev) => prev.filter((p) => p.id !== id))
  }

  async function doAddRadio(radio: Radio) {
    const r = await addRadio(radio)
    if (r)
      radios.setData((prev) => [r, ...prev])
  }

  async function doDeleteRadio(id: string) {
    const r = await deleteRadio(id)
    if (r)
      radios.setData((prev) => prev.filter((p) => p.id !== id))
  }

  return {
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
  }
}