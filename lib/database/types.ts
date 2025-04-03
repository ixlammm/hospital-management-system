import { Prisma } from "@prisma/client";

export type Patient = Prisma.PatientGetPayload<{ omit: { id: true } }>;
export type Staff = Prisma.StaffGetPayload<{ omit: { id: true } }>;
export type Appointment = Prisma.AppointmentGetPayload<{ omit: { id: true } }>;
export type Prescription = Prisma.PrescriptionGetPayload<{ omit: { id: true } }>;
export type User = Prisma.UserGetPayload<{ omit: { id: true } }>;
export type Sample = Prisma.SampleGetPayload<{ omit: { id: true } }>;
export type Radio = Prisma.RadioGetPayload<{ omit: { id: true } }>;