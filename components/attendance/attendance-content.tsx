"use client"

import { useState } from "react"
import type { User, AttendanceRecord } from "@/lib/types"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AttendanceContentProps {
  user: User
  attendanceRecords: AttendanceRecord[]
}

export default function AttendanceContent({ user, attendanceRecords }: AttendanceContentProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAddCourse = () => {
    router.push("/attendance/add")
  }

  const handleDeleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this attendance record?")) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/attendance/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete attendance record")
      }

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete attendance record")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Attendance Records</h1>
        <button onClick={handleAddCourse} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add New Course
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Your Courses</h2>
        </div>
        {attendanceRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Faculty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours Conducted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours Absent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{record.course_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.course_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.faculty}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.slot}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.hours_conducted}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.hours_absent}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.attendance_percentage >= 75 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.attendance_percentage.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Link href={`/attendance/edit/${record.id}`} className="text-blue-600 hover:text-blue-900">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteRecord(record.id!)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900 disabled:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No attendance records found. Add your first course to get started.</p>
            <button
              onClick={handleAddCourse}
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Course
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

