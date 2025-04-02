import { addAppointment, Appointment, deleteAppointment, getAppointments } from "@/actions/appointments-actions";
import { addPatient, deletePatient, getPatients, Patient } from "@/actions/patient-actions";
import { addStaff, deleteStaff, getStaff, Staff, updateStaff } from "@/actions/staff-actions";
import useAsyncArray from "@/hooks/use-asyncarray";

export function useDatabase() {

  const patients = useAsyncArray(getPatients);
  const staff = useAsyncArray(getStaff);
  const appointments = useAsyncArray(getAppointments);

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
      staff.setData((prev) => prev.map((s) => (s.id === id ? r : s)))
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
  }
}