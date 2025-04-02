import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { saltAndHashPassword } from "./lib/password"
import prisma from "./lib/prisma"
import { Prisma } from "@prisma/client"


type MyUser = Prisma.UserGetPayload<{}>
declare module "next-auth" {
    interface Session {
        user: MyUser
    }
    interface User extends MyUser {

    }
    interface JWT {
        user: MyUser
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials: any) => {
                const pwHash = saltAndHashPassword(credentials.password)
                console.log(credentials)
                const user = await prisma.user.findUnique({
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
    callbacks: {
        async session({ session, token }: any) {
            session.user = token.user
            return session
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.user = user
            }
            return token
        }
    }
})