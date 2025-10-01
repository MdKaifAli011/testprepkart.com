const { MongoClient, ObjectId } = require('mongodb')

async function convertSpecificCourse() {
  const uri = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/Demo_testprepkart_backend'
  const client = new MongoClient(uri)

  try {
    console.log('🔄 Converting Specific Course HTML to Lexical')
    console.log('='.repeat(60))

    await client.connect()
    console.log('✅ Database connection successful!')

    const db = client.db()
    const courseId = '68da71532deacee8b09f1a64'

    console.log(`\n🔍 Fetching course with ID: ${courseId}`)

    // Fetch the specific course
    const course = await db.collection('courses').findOne({ _id: new ObjectId(courseId) })

    if (!course) {
      console.log('❌ Course not found!')
      return
    }

    console.log(`✅ Found course: ${course.course_name}`)
    console.log(
      `📝 Description length: ${course.description ? course.description.length : 0} characters`,
    )

    if (!course.description) {
      console.log('❌ No description found in this course!')
      return
    }

    // Convert HTML to Lexical
    console.log('\n🔄 Converting HTML to Lexical format...')

    const lexicalData = convertHtmlToLexical(course.description)

    console.log('✅ HTML converted to Lexical format!')
    console.log(`📊 Lexical nodes count: ${lexicalData.root.children.length}`)

    // Update the course with Lexical data
    console.log('\n💾 Updating course with Lexical data...')

    const updateResult = await db.collection('courses').updateOne(
      { _id: new ObjectId(courseId) },
      {
        $set: {
          description: lexicalData,
          descriptionHtml: course.description, // Keep original HTML as backup
        },
      },
    )

    if (updateResult.modifiedCount > 0) {
      console.log('✅ Course updated successfully!')
      console.log('📝 Original HTML saved as descriptionHtml')
      console.log('🎯 New Lexical format saved as description')
    } else {
      console.log('❌ Failed to update course!')
    }

    // Show preview of converted content
    console.log('\n📋 Preview of converted content:')
    console.log('-'.repeat(40))

    if (lexicalData.root.children.length > 0) {
      const firstChild = lexicalData.root.children[0]
      if (firstChild.type === 'paragraph' && firstChild.children) {
        const textContent = firstChild.children
          .filter((child) => child.type === 'text')
          .map((child) => child.text)
          .join('')
          .substring(0, 200)
        console.log(`📄 First paragraph: ${textContent}...`)
      }
    }

    console.log('\n🎉 Conversion completed successfully!')
  } catch (error) {
    console.error('❌ Error converting course:', error)
  } finally {
    await client.close()
  }
}

// HTML to Lexical converter function
function convertHtmlToLexical(htmlContent) {
  // Basic HTML to Lexical conversion
  // This is a simplified version - you might want to use a more robust HTML parser

  const lexicalData = {
    root: {
      children: [],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },                  
  }

  if (!htmlContent || typeof htmlContent !== 'string') {
    return lexicalData
  }

  // Remove HTML tags and convert to plain text paragraphs
  const cleanText = htmlContent
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .trim()

  // Split into paragraphs (by double line breaks or <p> tags)
  const paragraphs = cleanText.split(/\n\s*\n/).filter((p) => p.trim().length > 0)

  paragraphs.forEach((paragraphText, index) => {
    if (paragraphText.trim()) {
      const paragraph = {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: paragraphText.trim(),
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      }

      lexicalData.root.children.push(paragraph)
    }
  })

  // If no paragraphs were created, create one with the full text
  if (lexicalData.root.children.length === 0 && cleanText) {
    const paragraph = {
      children: [
        {
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text: cleanText,
          type: 'text',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'paragraph',
      version: 1,
    }

    lexicalData.root.children.push(paragraph)
  }

  return lexicalData
}

// Run the conversion
convertSpecificCourse()
