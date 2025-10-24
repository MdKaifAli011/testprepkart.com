const { MongoClient } = require('mongodb')

async function examineCourse() {
  const uri = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/Demo_testprepkart_backend'
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()

    // Fetch the course
    const course = await db.collection('courses').findOne({
      _id: new (require('mongodb').ObjectId)('68df758348c82b7897baf503'),
    })

    console.log('Course Name:', course.course_name)
    console.log('\n' + '='.repeat(60))
    console.log('HTML Description (first 2000 chars):')
    console.log('='.repeat(60))
    console.log(course.description.substring(0, 2000))

    // Check a blog to see content structure
    console.log('\n\n' + '='.repeat(60))
    console.log('Checking blog content structure...')
    console.log('='.repeat(60))

    const blog = await db.collection('jeeblogs').findOne({
      content: { $exists: true, $type: 'array' },
    })

    if (blog && blog.content) {
      console.log('\nSample Blog Content Structure:')
      console.log(JSON.stringify(blog.content.slice(0, 2), null, 2))
    }

    await client.close()
  } catch (error) {
    console.error('Error:', error)
  }
}

examineCourse()

