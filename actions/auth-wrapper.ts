import { User } from "next-auth"
import { requireAuth } from "./auth-actions"

export function authWrapper<T extends any[], G>(fn: (session: User, ...args: T) => Promise<G>, fallback: G | undefined = undefined): (...args: T) => Promise<G> {
    return async (...args: T) => {
        try {
            const session = await requireAuth()
            return fn(session, ...args)
        } catch (error) {
            if (fallback != undefined) {
                return fallback
            }
            throw error
        }
    }
}