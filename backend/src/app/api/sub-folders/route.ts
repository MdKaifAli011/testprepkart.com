import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/sub-folders - Get all sub folders with filtering
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const mainFolder = searchParams.get('mainFolder') || ''
    const isActive = searchParams.get('isActive')
    
    const where: any = {}
    
    if (search) {
      where.or = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }
    
    if (mainFolder) {
      where.mainFolder = { equals: mainFolder }
    }
    
    if (isActive !== null && isActive !== undefined) {
      where.isActive = { equals: isActive === 'true' }
    }
    
    const result = await payload.find({
      collection: 'sub-folders',
      where,
      page,
      limit,
      sort: 'order',
    })
    
    return NextResponse.json({
      success: true,
      data: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
    })
  } catch (error) {
    console.error('Error fetching sub folders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sub folders' },
      { status: 500 }
    )
  }
}

// POST /api/sub-folders - Create new sub folder
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    
    const subFolder = await payload.create({
      collection: 'sub-folders',
      data: body,
    })
    
    return NextResponse.json({
      success: true,
      data: subFolder,
    })
  } catch (error) {
    console.error('Error creating sub folder:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create sub folder' },
      { status: 500 }
    )
  }
}
