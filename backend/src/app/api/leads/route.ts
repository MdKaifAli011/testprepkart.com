import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/leads - Get all leads with filtering
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const classFilter = searchParams.get('class') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    const format = searchParams.get('format') || 'json'
    
    // Build where clause
    const where: any = {}
    
    if (search) {
      where.or = [
        { name: { contains: search } },
        { email: { contains: search } },
        { mobile: { contains: search } },
      ]
    }
    
    if (classFilter) {
      where.class = { equals: classFilter }
    }
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.greater_than_equal = new Date(startDate)
      if (endDate) where.createdAt.less_than_equal = new Date(endDate)
    }
    
    // Get leads
    const result = await payload.find({
      collection: 'leads',
      where,
      page,
      limit,
      sort: '-createdAt',
    })
    
    if (format === 'csv') {
      // Convert to CSV
      const csvHeaders = 'Name,Email,Mobile,Class,Country,Message,Created At\n'
      const csvRows = result.docs.map(lead => 
        `"${lead.name}","${lead.email}","${lead.mobile}","${lead.class}","${lead.country}","${lead.message || ''}","${lead.createdAt}"`
      ).join('\n')
      
      return new NextResponse(csvHeaders + csvRows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="leads.csv"',
        },
      })
    }
    
    return NextResponse.json({
      success: true,
      data: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

// POST /api/leads - Create new lead
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    
    // Add submission details
    const submissionDetails = {
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      referrerUrl: request.headers.get('referer') || '',
      currentUrl: body.currentUrl || '',
      timestamp: new Date().toISOString(),
      source: body.source || 'contact-form',
    }
    
    const lead = await payload.create({
      collection: 'leads',
      data: {
        ...body,
        submissionDetails,
      },
    })
    
    return NextResponse.json({
      success: true,
      data: lead,
    })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
