// This is a mock database implementation that uses in-memory storage
// It's useful for environments where SQLite can't be used

// Define types for our database entities
export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  contact: string
  email?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  insurance?: string
  status: string
  lastVisit: string
  doctor: string
  notes?: string
}

export interface Staff {
  id: string
  name: string
  role: string
  department: string
  status: string
  contact: string
  email: string
  joined: string
  gender?: string
  address?: string
  qualifications?: string
  specialization?: string
  experience?: string
  notes?: string
}

export interface Appointment {
  id: string
  patientName: string
  patientId: string
  doctorName: string
  department: string
  date: string
  time: string
  status: string
  type: string
  duration?: string
  notes?: string
}

export interface Room {
  id: string
  type: string
  floor: string
  beds: number
  status: string
  patient: string | null
  equipment?: string
  notes?: string
}

export interface User {
  id: number
  email: string
  password: string
  name: string
  role: string
  created_at: string
}

// Database collections
export interface DatabaseCollections {
  users: User[]
  patients: Patient[]
  staff: Staff[]
  appointments: Appointment[]
  rooms: Room[]
}

// Initial data for the database
const initialData: DatabaseCollections = {
  users: [
    {
      id: 1,
      email: "admin@hospital.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
      created_at: new Date().toISOString(),
    },
  ],
  patients: [
    {
      id: "P-1001",
      name: "Emma Wilson",
      age: 45,
      gender: "Female",
      contact: "(555) 123-4567",
      status: "Active",
      lastVisit: "2023-06-15",
      doctor: "Dr. Johnson",
    },
    {
      id: "P-1002",
      name: "James Miller",
      age: 32,
      gender: "Male",
      contact: "(555) 987-6543",
      status: "Active",
      lastVisit: "2023-06-10",
      doctor: "Dr. Smith",
    },
  ],
  staff: [
    {
      id: "S-001",
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      department: "Cardiology",
      status: "On Duty",
      contact: "(555) 123-4567",
      email: "sarah.johnson@medicare.com",
      joined: "2018-03-15",
    },
    {
      id: "S-002",
      name: "Dr. Michael Smith",
      role: "Neurologist",
      department: "Neurology",
      status: "On Duty",
      contact: "(555) 234-5678",
      email: "michael.smith@medicare.com",
      joined: "2019-05-20",
    },
  ],
  appointments: [
    {
      id: "A-1001",
      patientName: "Emma Wilson",
      patientId: "P-1001",
      doctorName: "Dr. Johnson",
      department: "Cardiology",
      date: "2023-06-20",
      time: "09:00 AM",
      status: "Scheduled",
      type: "Check-up",
    },
    {
      id: "A-1002",
      patientName: "James Miller",
      patientId: "P-1002",
      doctorName: "Dr. Smith",
      department: "Neurology",
      date: "2023-06-20",
      time: "10:30 AM",
      status: "Scheduled",
      type: "Consultation",
    },
  ],
  rooms: [
    {
      id: "Room 101",
      type: "General",
      floor: "1st Floor",
      beds: 2,
      status: "Occupied",
      patient: "John Smith",
    },
    {
      id: "Room 102",
      type: "General",
      floor: "1st Floor",
      beds: 2,
      status: "Available",
      patient: null,
    },
  ],
}

// Mock database class
// class MockDatabase {
//   private data: DatabaseCollections

//   constructor() {
//     // Initialize with default data
//     this.data = { ...initialData }
//   }

//   // Users
//   async getUsers() {
//     return [...this.data.users]
//   }

//   async getUserByEmail(email: string) {
//     return this.data.users.find((user) => user.email === email) || null
//   }

//   async getUserById(id: number) {
//     return this.data.users.find((user) => user.id === id) || null
//   }

//   async addUser(user: Omit<User, "id">) {
//     const id = this.data.users.length > 0 ? Math.max(...this.data.users.map((u) => u.id)) + 1 : 1
//     const newUser = { ...user, id }
//     this.data.users.push(newUser)
//     return newUser
//   }

//   // Patients
//   async getPatients() {
//     return [...this.data.patients]
//   }

//   async getPatientById(id: string) {
//     return this.data.patients.find((patient) => patient.id === id) || null
//   }

//   async addPatient(patient: Omit<Patient, "id">) {
//     const lastId = this.data.patients.length > 0 ? this.data.patients[this.data.patients.length - 1].id : "P-1000"
//     const idNumber = Number.parseInt(lastId.split("-")[1]) + 1
//     const id = `P-${idNumber}`
//     const newPatient = { ...patient, id }
//     this.data.patients.push(newPatient)
//     return newPatient
//   }

//   async updatePatient(id: string, updates: Partial<Patient>) {
//     const index = this.data.patients.findIndex((patient) => patient.id === id)
//     if (index === -1) return null

//     const updatedPatient = { ...this.data.patients[index], ...updates }
//     this.data.patients[index] = updatedPatient
//     return updatedPatient
//   }

