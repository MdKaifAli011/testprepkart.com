import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Fetch the specific course with populated relationships
    const course = await payload.findByID({
      collection: 'courses',
      id,
      depth: 1, // This will populate the category relationship
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error: any) {
    console.error('Error fetching course:', error)

    // Handle specific MongoDB errors
    if (error.name === 'DocumentNotFoundError' || error.message?.includes('could not be found')) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Handle MongoDB connection errors
    if (error.name === 'MongooseServerSelectionError' || error.message?.includes('MongoDB')) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 503 })
    }

    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}
