import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export default async function JeeBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const payload = await getPayload({ config })
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const limit = 12

  const blogsResponse = await payload.find({
    collection: 'Jeeblogs',
    limit,
    page,
    where: { status: { equals: 'published' } },
    sort: '-createdAt',
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-sm mb-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/blogs" className="text-blue-600 hover:text-blue-700">
              Blogs
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">JEE</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">JEE Preparation Blogs</h1>
          <p className="text-gray-600 text-lg">Expert guidance and tips for JEE aspirants</p>
        </div>

        {/* Blog Grid */}
        {blogsResponse.totalDocs === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No blogs found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogsResponse.docs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/jee/${blog.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden card-hover"
                >
                  {typeof blog.featuredImage === 'object' && blog.featuredImage?.url && (
                    <div className="h-48 overflow-hidden">
                      <Image
                        src={blog.featuredImage.url}
                        alt={blog.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        JEE
                      </span>
                      {blog.publishedAt && (
                        <span className="text-xs text-gray-500">
                          {new Date(blog.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 font-medium">{blog.author}</span>
                      <div className="flex items-center gap-3 text-gray-500">
                        {blog.readTime && <span>{blog.readTime} min read</span>}
                        {blog.views !== undefined && <span>{blog.views} views</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {blogsResponse.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/blogs/jee?page=${page - 1}`}
                    className="px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: blogsResponse.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/blogs/jee?page=${pageNum}`}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pageNum === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  ),
                )}
                {page < blogsResponse.totalPages && (
                  <Link
                    href={`/blogs/jee?page=${page + 1}`}
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
