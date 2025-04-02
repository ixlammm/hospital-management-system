import { saltAndHashPassword } from "@/lib/password"
import prisma from "@/lib/prisma"

async function main() {
    const admin = await prisma.user.create({
        data: {
            email: 'admin@hospital.com',
            pswdHash: saltAndHashPassword('admin123'),
            role: 'admin',
        }
    })
    console.log(`Admin user created: ${admin.email}`)

    await prisma.patient.createMany({
        data: [
            {
                name: "Alice Johnson",
                age: 30,
                gender: "female",
                contact: "123-456-7890",
                email: "alice@example.com",
                address: "123 Main St",
                
                
                
                
                status: "Active",
                lastVisit: new Date("2024-03-15"),
                
                notes: "Regular check-up",
            },
            {
                name: "Bob Williams",
                age: 45,
                gender: "male",
                contact: "987-654-3210",
                email: "bob@example.com",
                address: "456 Elm St",
                
                
                
                
                status: "Inactive",
                lastVisit: new Date("2023-11-20"),
                
                notes: "Diabetes management",
            },
            {
                name: "Charlie Davis",
                age: 50,
                gender: "male",
                contact: "555-123-4567",
                email: "charlie@example.com",
                address: "789 Oak St",
                
                
                
                
                status: "Active",
                lastVisit: new Date("2024-02-10"),
                
                notes: "Blood pressure check",
            },
            {
                name: "Diana Evans",
                age: 29,
                gender: "female",
                contact: "222-333-4444",
                email: "diana@example.com",
                address: "321 Birch St",
                
                
                
                
                status: "Active",
                lastVisit: new Date("2024-03-01"),
                
                notes: "Annual physical",
            },
            {
                name: "Edward Harris",
                age: 55,
                gender: "male",
                contact: "999-888-7777",
                email: "edward@example.com",
                address: "654 Pine St",
                
                
                
                
                status: "Inactive",
                lastVisit: new Date("2023-09-05"),
                
                notes: "Cholesterol check",
            },
            {
                name: "Fiona Carter",
                age: 33,
                gender: "female",
                contact: "777-666-5555",
                email: "fiona@example.com",
                address: "987 Maple St",
                
                
                
                
                status: "Active",
                lastVisit: new Date("2024-01-20"),
                
                notes: "Pregnancy consultation",
            },
            {
                name: "George Thompson",
                age: 40,
                gender: "male",
                contact: "333-222-1111",
                email: "george@example.com",
                address: "159 Cedar St",
                
                
                
                
                status: "Inactive",
                lastVisit: new Date("2023-07-12"),
                
                notes: "Back pain treatment",
            },
            {
                name: "Hannah Wilson",
                age: 28,
                gender: "female",
                contact: "444-555-6666",
                email: "hannah@example.com",
                address: "753 Walnut St",
                
                
                
                
                status: "Active",
                lastVisit: new Date("2024-02-25"),
                
                notes: "Skin allergy treatment",
            },
            {
                name: "Ian Martinez",
                age: 47,
                gender: "male",
                contact: "111-222-3333",
                email: "ian@example.com",
                address: "852 Spruce St",
                
                
                
                
                status: "Inactive",
                lastVisit: new Date("2023-10-30"),
                
                notes: "Heart condition monitoring",
            },
            {
                name: "Jessica Lopez",
                age: 35,
                gender: "female",
                contact: "666-777-8888",
                email: "jessica@example.com",
                address: "951 Cherry St",
                
                
                
                
                status: "Active",
                lastVisit: new Date("2024-03-05"),
                
                notes: "Migraine treatment",
            },
        ],
    });

    await prisma.staff.createMany({
        data: [
            {
                id: "1",
                name: "Dr. Alice Johnson",
                role: "medecin",
                
                status: "Active",
                contact: "123-456-7890",
                email: "alice.johnson@example.com",
                joined: new Date("2020-05-10"),
                gender: "female",
                address: "123 Heart Ave, NY",
                
                
                
                notes: "Specialist in heart transplants",
            },
            {
                id: "2",
                name: "Dr. Michael Smith",
                role: "medecin",
                
                status: "Active",
                contact: "987-654-3210",
                email: "michael.smith@example.com",
                joined: new Date("2018-03-22"),
                gender: "male",
                address: "456 Brain St, CA",
                
                
                
                notes: "Researcher in neurodegenerative diseases",
            },
            {
                id: "3",
                name: "Nurse Jessica Brown",
                role: "medecin",
                
                status: "Active",
                contact: "555-123-4567",
                email: "jessica.brown@example.com",
                joined: new Date("2019-08-15"),
                gender: "female",
                address: "789 Kids Ln, TX",
                
                
                
                notes: "Works well with children",
            },
            {
                id: "4",
                name: "Dr. Robert White",
                role: "medecin",
                
                status: "Active",
                contact: "444-987-6543",
                email: "robert.white@example.com",
                joined: new Date("2015-02-10"),
                gender: "male",
                address: "321 Bone Rd, FL",
                
                
                
                notes: "Expert in knee and hip replacements",
            },
            {
                id: "5",
                name: "Nurse Emily Davis",
                role: "medecin",
                
                status: "Active",
                contact: "666-234-7890",
                email: "emily.davis@example.com",
                joined: new Date("2021-06-05"),
                gender: "female",
                address: "555 ER Blvd, OH",
                
                
                
                notes: "Handles trauma cases efficiently",
            },
            {
                id: "6",
                name: "Dr. William Harris",
                role: "medecin",
                
                status: "Active",
                contact: "777-345-6789",
                email: "william.harris@example.com",
                joined: new Date("2017-11-12"),
                gender: "male",
                address: "101 Clinic St, WA",
                
                
                
                notes: "Family doctor with a broad knowledge base",
            },
            {
                id: "7",
                name: "Dr. Olivia Martinez",
                role: "medecin",
                
                status: "Active",
                contact: "888-456-7890",
                email: "olivia.martinez@example.com",
                joined: new Date("2016-09-08"),
                gender: "female",
                address: "222 Skin Care Rd, AZ",
                
                
                
                notes: "Specializes in acne and skin cancer treatments",
            },
            {
                id: "8",
                name: "Nurse Daniel Lee",
                role: "medecin",
                
                status: "Active",
                contact: "999-567-8901",
                email: "daniel.lee@example.com",
                joined: new Date("2014-12-20"),
                gender: "male",
                address: "333 Critical Ln, CO",
                
                
                
                notes: "Works in critical care and ICU",
            },
            {
                id: "9",
                name: "Dr. Sophia Wilson",
                role: "medecin",
                
                status: "Active",
                contact: "101-678-9012",
                email: "sophia.wilson@example.com",
                joined: new Date("2022-04-30"),
                gender: "female",
                address: "444 Vision St, NV",
                
                
                
                notes: "Performs laser eye surgeries",
            },
            {
                id: "10",
                name: "Nurse James Brown",
                role: "medecin",
                
                status: "Active",
                contact: "202-789-0123",
                email: "james.brown@example.com",
                joined: new Date("2013-07-15"),
                gender: "male",
                address: "555 OR Blvd, MA",
                
                
                
                notes: "Assists in complex surgeries",
            },
        ],
    });

    console.log("✅ 10 staff members created successfully.");

    const patients = await prisma.patient.findMany();
    const doctors = await prisma.staff.findMany();

    await prisma.appointment.createMany({
        data: [
            {
                patientId: patients[0].id,
                doctorId: doctors[0].id,
                
                date: new Date("2025-04-01"),
                time: "10:00 AM",
                status: "Scheduled",
                type: "Consultation",
                duration: "30 minutes",
                notes: "Routine heart check-up",
            },
            {
                patientId: patients[1].id,
                doctorId: doctors[1].id,
                
                date: new Date("2025-04-02"),
                time: "11:30 AM",
                status: "Completed",
                type: "Follow-up",
                duration: "20 minutes",
                notes: "Post MRI consultation",
            },
            {
                patientId: patients[2].id,
                doctorId: doctors[2].id,
                
                date: new Date("2025-04-03"),
                time: "9:00 AM",
                status: "Scheduled",
                type: "Surgery",
                duration: "2 hours",
                notes: "Knee replacement surgery",
            },
            {
                patientId: patients[3].id,
                doctorId: doctors[0].id,
                
                date: new Date("2025-04-04"),
                time: "2:00 PM",
                status: "Canceled",
                type: "Check-up",
                duration: "15 minutes",
                notes: "Patient rescheduled",
            },
            {
                patientId: patients[4].id,
                doctorId: doctors[3].id,
                
                date: new Date("2025-04-05"),
                time: "1:00 PM",
                status: "Scheduled",
                type: "Consultation",
                duration: "30 minutes",
                notes: "Acne treatment consultation",
            },
            {
                patientId: patients[5].id,
                doctorId: doctors[1].id,
                
                date: new Date("2025-04-06"),
                time: "10:30 AM",
                status: "Scheduled",
                type: "MRI Review",
                duration: "45 minutes",
                notes: "Discuss MRI results",
            },
            {
                patientId: patients[6].id,
                doctorId: doctors[2].id,
                
                date: new Date("2025-04-07"),
                time: "4:00 PM",
                status: "Completed",
                type: "Routine Check-up",
                duration: "20 minutes",
                notes: "Annual health check-up",
            },
            {
                patientId: patients[7].id,
                doctorId: doctors[4].id,
                
                date: new Date("2025-04-08"),
                time: "3:00 PM",
                status: "Scheduled",
                type: "Eye Exam",
                duration: "30 minutes",
                notes: "Check for vision correction",
            },
            {
                patientId: patients[8].id,
                doctorId: doctors[0].id,
                
                date: new Date("2025-04-09"),
                time: "9:30 AM",
                status: "Completed",
                type: "ECG Test",
                duration: "40 minutes",
                notes: "Evaluate heart function",
            },
            {
                patientId: patients[9].id,
                doctorId: doctors[3].id,
                
                date: new Date("2025-04-10"),
                time: "5:00 PM",
                status: "Scheduled",
                type: "Skin Biopsy",
                duration: "1 hour",
                notes: "Check for skin conditions",
            },
        ],
    });

    console.log("✅ 10 appointments created successfully.");
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })