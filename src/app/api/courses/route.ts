import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Where } from 'payload'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const type = searchParams.get('type')

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Build query conditions
    const where: Where = {}

    if (category && category !== 'all') {
      where.category = { equals: category }
    }

    if (level && level !== 'all') {
      where.course_level = { equals: level }
    }

    if (type && type !== 'all') {
      where.course_type = { equals: type }
    }

    // Fetch courses with pagination and populated relationships
    const result = await payload.find({
      collection: 'courses',
      where,
      limit,
      page,
      sort: '-createdAt',
      depth: 1, // This will populate the category relationship
    })

    return NextResponse.json({
      courses: result.docs,
      totalPages: result.totalPages,
      currentPage: page,
      totalCourses: result.totalDocs,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
