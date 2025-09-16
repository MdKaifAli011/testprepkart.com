import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/download-menus - Get all download menus with filtering
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const exam = searchParams.get('exam') || ''
    const isActive = searchParams.get('isActive')
    
    const where: any = {}
    
    if (search) {
      where.or = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }
    
    if (exam) {
      where.exam = { equals: exam }
    }
    
    if (isActive !== null && isActive !== undefined) {
      where.isActive = { equals: isActive === 'true' }
    }
    
    const result = await payload.find({
      collection: 'download-menus',
      where,
      page,
      limit,
      sort: 'sortOrder',
    })
    
    return NextResponse.json({
      success: true,
      data: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
    })
  } catch (error) {
    console.error('Error fetching download menus:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch download menus' },
      { status: 500 }
    )
  }
}

// POST /api/download-menus - Create new download menu
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    
    const downloadMenu = await payload.create({
      collection: 'download-menus',
      data: body,
    })
    
    return NextResponse.json({
      success: true,
      data: downloadMenu,
    })
  } catch (error) {
    console.error('Error creating download menu:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create download menu' },
      { status: 500 }
    )
  }
}
