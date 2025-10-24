const { MongoClient } = require('mongodb')

async function checkBlogFields() {
  const uri = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/Demo_testprepkart_backend'
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()

    const blog = await db.collection('jeeblogs').findOne({})

    if (blog) {
      console.log('Blog fields:', Object.keys(blog))
      console.log('\nSample blog:')
      console.log(JSON.stringify(blog, null, 2).substring(0, 1500))
    }

    await client.close()
  } catch (error) {
    console.error('Error:', error)
  }
}

checkBlogFields()

