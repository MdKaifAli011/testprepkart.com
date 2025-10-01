import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import CoursesList from '@/components/CoursesList'
import './styles.css'

// Force dynamic rendering to avoid build-time database connections
export const dynamic = 'force-dynamic'

interface CourseCategory {
  id: string
  menuName: string
}

interface Course {
  id: string
  course_name: string
  course_short_description?: string
  description?: unknown
  price?: number
  rating?: number
  review?: number
  duration?: string
  student_count?: number
  course_level?: string
  course_type?: string
  faculty_name?: string
  course_image?: string
  category?: CourseCategory | string
  createdAt?: string
  updatedAt?: string
}

export default async function CoursesPage() {
  // Initialize with empty data - will be populated by client-side fetching
  const courses: Course[] = []
  const totalPages = 0
  const totalCourses = 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 gradient-text">Our Courses</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover a wide range of courses designed to help you achieve your learning goals.
              From beginner to advanced levels, we have something for everyone.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Filter Section */}
        <div className="filter-section">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Courses</h3>
          <div className="flex flex-wrap gap-4">
            <select className="bg-white border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option>All Categories</option>
              <option>Web Development</option>
              <option>Data Science</option>
              <option>Marketing</option>
              <option>Design</option>
            </select>

            <select className="bg-white border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>

            <select className="bg-white border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option>All Types</option>
              <option>Online</option>
              <option>Offline</option>
              <option>Hybrid</option>
            </select>

            <button className="btn-primary text-white px-8 py-2 rounded-lg font-medium shadow-md hover:shadow-lg">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Courses List with Pagination */}
        <CoursesList
          initialCourses={courses}
          initialTotalPages={totalPages}
          initialCurrentPage={1}
          initialTotalCourses={totalCourses}
        />
      </div>
    </div>
  )
}
