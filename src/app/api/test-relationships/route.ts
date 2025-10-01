import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Test courses with populated relationships
    const coursesResult = await payload.find({
      collection: 'courses',
      limit: 5,
      page: 1,
      depth: 1, // This will populate the relationship
    })

    const courses = coursesResult.docs.map((course) => ({
      id: course.id,
      course_name: course.course_name,
      category:
        course.category && typeof course.category === 'object'
          ? {
              id: (course.category as any).id,
              categoryName:
                (course.category as any).categoryName || (course.category as any).menuName,
              originalId: (course.category as any).originalId,
            }
          : null,
      originalId: course.originalId,
    }))

    // Test exam_categories with populated relationships
    const categoriesResult = await payload.find({
      collection: 'exam_categories',
      limit: 5,
      page: 1,
      depth: 1,
    })

    const categories = categoriesResult.docs.map((category) => ({
      id: category.id,
      categoryName: category.categoryName,
      exam:
        category.exam && typeof category.exam === 'object'
          ? {
              id: (category.exam as any).id,
              examName: (category.exam as any).examName,
              originalId: (category.exam as any).originalId,
            }
          : null,
      originalId: category.originalId,
    }))

    return NextResponse.json({
      success: true,
      message: 'Relationship test successful',
      data: {
        courses,
        categories,
        totalCourses: coursesResult.totalDocs,
        totalCategories: categoriesResult.totalDocs,
      },
    })
  } catch (error: any) {
    console.error('Relationship test failed:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        errorType: error.name,
        message: 'Relationship test failed',
      },
      { status: 500 },
    )
  }
}