//   async deletePatient(id: string) {
//     const initialLength = this.data.patients.length
//     this.data.patients = this.data.patients.filter((patient) => patient.id !== id)
//     return initialLength !== this.data.patients.length
//   }

//   // Staff
//   async getStaff() {
//     return [...this.data.staff]
//   }

//   async getStaffById(id: string) {
//     return this.data.staff.find((staff) => staff.id === id) || null
//   }

//   async addStaff(staff: Omit<Staff, "id">) {
//     const lastId = this.data.staff.length > 0 ? this.data.staff[this.data.staff.length - 1].id : "S-000"
//     const idNumber = Number.parseInt(lastId.split("-")[1]) + 1
//     const id = `S-${idNumber.toString().padStart(3, "0")}`
//     const newStaff = { ...staff, id }
//     this.data.staff.push(newStaff)
//     return newStaff
//   }

//   async updateStaff(id: string, updates: Partial<Staff>) {
//     const index = this.data.staff.findIndex((staff) => staff.id === id)
//     if (index === -1) return null

//     const updatedStaff = { ...this.data.staff[index], ...updates }
//     this.data.staff[index] = updatedStaff
//     return updatedStaff
//   }

//   async deleteStaff(id: string) {
//     const initialLength = this.data.staff.length
//     this.data.staff = this.data.staff.filter((staff) => staff.id !== id)
//     return initialLength !== this.data.staff.length
//   }

//   // Appointments
//   async getAppointments() {
//     return [...this.data.appointments]
//   }

//   async getAppointmentById(id: string) {
//     return this.data.appointments.find((appointment) => appointment.id === id) || null
//   }

//   async addAppointment(appointment: Omit<Appointment, "id">) {
//     const lastId =
//       this.data.appointments.length > 0 ? this.data.appointments[this.data.appointments.length - 1].id : "A-1000"
//     const idNumber = Number.parseInt(lastId.split("-")[1]) + 1
//     const id = `A-${idNumber}`
//     const newAppointment = { ...appointment, id }
//     this.data.appointments.push(newAppointment)
//     return newAppointment
//   }

//   async updateAppointment(id: string, updates: Partial<Appointment>) {
//     const index = this.data.appointments.findIndex((appointment) => appointment.id === id)
//     if (index === -1) return null

//     const updatedAppointment = { ...this.data.appointments[index], ...updates }
//     this.data.appointments[index] = updatedAppointment
//     return updatedAppointment
//   }

//   async deleteAppointment(id: string) {
//     const initialLength = this.data.appointments.length
//     this.data.appointments = this.data.appointments.filter((appointment) => appointment.id !== id)
//     return initialLength !== this.data.appointments.length
//   }

//   // Rooms
//   async getRooms() {
//     return [...this.data.rooms]
//   }

//   async getRoomById(id: string) {
//     return this.data.rooms.find((room) => room.id === id) || null
//   }

//   async addRoom(room: Omit<Room, "id">) {
//     const lastId = this.data.rooms.length > 0 ? this.data.rooms[this.data.rooms.length - 1].id : "Room 100"
//     const idNumber = Number.parseInt(lastId.split(" ")[1]) + 1
//     const id = `Room ${idNumber}`
//     const newRoom = { ...room, id }
//     this.data.rooms.push(newRoom)
//     return newRoom
//   }

//   async updateRoom(id: string, updates: Partial<Room>) {
//     const index = this.data.rooms.findIndex((room) => room.id === id)
//     if (index === -1) return null

//     const updatedRoom = { ...this.data.rooms[index], ...updates }
//     this.data.rooms[index] = updatedRoom
//     return updatedRoom
//   }

//   async deleteRoom(id: string) {
//     const initialLength = this.data.rooms.length
//     this.data.rooms = this.data.rooms.filter((room) => room.id !== id)
//     return initialLength !== this.data.rooms.length
//   }
// }

// Create a singleton instance
// const mockDb = new MockDatabase()

