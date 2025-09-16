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
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    // Build query
    const query: any = {}
    
    // Add search
    if (search) {
      query.or = [
        { examName: { contains: search } }
      ]
    }

    // Add category filter
    if (category) {
      query.category = { equals: category }
    }

    // Add date filter
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.greater_than_equal = new Date(startDate)
      if (endDate) query.createdAt.less_than_equal = new Date(endDate)
    }

    const result = await payload.find({
      collection: 'exam',
      where: query,
      page,
      limit,
      sort: `${order === 'desc' ? '-' : ''}${sort}`,
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Exams retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching exams:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exams' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    const exam = await payload.create({
      collection: 'exam',
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: exam,
      message: 'Exam created successfully'
    })
  } catch (error) {
    console.error('Error creating exam:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create exam' },
      { status: 500 }
    )
  }
}
