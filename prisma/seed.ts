import { ABE } from "@/crypt/abe";
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
    await prisma.staff.create({
        data: {
            userId: admin.id,
            department: "ADMINISTRATION",
            abe_user_key: (await ABE.generateUserKey([ "AGENT", "ADMINISTRATION" ])).user_key,
            contact: "",
            email: "",
            name: "",
            role: "admin",
            status: "",
            joined: new Date()
        }
    })
    console.log(`Admin user created: ${admin.email}`);
    const patients = await prisma.patient.findMany();
    const doctors = await prisma.staff.findMany();

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