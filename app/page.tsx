import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to dashboard directly since we're not using auth for now
  redirect("/dashboard/overview")
}