// Mock database API
export const mockDb = {
  // User methods
  getUserByEmail: async (email: string) => {
    return mockDatabase.users.find((user) => user.email === email) || null
  },

  // Patient methods
  getPatients: async () => {
    return [...mockDatabase.patients]
  },

  getPatientById: async (id: string) => {
    return mockDatabase.patients.find((patient) => patient.id === id) || null
  },

  addPatient: async (patient: any) => {
    mockDatabase.patients.push(patient)
    return patient
  },

  updatePatient: async (id: string, data: any) => {
    const index = mockDatabase.patients.findIndex((patient) => patient.id === id)
    if (index !== -1) {
      mockDatabase.patients[index] = { ...mockDatabase.patients[index], ...data }
      return mockDatabase.patients[index]
    }
    return null
  },

  deletePatient: async (id: string) => {
    const index = mockDatabase.patients.findIndex((patient) => patient.id === id)
    if (index !== -1) {
      mockDatabase.patients.splice(index, 1)
      return true
    }
    return false
  },

  // Staff methods
  getStaff: async () => {
    return [...mockDatabase.staff]
  },

  getStaffById: async (id: string) => {
    return mockDatabase.staff.find((staff) => staff.id === id) || null
  },

  addStaff: async (staff: any) => {
    mockDatabase.staff.push(staff)
    return staff
  },

  updateStaff: async (id: string, data: any) => {
    const index = mockDatabase.staff.findIndex((staff) => staff.id === id)
    if (index !== -1) {
      mockDatabase.staff[index] = { ...mockDatabase.staff[index], ...data }
      return mockDatabase.staff[index]
    }
    return null
  },

  deleteStaff: async (id: string) => {
    const index = mockDatabase.staff.findIndex((staff) => staff.id === id)
    if (index !== -1) {
      mockDatabase.staff.splice(index, 1)
      return true
    }
    return false
  },

  // Appointment methods
  getAppointments: async () => {
    return [...mockDatabase.appointments]
  },

  getAppointmentById: async (id: string) => {
    return mockDatabase.appointments.find((appointment) => appointment.id === id) || null
  },

  addAppointment: async (appointment: any) => {
    mockDatabase.appointments.push(appointment)
    return appointment
  },

  updateAppointment: async (id: string, data: any) => {
    const index = mockDatabase.appointments.findIndex((appointment) => appointment.id === id)
    if (index !== -1) {
      mockDatabase.appointments[index] = { ...mockDatabase.appointments[index], ...data }
      return mockDatabase.appointments[index]
    }
    return null
  },

  deleteAppointment: async (id: string) => {
    const index = mockDatabase.appointments.findIndex((appointment) => appointment.id === id)
    if (index !== -1) {
      mockDatabase.appointments.splice(index, 1)
      return true
    }
    return false
  },

  // Room methods
  getRooms: async () => {
    return [...mockDatabase.rooms]
  },

  getRoomById: async (id: string) => {
    return mockDatabase.rooms.find((room) => room.id === id) || null
  },

  addRoom: async (room: any) => {
    mockDatabase.rooms.push(room)
    return room
  },

  updateRoom: async (id: string, data: any) => {
    const index = mockDatabase.rooms.findIndex((room) => room.id === id)
    if (index !== -1) {
      mockDatabase.rooms[index] = { ...mockDatabase.rooms[index], ...data }
      return mockDatabase.rooms[index]
    }
    return null
  },

  deleteRoom: async (id: string) => {
    const index = mockDatabase.rooms.findIndex((room) => room.id === id)
    if (index !== -1) {
      mockDatabase.rooms.splice(index, 1)
      return true
    }
    return false
  },
}

// In-memory database for development
const mockDatabase = {
  users: [
    {
      id: 1,
      email: "admin@hospital.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
    },
  ],
  patients: [
    {
      id: "P-1001",
      name: "Emma Wilson",
      age: 45,
      gender: "Female",
      contact: "(555) 123-4567",
      status: "Active",
      lastVisit: "2023-06-15",
      doctor: "Dr. Johnson",
    },
    {
      id: "P-1002",
      name: "James Miller",
      age: 32,
      gender: "Male",
      contact: "(555) 987-6543",
      status: "Active",
      lastVisit: "2023-06-10",
      doctor: "Dr. Smith",
    },
  ],
  staff: [
    {
      id: "S-001",
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      department: "Cardiology",
      status: "On Duty",
      contact: "(555) 123-4567",
      email: "sarah.johnson@medicare.com",
      joined: "2018-03-15",
    },
    {
      id: "S-002",
      name: "Dr. Michael Smith",
      role: "Neurologist",
      department: "Neurology",
      status: "On Duty",
      contact: "(555) 234-5678",
      email: "michael.smith@medicare.com",
      joined: "2019-05-20",
    },
  ],
  appointments: [
    {
      id: "A-1001",
      patientName: "Emma Wilson",
      patientId: "P-1001",
      doctorName: "Dr. Johnson",
      department: "Cardiology",
      date: "2023-06-20",
      time: "09:00 AM",
      status: "Scheduled",
      type: "Check-up",
    },
    {
      id: "A-1002",
      patientName: "James Miller",
      patientId: "P-1002",
      doctorName: "Dr. Smith",
      department: "Neurology",
      date: "2023-06-20",
      time: "10:30 AM",
      status: "Scheduled",
      type: "Consultation",
    },
  ],
  rooms: [
    {
      id: "Room 101",
      type: "General",
      floor: "1st Floor",
      beds: 2,
      status: "Occupied",
      patient: "John Smith",
    },
    {
      id: "Room 102",
      type: "General",
      floor: "1st Floor",
      beds: 2,
      status: "Available",
      patient: null,
    },
  ],
}

