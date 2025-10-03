import { notFound } from 'next/navigation'
import { MongoClient, ObjectId } from 'mongodb'
import Image from 'next/image'

// MongoDB connection
const MONGODB_URI = process.env.DATABASE_URI || 'mongodb://127.0.0.1/Demo_testprepkart_backend'

// Function to validate image URLs
function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }

  // Check if it's a valid URL (starts with http/https) or a data URL
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || url.startsWith('data:')
  } catch {
    // If it's not a valid URL, it might be a relative path or filename
    // For now, we'll treat filenames as invalid URLs to show fallback
    return false
  }
}

// Types for richtext content
interface RichtextTextNode {
  type: 'text'
  text: string
  format?: number
  style?: string
  version?: number
  mode?: string
}

interface RichtextElementNode {
  type: string
  children: (RichtextTextNode | RichtextElementNode)[]
  format?: string
  indent?: number
  version?: number
  direction?: string
}

interface RichtextRoot {
  type: 'root'
  children: RichtextElementNode[]
  format?: string
  indent?: number
  version?: number
  direction?: string
}

interface RichtextContent {
  root: RichtextRoot
}

// Function to extract text from richtext nodes
function extractTextFromRichtext(richtextNode: RichtextElementNode | RichtextTextNode): string {
  if (!richtextNode) {
    return ''
  }

  if ('text' in richtextNode) {
    return richtextNode.text
  }

  if (!richtextNode.children) {
    return ''
  }

  let text = ''
  for (const child of richtextNode.children) {
    text += extractTextFromRichtext(child)
  }
  return text
}

// Function to render richtext content
function renderRichtextContent(content: RichtextContent) {
  if (!content || !content.root || !content.root.children) {
    return <p className="text-gray-500">No content available</p>
  }

  return (
    <div className="prose prose-lg max-w-none text-gray-800">
      {content.root.children.map((node: RichtextElementNode, index: number) => {
        if (node.type === 'paragraph') {
          const text = extractTextFromRichtext(node)
          return (
            <p key={index} className="mb-4 leading-relaxed">
              {text}
            </p>
          )
        }
        return null
      })}
    </div>
  )
}

// Function to render list content
function renderListContent(items: { text: string }[], ordered: boolean) {
  const ListComponent = ordered ? 'ol' : 'ul'
  const listClass = ordered ? 'list-decimal list-inside' : 'list-disc list-inside'

  return (
    <ListComponent className={`${listClass} mb-4 space-y-2 text-gray-800`}>
      {items.map((item, index) => (
        <li key={index} className="leading-relaxed">
          {item.text}
        </li>
      ))}
    </ListComponent>
  )
}

// Block types
interface RichTextBlock {
  blockType: 'richText'
  content: RichtextContent
}

interface ListBlock {
  blockType: 'list'
  items: { text: string }[]
  ordered: boolean
}

type ContentBlock = RichTextBlock | ListBlock

// Function to render a single block
function renderBlock(block: ContentBlock, index: number) {
  switch (block.blockType) {
    case 'richText':
      return (
        <div key={index} className="mb-6">
          {renderRichtextContent(block.content)}
        </div>
      )
    case 'list':
      return (
        <div key={index} className="mb-6">
          {renderListContent(block.items, block.ordered)}
        </div>
      )
    default:
      return (
        <div key={index} className="mb-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            Unknown block type: {(block as { blockType: string }).blockType}
          </p>
        </div>
      )
  }
}

interface Course {
  _id: string
  course_name: string
  course_short_description?: string
  description: ContentBlock[]
  price?: number
  rating?: number
  review?: number
  duration?: string
  student_count?: number
  course_type?: string
  course_level?: string
  faculty_name?: string
  faculty_image?: string
  course_image?: string
  course_video?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
}

