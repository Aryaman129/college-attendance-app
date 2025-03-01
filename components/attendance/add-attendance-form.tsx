"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface AddAttendanceFormProps {
  userId: string
}

export default function AddAttendanceForm({ userId }: AddAttendanceFormProps) {
  const [formData, setFormData] = useState({
    course_code: "",
    course_title: "",
    category: "",
    faculty: "",
    slot: "",
    hours_conducted: 0,
    hours_absent: 0,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "hours_conducted" || name === "hours_absent" ? Number.parseInt(value) || 0 : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validate input
      if (!formData.course_code || !formData.course_title) {
        throw new Error("Course code and title are required")
      }

      if (formData.hours_conducted <= 0) {
        throw new Error("Hours conducted must be greater than 0")
      }

      if (formData.hours_absent < 0 || formData.hours_absent > formData.hours_conducted) {
        throw new Error("Hours absent must be between 0 and hours conducted")
      }

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          user_id: userId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add attendance record")
      }

      // Redirect to attendance page on success
      router.push("/attendance")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="course_code" className="block text-sm font-medium text-gray-700 mb-1">
              Course Code*
            </label>
            <input
              id="course_code"
              name="course_code"
              type="text"
              value={formData.course_code}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="course_title" className="block text-sm font-medium text-gray-700 mb-1">
              Course Title*
            </label>
            <input
              id="course_title"
              name="course_title"
              type="text"
              value={formData.course_title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-1">
              Faculty
            </label>
            <input
              id="faculty"
              name="faculty"
              type="text"
              value={formData.faculty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="slot" className="block text-sm font-medium text-gray-700 mb-1">
              Slot
            </label>
            <input
              id="slot"
              name="slot"
              type="text"
              value={formData.slot}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="hours_conducted" className="block text-sm font-medium text-gray-700 mb-1">
              Hours Conducted*
            </label>
            <input
              id="hours_conducted"
              name="hours_conducted"
              type="number"
              min="1"
              value={formData.hours_conducted}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="hours_absent" className="block text-sm font-medium text-gray-700 mb-1">
              Hours Absent
            </label>
            <input
              id="hours_absent"
              name="hours_absent"
              type="number"
              min="0"
              max={formData.hours_conducted}
              value={formData.hours_absent}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Adding..." : "Add Course"}
          </button>
        </div>
      </form>
    </div>
  )
}

