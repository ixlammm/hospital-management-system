import { signIn, signOut } from "@/auth";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { useAction } from "./use-action";
import { signin, signout } from "@/actions/auth-actions";

export function useAuth() {
    const router = useRouter()
    const login = useAction(async (formData: FormData) => {
        const result = await signin(formData)
        if (result.error) {
            throw new Error("Invalid credentials.")
        }
        router.push("/dashboard/overview")
    })
    const logout = useAction(async () => {
        await signout()
        router.push("/login")
    })
    return { login, logout }
}