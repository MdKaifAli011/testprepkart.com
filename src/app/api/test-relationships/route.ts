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
              id: (course.category as { id: string }).id,
              categoryName:
                (course.category as { categoryName?: string; menuName?: string }).categoryName || 
                (course.category as { categoryName?: string; menuName?: string }).menuName,
              originalId: (course.category as { originalId: number | null | undefined })?.originalId?.toString() || null,
            }
          : null,
      // originalId: course.originalId?.toString() || null, // Removed as it doesn't exist on Course type
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
              id: (category.exam as { id: string }).id,
              examName: (category.exam as { examName: string }).examName,
              originalId: (category.exam as { originalId: number | null | undefined })?.originalId?.toString() || null,
            }
          : null,
      // originalId: category.originalId?.toString() || null, // Removed as it doesn't exist on category type
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
  } catch (error: unknown) {
    console.error('Relationship test failed:', error)

    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        errorType: (error as Error).name,
        message: 'Relationship test failed',
      },
      { status: 500 },
    )
  }
}
