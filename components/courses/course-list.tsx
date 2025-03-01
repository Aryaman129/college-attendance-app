"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import type { Course } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddCourseDialog } from "./add-course-dialog"

interface CourseListProps {
  courses: Course[]
}

export default function CourseList({ courses: initialCourses }: CourseListProps) {
  const [courses, setCourses] = useState(initialCourses)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleAddCourse = (newCourse: Course) => {
    setCourses([...courses, newCourse])
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage your courses and track attendance</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.course_code}</CardTitle>
              <CardDescription>{course.course_title}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Faculty</dt>
                  <dd className="text-sm">{course.faculty}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Slot</dt>
                  <dd className="text-sm">{course.slot}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                  <dd className="text-sm">{course.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Attendance</dt>
                  <dd className="text-sm">{course.attendance_percentage.toFixed(2)}%</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddCourseDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddCourse} />
    </div>
  )
}

