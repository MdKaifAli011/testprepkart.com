'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface Course {
  id: string
  course_name: string
  course_short_description?: string
  description?: any
  price?: number
  rating?: number
  review?: number
  duration?: string
  student_count?: number
  course_level?: string
  course_type?: string
  faculty_name?: string
  faculty_image?: string
  course_image?: string
  course_video?: string
  start_date?: string
  other_details?: any
  category?: { menuName: string } | string
}

interface CourseDetailPageProps {
  params: Promise<{ id: string }>
}

// Removed unused extractText function

// Enhanced HTML renderer for Lexical data (for rich content display)
const renderLexicalContent = (data: any) => {
  if (!data) return <p>No content available</p>

  // Handle string data (HTML)
  if (typeof data === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: data }} />
  }

  // Handle Lexical editor data
  if (data.root && data.root.children) {
    const renderNode = (node: any, index: number): React.ReactNode => {
      if (!node) return null

      const key = `node-${index}`

      // Handle text nodes
      if (node.type === 'text') {
        const text = node.text || ''
        if (node.format) {
          let element = text
          if (node.format & 1) element = <strong key={key}>{element}</strong> // Bold
          if (node.format & 2) element = <em key={key}>{element}</em> // Italic
          if (node.format & 8) element = <u key={key}>{element}</u> // Underline
          return element
        }
        return text
      }

      // Handle paragraph nodes
      if (node.type === 'paragraph') {
        return (
          <p key={key} className="mb-4">
            {node.children?.map((child: any, childIndex: number) => renderNode(child, childIndex))}
          </p>
        )
      }

      // Handle heading nodes
      if (node.type === 'heading') {
        const headingLevel = node.tag || 2
        const HeadingComponent =
          headingLevel === 1
            ? 'h1'
            : headingLevel === 2
              ? 'h2'
              : headingLevel === 3
                ? 'h3'
                : headingLevel === 4
                  ? 'h4'
                  : headingLevel === 5
                    ? 'h5'
                    : 'h6'

        return React.createElement(
          HeadingComponent,
          {
            key: key,
            className: 'font-bold mb-2',
          },
          node.children?.map((child: any, childIndex: number) => renderNode(child, childIndex)),
        )
      }

      // Handle list nodes
      if (node.type === 'list') {
        const ListComponent = node.listType === 'number' ? 'ol' : 'ul'
        return React.createElement(
          ListComponent,
          {
            key: key,
            className: 'mb-4 ml-6',
          },
          node.children?.map((child: any, childIndex: number) => renderNode(child, childIndex)),
        )
      }

      // Handle list item nodes
      if (node.type === 'listitem') {
        return (
          <li key={key} className="mb-1">
            {node.children?.map((child: any, childIndex: number) => renderNode(child, childIndex))}
          </li>
        )
      }

      // Handle other nodes with children
      if (node.children && Array.isArray(node.children)) {
        return (
          <div key={key}>
            {node.children.map((child: any, childIndex: number) => renderNode(child, childIndex))}
          </div>
        )
      }

      return null
    }

    return (
      <div className="prose max-w-none">
        {data.root.children.map((node: any, index: number) => renderNode(node, index))}
      </div>
    )
  }

  return <p>No content available</p>
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [courseId, setCourseId] = useState<string | null>(null)

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params
      setCourseId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (!courseId) return

    async function fetchCourse() {
      try {
        const res = await fetch(`/api/course/${courseId}`)
        const data = await res.json()
        setCourse(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [courseId])

  if (loading) return <p>Loading...</p>
  if (!course) return <p>Course not found</p>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Breadcrumb */}
      <nav className="flex space-x-2 text-gray-500 mb-6">
        <Link href="/">Home</Link> / <Link href="/courses">Courses</Link> /{' '}
        <span className="font-semibold text-gray-900">{course.course_name}</span>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">{course.course_name}</h1>
          <p className="text-gray-700">{course.course_short_description}</p>
          <div>
            <h2 className="font-semibold text-xl mb-4">Description</h2>
            <div className="text-gray-700 leading-relaxed">
              {renderLexicalContent(course.description)}
            </div>
          </div>

          {course.other_details && (
            <div>
              <h2 className="font-semibold text-xl mb-4">Additional Details</h2>
              <div className="text-gray-700 leading-relaxed">
                {renderLexicalContent(course.other_details)}
              </div>
            </div>
          )}
          {course.course_video && (
            <div>
              <h2 className="font-semibold text-xl mb-2">Preview</h2>
              <div className="aspect-video">
                <iframe
                  src={course.course_video}
                  className="w-full h-full"
                  allowFullScreen
                  title="Preview"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded shadow text-center">
            <img
              src={course.course_image || '/images/default-course.jpg'}
              alt={course.course_name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <div className="text-2xl font-bold">{course.price ? `$${course.price}` : 'Free'}</div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded">Enroll Now</button>
          </div>

          {course.faculty_name && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Instructor</h3>
              <div className="flex items-center gap-2">
                <img
                  src={course.faculty_image || '/images/default-avatar.jpg'}
                  alt={course.faculty_name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold">{course.faculty_name}</div>
                  <div className="text-gray-500 text-sm">Senior Instructor</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
