"use client"

import { Bar, Line } from "react-chartjs-2"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AttendanceStats } from "@/lib/types"

interface AnalyticsDashboardProps {
  stats: AttendanceStats
}

export default function AnalyticsDashboard({ stats }: AnalyticsDashboardProps) {
  const attendanceData = {
    labels: stats.courses.map((course) => course.course_code),
    datasets: [
      {
        label: "Attendance Percentage",
        data: stats.courses.map((course) => course.attendance_percentage),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  }

  const trendData = {
    labels: stats.trends.map((trend) => trend.date),
    datasets: [
      {
        label: "Overall Attendance",
        data: stats.trends.map((trend) => trend.percentage),
        fill: false,
        borderColor: "rgb(59, 130, 246)",
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">View detailed attendance statistics and trends</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Overall Attendance</CardTitle>
            <CardDescription>Across all courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.overall.toFixed(2)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Classes</CardTitle>
            <CardDescription>Classes conducted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalClasses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Classes Attended</CardTitle>
            <CardDescription>Total attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.classesAttended}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course-wise Attendance</CardTitle>
            <CardDescription>Attendance percentage for each course</CardDescription>
          </CardHeader>
          <CardContent>
            <Bar data={attendanceData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
            <CardDescription>Overall attendance trend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Line data={trendData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Statistics</CardTitle>
          <CardDescription>Course-wise attendance breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Course</th>
                  <th className="text-left p-2">Classes Conducted</th>
                  <th className="text-left p-2">Classes Attended</th>
                  <th className="text-left p-2">Attendance %</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.courses.map((course) => (
                  <tr key={course.course_code}>
                    <td className="p-2">{course.course_code}</td>
                    <td className="p-2">{course.total_classes}</td>
                    <td className="p-2">{course.classes_attended}</td>
                    <td className="p-2">{course.attendance_percentage.toFixed(2)}%</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          course.attendance_percentage >= 75 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {course.attendance_percentage >= 75 ? "Good" : "At Risk"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

