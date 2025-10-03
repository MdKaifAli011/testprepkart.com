import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

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

export default async function JeeBlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })

  const blog = await payload.findByID({
    collection: 'Jeeblogs',
    id: id,
  })

  if (!blog) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner - Similar to the image */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='5' y='20' fill='white' font-family='Arial' font-size='14'>x+y=z%3C/text%3E%3Ctext x='10' y='40' fill='white' font-family='Arial' font-size='12'>α²+β²%3C/text%3E%3C/svg%3E\")",
              backgroundRepeat: 'repeat',
            }}
          ></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          <Link href="/" className="inline-block">
            <div className="text-white text-2xl font-bold">TestPrepKart</div>
          </Link>
        </div>
      </div>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight">
          {blog.title}
        </h1>

        {/* Intro/Excerpt */}
        {blog.excerpt && (
          <div className="mb-8 text-gray-700 text-base leading-relaxed">{blog.excerpt}</div>
        )}

        {/* Featured Image */}
        {typeof blog.featuredImage === 'object' && blog.featuredImage?.url && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <Image
              src={blog.featuredImage.url}
              alt={blog.title}
              width={800}
              height={400}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {blog.description && (
            <div
              className="text-gray-800 leading-relaxed"
              style={{ fontSize: '16px', lineHeight: '1.8' }}
              dangerouslySetInnerHTML={{
                __html:
                  (blog as unknown as Record<string, unknown>).descriptionHtml ||
                  lexicalToHtml(blog.description) ||
                  (typeof blog.description === 'string' ? blog.description : ''),
              }}
            />
          )}
        </div>

        {/* Social Share & Stats Bar */}
        <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 mb-8">
          <div className="flex items-center gap-4">
            {blog.views !== undefined && (
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span className="text-sm">{blog.views} Views</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Share on Facebook"
            >
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Share on Twitter"
            >
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Share on LinkedIn"
            >
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Share via Email"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Post a Comment Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Post a Comment</h2>
          <p className="text-sm text-gray-600 mb-6">
            Your email address will not be published. Required fields are marked *
          </p>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Leave a Reply *
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Write your comment here..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Submit Comment
            </button>
          </form>
        </div>

        {/* Comments Display Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>

          {/* Sample Comment - You can map through actual comments from database */}
          <div className="space-y-6">
            <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {blog.author.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900">{blog.author}</h4>
                  <span className="text-sm text-gray-500">
                    {blog.publishedAt
                      ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Recently'}
                  </span>
                </div>
                <p className="text-gray-700">
                  Great article! Very informative and helpful for JEE preparation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tags/Keywords */}
        {blog.keywords && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.keywords.split(',').map((keyword, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Posts Section */}
      <div className="bg-gray-50 border-t py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">More JEE Articles</h2>
          <div className="text-center">
            <Link
              href="/blogs/jee"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All JEE Blogs
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
