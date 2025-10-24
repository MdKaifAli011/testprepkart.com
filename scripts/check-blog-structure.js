const { MongoClient } = require('mongodb')

async function checkBlogStructure() {
  const uri = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/Demo_testprepkart_backend'
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()

    const blog = await db.collection('jeeblogs').findOne(
      {
        content: { $exists: true, $type: 'array', $ne: [] },
      },
      { projection: { content: 1, title: 1 } },
    )

    if (blog && blog.content && blog.content.length > 0) {
      console.log('Blog Title:', blog.title)
      console.log('\nFirst content block:')
      console.log(JSON.stringify(blog.content[0], null, 2))

      if (blog.content[0].richText) {
        console.log('\nRichText content structure:')
        console.log(JSON.stringify(blog.content[0].richText, null, 2).substring(0, 2000))
      }
    } else {
      console.log('No content found')
    }

    await client.close()
  } catch (error) {
    console.error('Error:', error)
  }
}

checkBlogStructure()

