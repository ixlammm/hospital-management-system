import { addAppointment, Appointment, deleteAppointment, getAppointments } from "@/actions/appointments-actions";
import { addPatient, deletePatient, getPatients, Patient } from "@/actions/patient-actions";
import { addRoom, deleteRoom, getRooms, Room, updateRoom } from "@/actions/rooms-actions";
import { addStaff, deleteStaff, getStaff, Staff, updateStaff } from "@/actions/staff-actions";
import useAsyncArray from "@/hooks/use-asyncarray";

export function useDatabase() {

  const patients = useAsyncArray(getPatients);
  const staff = useAsyncArray(getStaff);
  const appointments = useAsyncArray(getAppointments);
  const rooms = useAsyncArray(getRooms);

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

  async function doAddStaff(s: Staff) {
    const r = await addStaff(s)
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

  async function doAddRoom(room: Room) {
    const r = await addRoom(room)
    if (r) 
      rooms.setData((prev) => [r, ...prev])
  }

  async function doDeleteRoom(name: string) {
    const r = await deleteRoom(name)
    if (r) 
      rooms.setData((prev) => prev.filter((r) => r.name !== name))
  }

  async function doUpdateRoom(name: string, room: Partial<Room>) {
    const r = await updateRoom(name, room)
    if (r) 
      rooms.setData((prev) => prev.map((r) => (r.name === name ? r : r)))
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
    rooms,
    doAddRoom,
    doDeleteRoom,
    doUpdateRoom,
  }
}