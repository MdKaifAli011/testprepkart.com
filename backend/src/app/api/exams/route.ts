import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/exams - Get all exams with filtering
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const examType = searchParams.get('examType') || ''
    
    const where: any = {}
    
    if (search) {
      where.or = [
        { examName: { contains: search } },
        { description: { contains: search } },
      ]
    }
    
    if (examType) {
      where.examType = { equals: examType }
    }
    
    const result = await payload.find({
      collection: 'exam',
      where,
      page,
      limit,
      sort: '-createdAt',
    })
    
    return NextResponse.json({
      success: true,
      data: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
    })
  } catch (error) {
    console.error('Error fetching exams:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exams' },
      { status: 500 }
    )
  }
}

// POST /api/exams - Create new exam
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
    })
  } catch (error) {
    console.error('Error creating exam:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create exam' },
      { status: 500 }
    )
  }
}
