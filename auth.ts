import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { saltAndHashPassword } from "./lib/password"
import prisma from "./lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials: any) => {
                let user = null

                console.log(credentials)

                const pwHash = saltAndHashPassword(credentials.password)

                user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                        pswdHash: pwHash,
                    },
                })

                if (!user) {
                    throw new Error("Invalid credentials.")
                }

                return user
            },
        }),
    ],
})