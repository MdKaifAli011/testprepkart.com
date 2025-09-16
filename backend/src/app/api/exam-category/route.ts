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
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    // Build query
    const query: any = {}
    
    // Add search
    if (search) {
      query.or = [
        { categoryName: { contains: search } },
        { seo_title: { contains: search } },
        { seo_keyword: { contains: search } },
        { seo_description: { contains: search } }
      ]
    }

    // Add date filter
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.greater_than_equal = new Date(startDate)
      if (endDate) query.createdAt.less_than_equal = new Date(endDate)
    }

    const result = await payload.find({
      collection: 'exam-category',
      where: query,
      page,
      limit,
      sort: `${order === 'desc' ? '-' : ''}${sort}`,
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Exam categories retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching exam categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exam categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    const examCategory = await payload.create({
      collection: 'exam-category',
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: examCategory,
      message: 'Exam category created successfully'
    })
  } catch (error) {
    console.error('Error creating exam category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create exam category' },
      { status: 500 }
    )
  }
}
