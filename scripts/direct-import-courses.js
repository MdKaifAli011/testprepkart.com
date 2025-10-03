const { MongoClient } = require('mongodb')
const fs = require('fs')
const path = require('path')

// MongoDB connection
const MONGODB_URI = process.env.DATABASE_URI || 'mongodb://127.0.0.1/Demo_testprepkart_backend'
// const MONGODB_URI ='mongodb+srv://testprepkartdev_db_user:testprepkartdev_db_pass@testprepkart.ouuudgs.mongodb.net/Demo_testprepkart_backend_new?retryWrites=true&w=majority&appName=TestprepKart'

async function directImportCourses() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db()
    const coursesCollection = db.collection('courses')

    // Read the SQL JSON file
    const sqlFilePath = path.join(__dirname, '..', 'sql', 'ca_courses_copy.json')
    const sqlData = JSON.parse(fs.readFileSync(sqlFilePath, 'utf8'))

    // Find the data array (skip headers)
    const dataArray = sqlData.find((item) => Array.isArray(item.data))?.data
    if (!dataArray) {
      throw new Error('Could not find course data in SQL file')
    }

    console.log(`Found ${dataArray.length} courses in SQL file`)

    let importedCount = 0
    let skippedCount = 0

    for (const courseData of dataArray) {
      try {
        // Check if course already exists
        const existingCourse = await coursesCollection.findOne({
          originalId: parseInt(courseData.id),
        })
        if (existingCourse) {
          console.log(`Skipping existing course: ${courseData.course_name}`)
          skippedCount++
          continue
        }

        // Create the course document with direct SQL data mapping
        const courseDocument = {
          originalId: parseInt(courseData.id),
          category: courseData.category_id ? parseInt(courseData.category_id) : null,
          course_name: courseData.course_name || '',
          course_short_description: courseData.course_short_description || '',
          description: courseData.description || '', // Keep as raw HTML/text
          price: courseData.price ? parseFloat(courseData.price) : null,
          rating: courseData.rating ? parseFloat(courseData.rating) : null,
          review: courseData.review ? parseInt(courseData.review) : null,
          start_date: courseData.start_date ? new Date(courseData.start_date) : null,
          duration: courseData.duration || '',
          student_count: courseData.student_count ? parseInt(courseData.student_count) : null,
          course_type: courseData.course_type || 'online',
          course_level: courseData.course_level || '',
          other_details: courseData.other_details || '', // Keep as raw HTML/text
          faculty_name: courseData.faculty_name || '',
          faculty_image: courseData.faculty_image || '',
          course_image: courseData.course_image || '',
          course_video: courseData.course_video || '',
          seo_title: courseData.seo_title || '',
          seo_description: courseData.seo_description || '',
          seo_keywords: courseData.seo_keywords || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        // Insert the course
        await coursesCollection.insertOne(courseDocument)
        importedCount++
        console.log(`Imported course: ${courseData.course_name}`)
      } catch (error) {
        console.error(`Error importing course ${courseData.course_name}:`, error.message)
      }
    }

    console.log(`\n✅ Direct import completed:`)
    console.log(`   - Imported: ${importedCount} courses`)
    console.log(`   - Skipped: ${skippedCount} courses (already exist)`)
  } catch (error) {
    console.error('Error importing courses:', error)
  } finally {
    await client.close()
  }
}

// Run the direct import
directImportCourses().catch(console.error)
