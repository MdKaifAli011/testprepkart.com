import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/posts - Get all posts with filtering
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const exam = searchParams.get('exam') || ''
    const classFilter = searchParams.get('class') || ''
    const author = searchParams.get('author') || ''
    
    const where: any = {}
    
    if (search) {
      where.or = [
        { title: { contains: search } },
        { author: { contains: search } },
      ]
    }
    
    if (exam) {
      where.exam = { equals: exam }
    }
    
    if (classFilter) {
      where.class = { contains: classFilter }
    }
    
    if (author) {
      where.author = { contains: author }
    }
    
    const result = await payload.find({
      collection: 'post',
      where,
      page,
      limit,
      sort: '-publishedDate',
    })
    
    return NextResponse.json({
      success: true,
      data: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    
    const post = await payload.create({
      collection: 'post',
      data: body,
    })
    
    return NextResponse.json({
      success: true,
      data: post,
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
