import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getCourses } from "@/lib/courses"
import CourseList from "@/components/courses/course-list"

export default async function CoursesPage() {
  const { user, error } = await getCurrentUser()

  if (error || !user) {
    redirect("/login")
  }

  const { data: courses } = await getCourses(user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <CourseList courses={courses || []} />
    </div>
  )
}

