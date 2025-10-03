const { MongoClient, ObjectId } = require('mongodb')

// MongoDB connection
const MONGODB_URI = process.env.DATABASE_URI || 'mongodb://127.0.0.1/Demo_testprepkart_backend'

// Function to convert HTML to Payload CMS richtext format (Lexical)
function convertHtmlToRichtext(htmlContent) {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'text',
                format: 0,
                style: '',
                text: '',
                version: 1,
                mode: 'normal',
              },
            ],
            direction: 'ltr',
          },
        ],
        direction: 'ltr',
      },
    }
  }

  try {
    // Convert HTML to Lexical format
    return convertHtmlToLexical(htmlContent)
  } catch (_error) {
    console.error('Error converting HTML to richtext:', _error)
    // Fallback to simple text conversion
    return convertHtmlToSimpleRichtext(htmlContent)
  }
}

// Function to convert HTML to Lexical format
function convertHtmlToLexical(htmlContent) {
  // Simple HTML to Lexical conversion
  // This is a basic implementation that handles common HTML elements

  // Clean and parse HTML content
  const cleanHtml = htmlContent
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()

  // Split content into paragraphs based on HTML structure
  const paragraphs = []

  // Handle <p> tags
  const pMatches = cleanHtml.match(/<p[^>]*>(.*?)<\/p>/gi)
  if (pMatches) {
    pMatches.forEach((pTag) => {
      const content = pTag.replace(/<[^>]*>/g, '').trim()
      if (content) {
        paragraphs.push(createLexicalParagraph(content))
      }
    })
  } else {
    // If no <p> tags, split by <br> or double newlines
    const content = cleanHtml.replace(/<[^>]*>/g, '').trim()
    const splitContent = content.split(/\n\s*\n|<br\s*\/?>/gi)
    splitContent.forEach((text) => {
      const trimmed = text.trim()
      if (trimmed) {
        paragraphs.push(createLexicalParagraph(trimmed))
      }
    })
  }

  // If no paragraphs found, create one with the entire content
  if (paragraphs.length === 0) {
    const cleanText = cleanHtml.replace(/<[^>]*>/g, '').trim()
    paragraphs.push(createLexicalParagraph(cleanText || ''))
  }

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: paragraphs,
      direction: 'ltr',
    },
  }
}

// Function to create a Lexical paragraph node
function createLexicalParagraph(text) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        type: 'text',
        format: 0,
        style: '',
        text: text,
        version: 1,
        mode: 'normal',
      },
    ],
    direction: 'ltr',
  }
}

// Fallback function for simple HTML to richtext conversion
function convertHtmlToSimpleRichtext(htmlContent) {
  const cleanText = htmlContent
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()

  const paragraphs = cleanText.split(/\n\s*\n/).filter((p) => p.trim().length > 0)

  if (paragraphs.length === 0) {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'text',
                format: 0,
                style: '',
                text: '',
                version: 1,
                mode: 'normal',
              },
            ],
            direction: 'ltr',
          },
        ],
        direction: 'ltr',
      },
    }
  }

  const children = paragraphs.map((paragraph) => ({
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        type: 'text',
        format: 0,
        style: '',
        text: paragraph.trim(),
        version: 1,
        mode: 'normal',
      },
    ],
    direction: 'ltr',
  }))

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children,
      direction: 'ltr',
    },
  }
}

// Function to convert HTML to richtext blocks format
function convertHtmlToRichtextBlocks(htmlContent) {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return []
  }

  const richtextContent = convertHtmlToRichtext(htmlContent)

  return [
    {
      blockType: 'richText',
      content: richtextContent,
    },
  ]
}

async function convertCourseDescriptionToRichtext(courseId) {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db()
    const coursesCollection = db.collection('courses')

    // Convert string ID to ObjectId if needed
    let objectId
    try {
      objectId = new ObjectId(courseId)
    } catch (_error) {
      console.error(`Invalid ObjectId format: ${courseId}`)
      return
    }

    // Find the course
    const course = await coursesCollection.findOne({ _id: objectId })

    if (!course) {
      console.error(`Course not found with ID: ${courseId}`)
      return
    }

    console.log(`Found course: ${course.course_name}`)
    console.log(`Current description type: ${typeof course.description}`)

    // Check if description is already in richtext format
    if (Array.isArray(course.description)) {
      console.log('Description is already in blocks format. Skipping conversion.')
      return
    }

    // Convert HTML description to richtext blocks
    const richtextBlocks = convertHtmlToRichtextBlocks(course.description)

    console.log('Converted HTML to richtext blocks:')
    console.log(JSON.stringify(richtextBlocks, null, 2))

    // Update the course with richtext format
    const updateResult = await coursesCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          description: richtextBlocks,
          updatedAt: new Date(),
        },
      },
    )

    if (updateResult.modifiedCount > 0) {
      console.log(`✅ Successfully converted description for course: ${course.course_name}`)
    } else {
      console.log('No changes made to the course')
    }
  } catch (_error) {
    console.error('Error converting course description:', _error)
  } finally {
    await client.close()
  }
}

// Function to convert all courses with HTML descriptions
async function convertAllCourseDescriptions() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db()
    const coursesCollection = db.collection('courses')

    // Find all courses with string descriptions (HTML format)
    const courses = await coursesCollection
      .find({
        description: { $type: 'string' },
      })
      .toArray()

    console.log(`Found ${courses.length} courses with HTML descriptions`)

    let convertedCount = 0
    let errorCount = 0

    for (const course of courses) {
      try {
        console.log(`\nConverting course: ${course.course_name} (ID: ${course._id})`)

        const richtextBlocks = convertHtmlToRichtextBlocks(course.description)

        await coursesCollection.updateOne(
          { _id: course._id },
          {
            $set: {
              description: richtextBlocks,
              updatedAt: new Date(),
            },
          },
        )

        convertedCount++
        console.log(`✅ Converted: ${course.course_name}`)
      } catch (_error) {
        console.error(`❌ Error converting ${course.course_name}:`, _error.message)
        errorCount++
      }
    }

    console.log(`\n✅ Conversion completed:`)
    console.log(`   - Converted: ${convertedCount} courses`)
    console.log(`   - Errors: ${errorCount} courses`)
  } catch (_error) {
    console.error('Error converting course descriptions:', _error)
  } finally {
    await client.close()
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage:')
    console.log('  node convert-html-to-richtext.js <course-id>  # Convert specific course')
    console.log('  node convert-html-to-richtext.js --all       # Convert all courses')
    return
  }

  if (args[0] === '--all') {
    await convertAllCourseDescriptions()
  } else {
    const courseId = args[0]
    await convertCourseDescriptionToRichtext(courseId)
  }
}

// Run the script
main().catch(console.error)
