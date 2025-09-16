import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/stats - Get comprehensive statistics
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    // Build date filter
    const dateFilter: Record<string, Date> = {}
    if (startDate) dateFilter.greater_than_equal = new Date(startDate)
    if (endDate) dateFilter.less_than_equal = new Date(endDate)
    
    // Get counts for all collections
    const [leads, exams, posts, downloadMenus, subFolders, media] = await Promise.all([
      payload.count({
        collection: 'leads',
        where: Object.keys(dateFilter).length ? { createdAt: dateFilter } : {},
      }),
      payload.count({
        collection: 'exam',
        where: Object.keys(dateFilter).length ? { createdAt: dateFilter } : {},
      }),
      payload.count({
        collection: 'post',
        where: Object.keys(dateFilter).length ? { createdAt: dateFilter } : {},
      }),
      payload.count({
        collection: 'download-menus',
        where: Object.keys(dateFilter).length ? { createdAt: dateFilter } : {},
      }),
      payload.count({
        collection: 'sub-folders',
        where: Object.keys(dateFilter).length ? { createdAt: dateFilter } : {},
      }),
      payload.count({
        collection: 'media',
        where: Object.keys(dateFilter).length ? { createdAt: dateFilter } : {},
      }),
    ])
    
    // Get leads by class
    const leadsByClass = await payload.find({
      collection: 'leads',
      where: Object.keys(dateFilter).length ? { createdAt: dateFilter } : {},
      limit: 0,
    })
    
    const classStats = leadsByClass.docs.reduce((acc: Record<string, number>, lead: { class: string }) => {
      acc[lead.class] = (acc[lead.class] || 0) + 1
      return acc
    }, {})
    
    // Get recent activity
    const recentLeads = await payload.find({
      collection: 'leads',
      where: Object.keys(dateFilter).length ? { createdAt: dateFilter } : {},
      limit: 5,
      sort: '-createdAt',
    })
    
    const recentPosts = await payload.find({
      collection: 'post',
      where: Object.keys(dateFilter).length ? { createdAt: dateFilter } : {},
      limit: 5,
      sort: '-createdAt',
    })
    
    return NextResponse.json({
      success: true,
      data: {
        counts: {
          leads,
          exams,
          posts,
          downloadMenus,
          subFolders,
          media,
        },
        leadsByClass: classStats,
        recentActivity: {
          leads: recentLeads.docs,
          posts: recentPosts.docs,
        },
        dateRange: {
          startDate,
          endDate,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
