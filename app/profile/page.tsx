import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import ProfileForm from "@/components/profile/profile-form"

export default async function ProfilePage() {
  const { user, error } = await getCurrentUser()

  if (error || !user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileForm user={user} />
    </div>
  )
}

