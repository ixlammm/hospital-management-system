import { saltAndHashPassword } from "@/lib/password"
import prisma from "@/lib/prisma"

async function main() {
    const admin = await prisma.user.create({
        data: {
            email: 'admin@hospital.com',
            pswdHash: saltAndHashPassword('admin123'),
            role: 'admin',
            passwordChanged: true,
        }
    })
    console.log(`Admin user created: ${admin.email}`)

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