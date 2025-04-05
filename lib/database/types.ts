import { Prisma } from "@prisma/client";

export type Patient = Prisma.PatientGetPayload<{ omit: { id: true, ibe_a: true, ibe_r: true } }>;
export type Staff = Prisma.StaffGetPayload<{ omit: { id: true } }>;
export type Appointment = Prisma.AppointmentGetPayload<{ omit: { id: true } }>;
export type Prescription = Prisma.PrescriptionGetPayload<{ omit: { id: true } }>;
export type User = Prisma.UserGetPayload<{ omit: { id: true } }>;
export type Sample = Prisma.SampleGetPayload<{ omit: { id: true } }>;
export type Radio = Prisma.RadioGetPayload<{ omit: { id: true } }>;
export type Analysis = Prisma.AnalysisGetPayload<{ omit: { id: true } }>;
export type Research = Prisma.ResearchGetPayload<{ omit: { id: true } }>;
export type Invoice = Prisma.InvoiceGetPayload<{ omit: { id: true } }>;
export type Archive = Prisma.ArchiveGetPayload<{ omit: { id: true } }>;
export type MonthlyReport = Prisma.MonthlyReportGetPayload<{ omit: { id: true } }>;