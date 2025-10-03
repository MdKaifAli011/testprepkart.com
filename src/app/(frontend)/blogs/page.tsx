import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export default async function BlogsPage() {
  const payload = await getPayload({ config })

  // Fetch recent blogs from all categories
  const [jeeBlogs, neetBlogs, schoolBlogs, satBlogs, idBlogs, apBlogs] = await Promise.all([
    payload.find({
      collection: 'Jeeblogs',
      limit: 6,
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'Neetblogs',
      limit: 6,
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'schoolblogs',
      limit: 6,
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'satblogs',
      limit: 6,
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'idblogs',
      limit: 6,
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'apblogs',
      limit: 6,
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
    }),
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Educational Blogs</h1>
          <p className="text-gray-600 text-lg">
            Expert insights, tips, and guidance for your exam preparation
          </p>
        </div>

        {/* Blog Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          <Link
            href="/blogs/jee"
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-lg transition-all card-hover text-center"
          >
            <div className="text-3xl mb-2">🎓</div>
            <h3 className="font-bold">JEE</h3>
            <p className="text-sm text-blue-100 mt-1">{jeeBlogs.totalDocs} posts</p>
          </Link>
          <Link
            href="/blogs/neet"
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:shadow-lg transition-all card-hover text-center"
          >
            <div className="text-3xl mb-2">⚕️</div>
            <h3 className="font-bold">NEET</h3>
            <p className="text-sm text-purple-100 mt-1">{neetBlogs.totalDocs} posts</p>
          </Link>
          <Link
            href="/blogs/school"
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl hover:shadow-lg transition-all card-hover text-center"
          >
            <div className="text-3xl mb-2">🏫</div>
            <h3 className="font-bold">School</h3>
            <p className="text-sm text-green-100 mt-1">{schoolBlogs.totalDocs} posts</p>
          </Link>
          <Link
            href="/blogs/sat"
            className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl hover:shadow-lg transition-all card-hover text-center"
          >
            <div className="text-3xl mb-2">🌍</div>
            <h3 className="font-bold">SAT</h3>
            <p className="text-sm text-orange-100 mt-1">{satBlogs.totalDocs} posts</p>
          </Link>
          <Link
            href="/blogs/ib"
            className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl hover:shadow-lg transition-all card-hover text-center"
          >
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-bold">IB</h3>
            <p className="text-sm text-pink-100 mt-1">{idBlogs.totalDocs} posts</p>
          </Link>
          <Link
            href="/blogs/ap"
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-xl hover:shadow-lg transition-all card-hover text-center"
          >
            <div className="text-3xl mb-2">📖</div>
            <h3 className="font-bold">AP</h3>
            <p className="text-sm text-indigo-100 mt-1">{apBlogs.totalDocs} posts</p>
          </Link>
        </div>

        {/* Featured Blogs from Each Category */}
        {jeeBlogs.totalDocs > 0 && (
          <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">JEE Preparation</h2>
              <Link href="/blogs/jee" className="text-blue-600 hover:text-blue-700 font-semibold">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {jeeBlogs.docs.slice(0, 3).map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/jee/${blog.id}`}
                  className="bg-white rounded-xl p-6 shadow-md card-hover"
                >
                  <div className="text-sm text-blue-600 font-semibold mb-2">JEE</div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{blog.title}</h3>
                  {blog.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{blog.author}</span>
                    {blog.readTime && <span>{blog.readTime} min</span>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {neetBlogs.totalDocs > 0 && (
          <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">NEET Preparation</h2>
              <Link
                href="/blogs/neet"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {neetBlogs.docs.slice(0, 3).map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/neet/${blog.id}`}
                  className="bg-white rounded-xl p-6 shadow-md card-hover"
                >
                  <div className="text-sm text-purple-600 font-semibold mb-2">NEET</div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{blog.title}</h3>
                  {blog.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{blog.author}</span>
                    {blog.readTime && <span>{blog.readTime} min</span>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {satBlogs.totalDocs > 0 && (
          <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">SAT Preparation</h2>
              <Link
                href="/blogs/sat"
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {satBlogs.docs.slice(0, 3).map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/sat/${blog.id}`}
                  className="bg-white rounded-xl p-6 shadow-md card-hover"
                >
                  <div className="text-sm text-orange-600 font-semibold mb-2">SAT</div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{blog.title}</h3>
                  {blog.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{blog.author}</span>
                    {blog.readTime && <span>{blog.readTime} min</span>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

