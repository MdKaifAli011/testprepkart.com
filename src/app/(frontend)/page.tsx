import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'TestPrepKart | JEE, NEET, SAT & Competitive Exam Preparation',
  description:
    'TestPrepKart - Your comprehensive platform for JEE, NEET, SAT, and other competitive exam preparation. Expert faculty, quality courses, and proven success rates.',
  keywords:
    'test preparation, JEE, NEET, SAT, competitive exams, online courses, exam coaching, study materials',
  openGraph: {
    title: 'TestPrepKart | Ace Your Competitive Exams',
    description: 'Comprehensive exam preparation platform with expert guidance',
    type: 'website',
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

export default async function HomePage() {
  const payload = await getPayload({ config })

  // Fetch featured courses with error handling
  let coursesResponse
  let jeeBlogs
  let neetBlogs

  try {
    ;[coursesResponse, jeeBlogs, neetBlogs] = await Promise.all([
      payload.find({
        collection: 'courses',
        limit: 6,
        sort: '-createdAt',
        depth: 1, // Include related data
      }),
      payload.find({
        collection: 'Jeeblogs',
        limit: 3,
        where: { status: { equals: 'published' } },
        sort: '-createdAt',
      }),
      payload.find({
        collection: 'Neetblogs',
        limit: 3,
        where: { status: { equals: 'published' } },
        sort: '-createdAt',
      }),
    ])
  } catch (error) {
    console.error('Error fetching homepage data:', error)
    // Set default empty responses
    coursesResponse = { docs: [], totalDocs: 0, totalPages: 0, page: 1 }
    jeeBlogs = { docs: [], totalDocs: 0, totalPages: 0, page: 1 }
    neetBlogs = { docs: [], totalDocs: 0, totalPages: 0, page: 1 }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to TestPrepKart</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Your comprehensive platform for JEE, NEET, SAT, and other competitive exam preparation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg"
              >
                Explore Courses
              </Link>
              <Link
                href="/blogs"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Read Blogs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600">{coursesResponse.totalDocs}+</div>
              <div className="text-gray-600 mt-2">Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600">500+</div>
              <div className="text-gray-600 mt-2">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600">50+</div>
              <div className="text-gray-600 mt-2">Expert Faculty</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600">95%</div>
              <div className="text-gray-600 mt-2">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 gradient-text">Featured Courses</h2>
            <p className="text-gray-600 text-lg">
              Discover our most popular courses designed to help you succeed
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coursesResponse.docs.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden card-hover"
              >
                <div className="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500">
                  {getImageUrl(course.course_image) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={getImageUrl(course.course_image)!}
                      alt={course.course_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                      {course.course_name.charAt(0)}
                    </div>
                  )}
                  {course.course_type && (
                    <span className="absolute top-4 right-4 bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                      {course.course_type}
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
                  <div className="flex items-center justify-between">
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
                    {course.price && (
                      <div className="text-blue-600 font-bold text-lg">₹{course.price}</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/courses"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Sections */}
      {jeeBlogs.totalDocs > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold gradient-text">JEE Preparation Blogs</h2>
                <p className="text-gray-600 mt-2">Latest insights and tips for JEE aspirants</p>
              </div>
              <Link href="/blogs/jee" className="text-blue-600 hover:text-blue-700 font-semibold">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {jeeBlogs.docs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/jee/${blog.id}`}
                  className="bg-gray-50 rounded-xl overflow-hidden card-hover"
                >
                  <div className="p-6">
                    <div className="text-sm text-blue-600 font-semibold mb-2">JEE</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{blog.author}</span>
                      {blog.readTime && <span>{blog.readTime} min read</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {neetBlogs.totalDocs > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold gradient-text">NEET Preparation Blogs</h2>
                <p className="text-gray-600 mt-2">Expert guidance for medical entrance exams</p>
              </div>
              <Link href="/blogs/neet" className="text-blue-600 hover:text-blue-700 font-semibold">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {neetBlogs.docs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/neet/${blog.id}`}
                  className="bg-white rounded-xl overflow-hidden card-hover"
                >
                  <div className="p-6">
                    <div className="text-sm text-purple-600 font-semibold mb-2">NEET</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{blog.author}</span>
                      {blog.readTime && <span>{blog.readTime} min read</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students who are achieving their dreams
          </p>
          <Link
            href="/courses"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}
