import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import type { ExamCategory } from '@/payload-types'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  try {
    const { id } = await params
    const payload = await getPayload({ config })
    const course = await payload.findByID({
      collection: 'courses',
      id: id,
    })

    if (!course) {
      return {
        title: 'Course Not Found',
        description: 'The requested course could not be found.',
      }
    }

    return {
      title: course.seo_title || `${course.course_name} | TestPrepKart`,
      description: course.seo_description || course.course_short_description || course.course_name,
      keywords: course.seo_keywords || course.course_name,
      openGraph: {
        title: course.seo_title || course.course_name,
        description: course.seo_description || course.course_short_description || '',
        images: course.course_image ? [{ url: course.course_image }] : [],
      },
    }
  } catch (_error) {
    return {
      title: 'Course | TestPrepKart',
      description: 'View course details',
    }
  }
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

  // Otherwise, it's a relative path - add /uploads/ or appropriate base path
  // Return null to avoid broken images for now
  return null
}

// Lexical JSON types
interface LexicalNode {
  type?: string
  text?: string | LexicalRoot | { root?: { children?: LexicalNode[] } }
  tag?: string
  format?: number
  children?: LexicalNode[]
  listType?: string
  direction?: string
  indent?: number
  version?: number
}

interface LexicalRoot {
  root?: {
    type?: string
    children?: LexicalNode[]
  }
}

// Convert Lexical JSON to HTML string
function lexicalToHtml(content: unknown): string {
  if (!content || typeof content !== 'object') return ''

  const lexical = content as LexicalRoot
  if (!lexical.root?.children) return ''

  return nodesToHtml(lexical.root.children)
}

function nodesToHtml(nodes: LexicalNode[]): string {
  return nodes
    .map((node) => {
      if (!node.type) return ''

      switch (node.type) {
        case 'paragraph':
          return `<p class="mb-4 text-gray-700 leading-relaxed">${textContentToHtml(node.children)}</p>`

        case 'heading':
          const tag = node.tag || 'h2'
          const headingClasses = {
            h1: 'text-3xl font-bold mb-4 mt-6 text-gray-900',
            h2: 'text-2xl font-bold mb-3 mt-5 text-gray-900',
            h3: 'text-xl font-bold mb-3 mt-4 text-gray-800',
            h4: 'text-lg font-bold mb-2 mt-3 text-gray-800',
            h5: 'text-base font-bold mb-2 mt-2 text-gray-800',
            h6: 'text-sm font-bold mb-2 mt-2 text-gray-800',
          }
          const className = headingClasses[tag as keyof typeof headingClasses] || headingClasses.h2
          return `<${tag} class="${className}">${textContentToHtml(node.children)}</${tag}>`

        case 'list':
          const listTag = node.listType === 'number' ? 'ol' : 'ul'
          const listClass = node.listType === 'number' ? 'list-decimal' : 'list-disc'
          const listItems = node.children
            ?.map((item) => `<li class="mb-2">${textContentToHtml(item.children)}</li>`)
            .join('')
          return `<${listTag} class="${listClass} ml-6 mb-4 text-gray-700">${listItems}</${listTag}>`

        case 'listitem':
          return `<li class="mb-2">${textContentToHtml(node.children)}</li>`

        case 'text':
          return formatTextToHtml(node)

        default:
          return ''
      }
    })
    .join('')
}

function textContentToHtml(children: LexicalNode[] | undefined): string {
  if (!children) return ''

  return children
    .map((child) => {
      if (child.type === 'text') {
        // Check if text field contains nested Lexical JSON
        if (child.text && typeof child.text === 'object') {
          const nestedLexical = child.text as LexicalRoot
          if (nestedLexical.root?.children) {
            return nodesToHtml(nestedLexical.root.children)
          }
        }
        return formatTextToHtml(child)
      }
      if (child.type === 'paragraph') {
        return textContentToHtml(child.children)
      }
      return nodesToHtml([child])
    })
    .join('')
}

function formatTextToHtml(node: LexicalNode): string {
  if (!node.text) return ''

  // If text is an object (nested Lexical), it's already handled above
  if (typeof node.text !== 'string') return ''

  const format = node.format || 0
  const isBold = (format & 1) !== 0
  const isItalic = (format & 2) !== 0
  const isUnderline = (format & 8) !== 0

  let text = node.text

  if (isUnderline) text = `<u>${text}</u>`
  if (isItalic) text = `<em>${text}</em>`
  if (isBold) text = `<strong>${text}</strong>`

  return text
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })

  let course
  try {
    course = await payload.findByID({
      collection: 'courses',
      id: id,
      depth: 2, // Fetch related category data
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    notFound()
  }

  if (!course) {
    notFound()
  }

  // Ensure category is populated
  const category =
    typeof course.category === 'object'
      ? course.category
      : course.category
        ? await payload
            .findByID({
              collection: 'exam_categories',
              id: course.category,
            })
            .catch(() => null)
        : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/courses" className="text-blue-600 hover:text-blue-700">
              Courses
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{course.course_name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Image/Video */}
            {getImageUrl(course.course_image) && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(course.course_image)!}
                  alt={course.course_name}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Course Title */}
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{course.course_name}</h1>

            {/* Course Meta */}
            <div className="flex flex-wrap gap-4 mb-6">
              {category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {(category as ExamCategory).categoryName}
                </span>
              )}
              {course.course_type && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {course.course_type}
                </span>
              )}
              {course.course_level && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Level {course.course_level}
                </span>
              )}
            </div>

            {/* Short Description */}
            {course.course_short_description && (
              <div
                className="text-lg text-gray-700 mb-8 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: course.course_short_description }}
              />
            )}

            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {course.rating && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-yellow-500 text-2xl mb-1">★</div>
                  <div className="text-2xl font-bold">{course.rating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              )}
              {course.student_count && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-blue-500 text-2xl mb-1">👥</div>
                  <div className="text-2xl font-bold">{course.student_count}</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
              )}
              {course.duration && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-purple-500 text-2xl mb-1">⏱️</div>
                  <div className="text-lg font-bold">{course.duration}</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
              )}
              {course.review && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-green-500 text-2xl mb-1">📝</div>
                  <div className="text-2xl font-bold">{course.review}</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
              )}
            </div>

            {/* Description */}
            {course.description && (
              <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Course Description</h2>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: lexicalToHtml(course.description) }}
                />
              </div>
            )}

            {/* Faculty Info */}
            {course.faculty_name && (
              <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Your Instructor</h2>
                <div className="flex items-center gap-4">
                  {getImageUrl(course.faculty_image) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={getImageUrl(course.faculty_image)!}
                      alt={course.faculty_name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                      {course.faculty_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{course.faculty_name}</h3>
                    <p className="text-gray-600">Expert Instructor</p>
                  </div>
                </div>
              </div>
            )}

            {/* Other Details */}
            {course.other_details && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Additional Details</h2>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: lexicalToHtml(course.other_details) }}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-4">
              {/* Price */}
              <div className="mb-6">
                {course.price ? (
                  <div className="text-4xl font-bold text-blue-600 mb-2">₹{course.price}</div>
                ) : (
                  <div className="text-4xl font-bold text-green-600 mb-2">Free</div>
                )}
                {course.start_date && (
                  <p className="text-gray-600">
                    Starts: {new Date(course.start_date).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 mb-6">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Enroll Now
                </button>
                <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                  Add to Wishlist
                </button>
              </div>

              {/* Course Features */}
              <div className="border-t pt-6">
                <h3 className="font-bold mb-4 text-gray-900">This course includes:</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Lifetime access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Expert support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Study materials</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
