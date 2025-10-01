const { MongoClient } = require('mongodb')
const { JSDOM } = require('jsdom')
const { createHeadlessEditor } = require('lexical')
const { $generateNodesFromDOM, $generateEditorStateFromNodes } = require('@lexical/html')

// Converts HTML to Lexical editor format using Lexical's official utilities
function convertHtmlToLexical(htmlText) {
  if (!htmlText || typeof htmlText !== 'string') {
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
                text: htmlText || 'No description available',
                version: 1,
                mode: 'normal',
              },
            ],
          },
        ],
      },
    }
  }

  // Setup JSDOM and parse the HTML
  const dom = new JSDOM(`<body>${htmlText}</body>`)
  const document = dom.window.document
  const body = document.body

  // Create a headless Lexical editor instance
  const editor = createHeadlessEditor()

  let lexicalJson
  editor.update(() => {
    // Generate Lexical nodes from DOM
    const lexicalNodes = $generateNodesFromDOM(editor, body)

    // Insert Lexical nodes into the editor
    const root = editor.getRootElement()
    root.clear()
    root.append(...lexicalNodes)

    // Export the editor state to JSON
    lexicalJson = editor.getEditorState().toJSON()
  })

  return lexicalJson
}

// Fallback for plain text to Lexical format
function convertToLexical(text) {
  if (!text || typeof text !== 'string') {
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
                text: text || 'No description available',
                version: 1,
                mode: 'normal',
              },
            ],
          },
        ],
      },
    }
  }

  // Split text into paragraphs
  const paragraphs = text.split('\n').filter((p) => p.trim().length > 0)

  if (paragraphs.length === 0) {
    paragraphs.push('No description available')
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
  }))

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: children,
    },
  }
}

// Main conversion and update function
async function convertDescriptions() {
  const client = new MongoClient('mongodb://127.0.0.1/Demo_testprepkart_backend')

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db('Demo_testprepkart_backend')

    console.log('🔄 Converting course descriptions to Lexical format...\n')

    const courses = await db.collection('courses').find({}).toArray()
    console.log(`📊 Found ${courses.length} courses to convert\n`)

    let convertedCount = 0

    for (const course of courses) {
      console.log(`📝 Converting: ${course.course_name}`)

      try {
        // Convert description field
        if (course.description) {
          let lexicalDescription
          try {
            lexicalDescription = convertHtmlToLexical(course.description)
          } catch (e) {
            lexicalDescription = convertToLexical(course.description)
          }

          await db.collection('courses').updateOne(
            { _id: course._id },
            {
              $set: {
                description: lexicalDescription,
                description_converted: true,
                converted_at: new Date(),
              },
            },
          )

          console.log(`  ✅ Description converted`)
        }

        // Convert other_details field if it exists
        if (course.other_details) {
          let lexicalOtherDetails
          try {
            lexicalOtherDetails = convertHtmlToLexical(course.other_details)
          } catch (e) {
            lexicalOtherDetails = convertToLexical(course.other_details)
          }

          await db.collection('courses').updateOne(
            { _id: course._id },
            {
              $set: {
                other_details: lexicalOtherDetails,
                other_details_converted: true,
              },
            },
          )

          console.log(`  ✅ Other details converted`)
        }

        convertedCount++
      } catch (error) {
        console.log(`  ❌ Error converting ${course.course_name}:`, error.message)
      }

      console.log('')
    }

    console.log('🎉 CONVERSION COMPLETED!')
    console.log(`📊 Successfully converted: ${convertedCount} courses`)

    // Show sample of converted data
    console.log('\n📄 Sample of converted description:')
    const sampleCourse = await db.collection('courses').findOne({ description_converted: true })
    if (sampleCourse && sampleCourse.description) {
      console.log(JSON.stringify(sampleCourse.description, null, 2))
    }
  } catch (error) {
    console.error('❌ Conversion failed:', error.message)
  } finally {
    await client.close()
    console.log('\n✅ Database connection closed')
  }
}

// Run the conversion
convertDescriptions()
