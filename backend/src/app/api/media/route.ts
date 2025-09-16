import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/media - Get all media with filtering
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const alt = searchParams.get('alt') || ''
    
    const where: any = {}
    
    if (search) {
      where.or = [
        { filename: { contains: search } },
        { alt: { contains: search } },
      ]
    }
    
    if (alt) {
      where.alt = { contains: alt }
    }
    
    const result = await payload.find({
      collection: 'media',
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
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

// POST /api/media - Upload new media
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const formData = await request.formData()
    
    const media = await payload.create({
      collection: 'media',
      data: formData,
    })
    
    return NextResponse.json({
      success: true,
      data: media,
    })
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload media' },
      { status: 500 }
    )
  }
}
