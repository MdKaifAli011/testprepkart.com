import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const exam = searchParams.get('exam')
    const infoType = searchParams.get('infoType')
    const difficulty = searchParams.get('difficulty')
    const isActive = searchParams.get('isActive')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    // Build query
    const query: any = {}
    
    // Add search
    if (search) {
      query.or = [
        { title: { contains: search } },
        { description: { contains: search } },
        { seo_title: { contains: search } },
        { seo_keyword: { contains: search } },
        { seo_description: { contains: search } }
      ]
    }

    // Add filters
    if (exam) {
      query.exam = { equals: exam }
    }
    if (infoType) {
      query.infoType = { equals: infoType }
    }
    if (difficulty) {
      query.difficulty = { equals: difficulty }
    }
    if (isActive !== null && isActive !== undefined) {
      query.isActive = { equals: isActive === 'true' }
    }

    // Add date filter
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.greater_than_equal = new Date(startDate)
      if (endDate) query.createdAt.less_than_equal = new Date(endDate)
    }

    const result = await payload.find({
      collection: 'exam-info',
      where: query,
      page,
      limit,
      sort: `${order === 'desc' ? '-' : ''}${sort}`,
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Exam info retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching exam info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exam info' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    const examInfo = await payload.create({
      collection: 'exam-info',
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: examInfo,
      message: 'Exam info created successfully'
    })
  } catch (error) {
    console.error('Error creating exam info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create exam info' },
      { status: 500 }
    )
  }
}
