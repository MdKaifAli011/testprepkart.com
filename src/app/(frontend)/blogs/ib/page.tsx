import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export default async function IbBlogsPage({ searchParams }: { searchParams: { page?: string } }) {
  const payload = await getPayload({ config })
  const page = Number(searchParams.page) || 1

  const blogsResponse = await payload.find({
    collection: 'idblogs',
    limit: 12,
    page,
    where: { status: { equals: 'published' } },
    sort: '-createdAt',
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">IB Program Blogs</h1>
          <p className="text-gray-600 text-lg">
            International Baccalaureate guidance and resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogsResponse.docs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/ib/${blog.id}`}
              className="bg-white rounded-xl shadow-md p-6 card-hover"
            >
              <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-1 rounded">
                IB
              </span>
              <h3 className="text-xl font-bold mt-3 mb-2 line-clamp-2">{blog.title}</h3>
              {blog.excerpt && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
              )}
              <div className="text-sm text-gray-500">{blog.author}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

