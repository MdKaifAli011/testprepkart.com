const { MongoClient } = require('mongodb')

// MongoDB connection
// const MONGODB_URI = process.env.DATABASE_URI || 'mongodb://127.0.0.1/Demo_testprepkart_backend'
const MONGODB_URI ='mongodb+srv://testprepkartdev_db_user:testprepkartdev_db_pass@testprepkart.ouuudgs.mongodb.net/Demo_testprepkart_backend_new?retryWrites=true&w=majority&appName=TestprepKart'

async function fixCategoryRelationships() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db()
    const coursesCollection = db.collection('courses')
    const examCategoriesCollection = db.collection('exam_categories')

    // Get all categories and create a mapping from originalId to ObjectId
    const categories = await examCategoriesCollection.find({}).toArray()
    const categoryMapping = {}

    categories.forEach((cat) => {
      if (cat.originalId) {
        categoryMapping[cat.originalId] = cat._id
        console.log(`Mapped category: ${cat.originalId} -> ${cat._id} (${cat.categoryName})`)
      }
    })

    console.log(`\n📊 Created mapping for ${Object.keys(categoryMapping).length} categories`)

    // Get all courses that have numeric category references
    const courses = await coursesCollection
      .find({
        category: { $type: 'number' },
      })
      .toArray()

    console.log(`\n📚 Found ${courses.length} courses with numeric category references`)

    let updatedCount = 0
    let errorCount = 0

    for (const course of courses) {
      try {
        const categoryId = course.category
        const objectId = categoryMapping[categoryId]

        if (objectId) {
          // Update the course to reference the proper category ObjectId
          await coursesCollection.updateOne({ _id: course._id }, { $set: { category: objectId } })
          updatedCount++
          console.log(`✅ Updated course: ${course.course_name} -> Category ID: ${objectId}`)
        } else {
          console.log(
            `❌ No category found for originalId: ${categoryId} in course: ${course.course_name}`,
          )
          errorCount++
        }
      } catch (error) {
        console.error(`Error updating course ${course.course_name}:`, error.message)
        errorCount++
      }
    }

    console.log(`\n✅ Category relationship fix completed:`)
    console.log(`   - Updated: ${updatedCount} courses`)
    console.log(`   - Errors: ${errorCount} courses`)

    // Verify the fix by checking a few courses
    console.log(`\n🔍 Verification - Sample updated courses:`)
    const sampleCourses = await coursesCollection.find({}).limit(3).toArray()

    for (const course of sampleCourses) {
      if (typeof course.category === 'object' && course.category.toString) {
        // This is now an ObjectId, let's get the category name
        const category = await examCategoriesCollection.findOne({ _id: course.category })
        console.log(`Course: ${course.course_name}`)
        console.log(
          `Category: ${category ? category.categoryName : 'Not found'} (ObjectId: ${course.category})`,
        )
      }
    }
  } catch (error) {
    console.error('Error fixing category relationships:', error)
  } finally {
    await client.close()
  }
}

// Run the fix
fixCategoryRelationships().catch(console.error)
