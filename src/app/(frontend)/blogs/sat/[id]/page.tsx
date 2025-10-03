import React from 'react'
import Link from 'next/link'
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

export default async function SatBlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const blog = await payload.findByID({ collection: 'satblogs', id: id })

  if (!blog) notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/blogs" className="text-blue-600 hover:text-blue-700">
              Blogs
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/blogs/sat" className="text-orange-600 hover:text-orange-700">
              SAT
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 truncate">{blog.title}</span>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full mb-4">
            SAT
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{blog.title}</h1>
          {blog.excerpt && <p className="text-xl text-gray-600 mb-6">{blog.excerpt}</p>}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                {blog.author.charAt(0)}
              </div>
              <span className="font-medium">{blog.author}</span>
            </div>
            {blog.publishedAt && (
              <span>
                {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            {blog.readTime && <span>• {blog.readTime} min read</span>}
            {blog.views !== undefined && <span>• {blog.views} views</span>}
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-md p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
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
        </div>

        {blog.keywords && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.keywords.split(',').map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
