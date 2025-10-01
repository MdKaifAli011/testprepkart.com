'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Pagination from './Pagination'

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

interface CoursesListProps {
  initialCourses: Course[]
  initialTotalPages: number
  initialCurrentPage: number
  initialTotalCourses: number
}

const CourseCard = ({ course }: { course: Course }) => {
  const getCategoryName = (category: CourseCategory | string | undefined) => {
    if (typeof category === 'object' && category?.menuName) {
      return category.menuName
    }
    if (typeof category === 'string') {
      return category
    }
    return 'General'
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case '1':
        return 'Beginner'
      case '2':
        return 'Intermediate'
      case '3':
        return 'Advanced'
      default:
        return 'All Levels'
    }
  }

  const cleanDescription = (description: unknown): string => {
    if (!description)
      return 'Learn new skills and advance your career with this comprehensive course.'

    if (typeof description === 'string') {
      // Remove HTML tags and clean up the text
      let cleanText = description
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
        .replace(/&amp;/g, '&') // Replace HTML entities
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim()

      // Limit to 120 characters and add ellipsis if truncated
      if (cleanText.length > 120) {
        cleanText = cleanText.substring(0, 120) + '...'
      }

      return cleanText
    }

    // Handle Lexical editor format
    if (typeof description === 'object' && description !== null) {
      const lexicalData = description as Record<string, unknown>
      if (lexicalData.root && typeof lexicalData.root === 'object' && lexicalData.root !== null) {
        const root = lexicalData.root as Record<string, unknown>
        if (root.children && Array.isArray(root.children)) {
          let text = ''
          const extractText = (node: Record<string, unknown>) => {
            if (typeof node.text === 'string') {
              text += node.text
            }
            if (node.children && Array.isArray(node.children)) {
              node.children.forEach(extractText)
            }
          }
          root.children.forEach(extractText)

          let cleanText = text.trim()
          if (cleanText.length > 120) {
            cleanText = cleanText.substring(0, 120) + '...'
          }
          return cleanText
        }
      }
    }

    return 'Learn new skills and advance your career with this comprehensive course.'
  }

  return (
    <div className="course-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative course-card-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.course_image || '/images/default-course.jpg'}
          alt={course.course_name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-semibold shadow-md">
            {course.course_type || 'Online'}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="badge badge-primary">{getCategoryName(course.category)}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <span className="badge badge-secondary">{getLevelLabel(course.course_level || '')}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {course.course_name}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {course.course_short_description || cleanDescription(course.description)}
        </p>

        {course.rating && (
          <div className="flex items-center mb-4">
            <div className="flex items-center star-rating">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(Math.min(5.0, course.rating || 0)) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-900 ml-2">
              {course.rating ? Math.min(5.0, course.rating).toFixed(1) : '0.0'}
            </span>
            {course.review && (
              <span className="text-sm text-gray-500 ml-1">({course.review} reviews)</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          {course.duration && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {course.duration}
            </div>
          )}
          {course.student_count && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {course.student_count.toLocaleString()} students
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            {course.price ? `$${course.price}` : 'Free'}
          </div>
          <Link
            href={`/courses/${course.id}`}
            className="btn-primary text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden pulse-animation">
    <div className="skeleton h-48 w-full"></div>
    <div className="p-6">
      <div className="skeleton h-4 w-20 rounded mb-3"></div>
      <div className="skeleton h-6 w-full rounded mb-3"></div>
      <div className="skeleton h-4 w-3/4 rounded mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="skeleton h-6 w-16 rounded"></div>
        <div className="skeleton h-8 w-24 rounded"></div>
      </div>
    </div>
  </div>
)

export default function CoursesList({
  initialCourses,
  initialTotalPages,
  initialCurrentPage,
  initialTotalCourses,
}: CoursesListProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [currentPage, setCurrentPage] = useState(initialCurrentPage)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [totalCourses, setTotalCourses] = useState(initialTotalCourses)
  const [isLoading, setIsLoading] = useState(false)

  const handlePageChange = async (page: number) => {
    if (page === currentPage || isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/courses?page=${page}&limit=12`)
      const data = await response.json()

      setCourses(data.courses)
      setCurrentPage(page)
      setTotalPages(data.totalPages)
      setTotalCourses(data.totalCourses)

      // Scroll to top of courses section
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-transition">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="stat-card">
          <div className="text-4xl font-bold text-blue-600 mb-2">{totalCourses}+</div>
          <div className="text-gray-600 font-medium">Total Courses</div>
        </div>
        <div className="stat-card">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {courses.reduce((sum, course) => sum + (course.student_count || 0), 0).toLocaleString()}
            +
          </div>
          <div className="text-gray-600 font-medium">Students Enrolled</div>
        </div>
        <div className="stat-card">
          <div className="text-4xl font-bold text-yellow-600 mb-2">
            {courses.length > 0
              ? Math.min(
                  5.0,
                  courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length,
                ).toFixed(1)
              : '0.0'}
          </div>
          <div className="text-gray-600 font-medium">Average Rating</div>
        </div>
        <div className="stat-card">
          <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
          <div className="text-gray-600 font-medium">Success Rate</div>
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Available</h3>
            <p className="text-gray-600">Check back later for new courses!</p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