async function getCourse(id: string): Promise<Course | null> {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db()
    const course = await db.collection('courses').findOne({ _id: new ObjectId(id) })

    if (!course) {
      return null
    }

    return {
      _id: course._id.toString(),
      course_name: course.course_name,
      course_short_description: course.course_short_description,
      description: course.description || [],
      price: course.price,
      rating: course.rating,
      review: course.review,
      duration: course.duration,
      student_count: course.student_count,
      course_type: course.course_type,
      course_level: course.course_level,
      faculty_name: course.faculty_name,
      faculty_image: course.faculty_image,
      course_image: course.course_image,
      course_video: course.course_video,
      seo_title: course.seo_title,
      seo_description: course.seo_description,
      seo_keywords: course.seo_keywords,
    }
  } catch (error) {
    console.error('Error fetching course:', error)
    return null
  } finally {
    await client.close()
  }
}

interface PreviewPageProps {
  params: {
    id: string
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const course = await getCourse(params.id)

  if (!course) {
    notFound()
  }

  const richTextBlocks = course.description.filter((block) => block.blockType === 'richText').length
  const listBlocks = course.description.filter((block) => block.blockType === 'list').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course Preview</h1>
              <p className="text-gray-600 mt-1">Preview of course content and structure</p>
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              ID: {params.id}
            </div>
          </div>
        </div>
      </div>

      {/* Course Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{course.course_name}</h2>
              {course.course_short_description && (
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {course.course_short_description}
                </p>
              )}

              <div className="space-y-3 text-sm">
                {course.duration && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-24">Duration:</span>
                    <span className="text-gray-600">{course.duration}</span>
                  </div>
                )}
                {course.course_type && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-24">Type:</span>
                    <span className="text-gray-600 capitalize">{course.course_type}</span>
                  </div>
                )}
                {course.course_level && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-24">Level:</span>
                    <span className="text-gray-600">{course.course_level}</span>
                  </div>
                )}
                {course.price && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-24">Price:</span>
                    <span className="text-gray-600 font-semibold">₹{course.price}</span>
                  </div>
                )}
                {course.rating && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-24">Rating:</span>
                    <span className="text-gray-600">{course.rating}/5 ⭐</span>
                  </div>
                )}
                {course.student_count && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-24">Students:</span>
                    <span className="text-gray-600">{course.student_count.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              {course.course_image && (
                <div className="mb-4">
                  {isValidImageUrl(course.course_image) ? (
                    <Image
                      src={course.course_image}
                      alt={course.course_name}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl text-gray-400 mb-2">📚</div>
                        <p className="text-sm text-gray-500">Course Image</p>
                        <p className="text-xs text-gray-400 mt-1">{course.course_image}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {course.faculty_name && (
                <div className="flex items-center space-x-3">
                  {course.faculty_image ? (
                    isValidImageUrl(course.faculty_image) ? (
                      <Image
                        src={course.faculty_image}
                        alt={course.faculty_name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-lg">👨‍🏫</span>
                      </div>
                    )
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-lg">👨‍🏫</span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{course.faculty_name}</p>
                    <p className="text-sm text-gray-600">Faculty</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Statistics */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">{course.description.length}</div>
              <div className="text-sm text-gray-700">Total Blocks</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="text-2xl font-bold text-green-600">{richTextBlocks}</div>
              <div className="text-sm text-gray-700">Rich Text Blocks</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="text-2xl font-bold text-purple-600">{listBlocks}</div>
              <div className="text-sm text-gray-700">List Blocks</div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Course Description</h3>

          <div className="space-y-6">
            {course.description.map((block, index) => renderBlock(block, index))}
          </div>
        </div>

        {/* SEO Information */}
        {(course.seo_title || course.seo_description || course.seo_keywords) && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Information</h3>
            <div className="space-y-3 text-sm">
              {course.seo_title && (
                <div>
                  <span className="font-medium text-gray-700">Title:</span>
                  <p className="text-gray-600 mt-1">{course.seo_title}</p>
                </div>
              )}
              {course.seo_description && (
                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="text-gray-600 mt-1">{course.seo_description}</p>
                </div>
              )}
              {course.seo_keywords && (
                <div>
                  <span className="font-medium text-gray-700">Keywords:</span>
                  <p className="text-gray-600 mt-1">{course.seo_keywords}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PreviewPageProps) {
  const course = await getCourse(params.id)

  if (!course) {
    return {
      title: 'Course Not Found',
    }
  }

  return {
    title: `Preview: ${course.course_name}`,
    description: course.course_short_description || course.seo_description,
  }
}
