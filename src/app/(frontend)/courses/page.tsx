import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'All Courses | TestPrepKart - JEE, NEET, SAT & More',
  description:
    'Browse our comprehensive collection of courses for JEE, NEET, SAT, and other competitive exams. Expert instructors, quality content, and proven results.',
  keywords:
    'online courses, JEE preparation, NEET courses, SAT coaching, competitive exam preparation',
  openGraph: {
    title: 'All Courses | TestPrepKart',
    description: 'Browse our comprehensive collection of exam preparation courses',
  },
}

// Helper to get proper image URL
function getImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null

  // If it's already a full URL (http:// or https://), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  // If it starts with /, it's an absolute path from the domain
  if (imageUrl.startsWith('/')) {
    return imageUrl
  }

  // Otherwise, it's a relative path - return null to avoid 404s
  return null
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string }
}) {
  const payload = await getPayload({ config })
  const page = Number(searchParams.page) || 1
  const limit = 12

  // Build where clause
  const where: any = {}
  if (searchParams.category) {
    where.category = { equals: searchParams.category }
  }

  let coursesResponse
  let categoriesResponse

  try {
    ;[coursesResponse, categoriesResponse] = await Promise.all([
      payload.find({
        collection: 'courses',
        limit,
        page,
        where,
        sort: '-createdAt',
        depth: 1, // Include category data
      }),
      payload.find({
        collection: 'exam_categories',
        limit: 100,
        sort: 'categoryName',
      }),
    ])
  } catch (error) {
    console.error('Error fetching courses:', error)
    // Set default empty responses
    coursesResponse = { docs: [], totalDocs: 0, totalPages: 0, page: 1 }
    categoriesResponse = { docs: [], totalDocs: 0, totalPages: 0, page: 1 }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">All Courses</h1>
          <p className="text-gray-600 text-lg">Explore our comprehensive collection of courses</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Link
            href="/courses"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !searchParams.category
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Categories
          </Link>
          {categoriesResponse.docs.map((category) => (
            <Link
              key={category.id}
              href={`/courses?category=${category.id}`}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchParams.category === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.categoryName}
            </Link>
          ))}
        </div>

        {/* Course Grid */}
        {coursesResponse.totalDocs === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No courses found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {coursesResponse.docs.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden card-hover"
                >
                  <div className="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500">
                    {getImageUrl(course.course_image) ? (
                      <img
                        src={getImageUrl(course.course_image)!}
                        alt={course.course_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                        {course.course_name.charAt(0)}
                      </div>
                    )}
                    {course.course_type && (
                      <span className="absolute top-4 right-4 bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                        {course.course_type}
                      </span>
                    )}
                    {course.course_level && (
                      <span className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Level {course.course_level}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">
                      {course.course_name}
                    </h3>
                    {course.course_short_description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.course_short_description}
                      </p>
                    )}
                    <div className="space-y-2 mb-4">
                      {course.duration && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
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
                      {course.faculty_name && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          {course.faculty_name}
                        </div>
                      )}
                      {course.student_count && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          {course.student_count} students
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        {course.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="font-semibold">{course.rating}</span>
                            {course.review && (
                              <span className="text-gray-500 text-sm">({course.review})</span>
                            )}
                          </div>
                        )}
                      </div>
                      {course.price ? (
                        <div className="text-blue-600 font-bold text-lg">₹{course.price}</div>
                      ) : (
                        <div className="text-green-600 font-bold text-lg">Free</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {coursesResponse.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/courses?page=${page - 1}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
                    className="px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: coursesResponse.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/courses?page=${pageNum}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pageNum === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  ),
                )}
                {page < coursesResponse.totalPages && (
                  <Link
                    href={`/courses?page=${page + 1}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
                    className="px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
