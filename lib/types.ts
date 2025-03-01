export interface User {
  id: string
  email: string
  registration_number?: string
  name?: string
  phone?: string
  created_at?: string
}

export interface Course {
  id: string
  user_id: string
  course_code: string
  course_title: string
  category: string
  faculty: string
  slot: string
  attendance_percentage: number
  total_classes: number
  classes_attended: number
  created_at?: string
}

export interface AttendanceRecord {
  id?: string
  user_id: string
  course_id: string
  date: string
  status: "present" | "absent"
  created_at?: string
}

export interface AttendanceStats {
  overall: number
  totalClasses: number
  classesAttended: number
  courses: Array<{
    course_code: string
    total_classes: number
    classes_attended: number
    attendance_percentage: number
  }>
  trends: Array<{
    date: string
    percentage: number
  }>
}

export interface AuthResponse {
  user: User | null
  error: Error | null
}

export interface CourseResponse {
  data: Course[] | null
  error: Error | null
}

export interface AttendanceResponse {
  data: AttendanceRecord[] | null
  error: Error | null
}

