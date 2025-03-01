"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { addCourse } from "@/lib/courses"
import type { Course } from "@/lib/types"

interface AddCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (newCourse: Course) => void
}

export const AddCourseDialog = ({ open, onOpenChange, onAdd }: AddCourseDialogProps) => {
  const [formData, setFormData] = useState({
    course_code: "",
    course_title: "",
    category: "",
    faculty: "",
    slot: "",
    attendance_percentage: 0,
    total_classes: 0,
    classes_attended: 0,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newCourse: Omit<Course, "id"> = {
        ...formData,
        user_id: "", // This will be added in the backend
      }

      const { data, error } = await addCourse(newCourse)

      if (error) {
        throw new Error("Failed to add course")
      }

      onAdd(data[0])
      onOpenChange(false)
      toast({ title: "Course added", description: "Course added successfully" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Course</DialogTitle>
          <DialogDescription>Add a new course to your list</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="course_code">Course Code</Label>
                  <Input
                    id="course_code"
                    name="course_code"
                    type="text"
                    value={formData.course_code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="course_title">Course Title</Label>
                  <Input
                    id="course_title"
                    name="course_title"
                    type="text"
                    value={formData.course_title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" type="text" value={formData.category} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="faculty">Faculty</Label>
                  <Input id="faculty" name="faculty" type="text" value={formData.faculty} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="slot">Slot</Label>
                  <Input id="slot" name="slot" type="text" value={formData.slot} onChange={handleChange} />
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

