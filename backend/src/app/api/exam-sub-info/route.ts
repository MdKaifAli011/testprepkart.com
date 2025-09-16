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
    const parentInfo = searchParams.get('parentInfo')
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
        { description: { contains: search } }
      ]
    }

    // Add filters
    if (parentInfo) {
      query.parentInfo = { equals: parentInfo }
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
      collection: 'exam-sub-info',
      where: query,
      page,
      limit,
      sort: `${order === 'desc' ? '-' : ''}${sort}`,
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Exam sub info retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching exam sub info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exam sub info' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    const examSubInfo = await payload.create({
      collection: 'exam-sub-info',
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: examSubInfo,
      message: 'Exam sub info created successfully'
    })
  } catch (error) {
    console.error('Error creating exam sub info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create exam sub info' },
      { status: 500 }
    )
  }
}
