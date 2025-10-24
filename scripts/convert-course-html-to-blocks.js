const { MongoClient, ObjectId } = require('mongodb')
const { JSDOM } = require('jsdom')

async function convertCourseHtmlToBlocks() {
  const uri = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/Demo_testprepkart_backend'
  const client = new MongoClient(uri)

  try {
    console.log('🔄 Converting Course HTML Description to Payload CMS Blocks')
    console.log('='.repeat(70))

    await client.connect()
    const db = client.db()

    // Fetch the course
    const courseId = '68df758348c82b7897baf503'
    const course = await db.collection('courses').findOne({
      _id: new ObjectId(courseId),
    })

    if (!course) {
      console.log('❌ Course not found!')
      return
    }

    console.log(`✅ Found course: "${course.course_name}"`)
    console.log(`📄 HTML Description length: ${course.description.length} characters`)

    // Convert HTML to blocks format (matching Courses collection schema)
    console.log('\n🔧 Converting HTML to blocks format...')
    const blocks = htmlToBlocks(course.description)

    console.log(`✅ Converted to ${blocks.length} blocks`)

    // Update the course with the new blocks
    console.log('\n💾 Updating course in database...')

    const result = await db.collection('courses').updateOne(
      { _id: new ObjectId(courseId) },
      {
        $set: {
          description: blocks, // Store as blocks
          description_html_backup: course.description, // Keep original HTML as backup
          updatedAt: new Date(),
        },
      },
    )

    if (result.modifiedCount > 0) {
      console.log('✅ Course updated successfully!')
    } else {
      console.log('⚠️  Course was not modified (maybe already up to date)')
    }

    // Verify the update
    console.log('\n🔍 Verifying update...')
    const updatedCourse = await db.collection('courses').findOne(
      {
        _id: new ObjectId(courseId),
      },
      { projection: { course_name: 1, description: 1 } },
    )

    if (updatedCourse.description && Array.isArray(updatedCourse.description)) {
      console.log('✅ Blocks content verified!')
      console.log(`📊 Total blocks: ${updatedCourse.description.length}`)
      console.log('\n📝 First 2 blocks:')
      console.log(JSON.stringify(updatedCourse.description.slice(0, 2), null, 2))
    }

    await client.close()

    console.log('\n🎉 Conversion completed successfully!')
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.close()
  }
}

/**
 * Convert HTML to Payload CMS blocks format (matching Courses schema)
 */
function htmlToBlocks(html) {
  const blocks = []

  // Create a DOM from the HTML
  const dom = new JSDOM(html)
  const document = dom.window.document
  const body = document.body

  // Process each child element
  for (const child of body.children) {
    const block = processElementToBlock(child)
    if (block) {
      if (Array.isArray(block)) {
        blocks.push(...block)
      } else {
        blocks.push(block)
      }
    }
  }

  return blocks
}

/**
 * Process an HTML element and convert it to a Payload block
 */
function processElementToBlock(element) {
  const tagName = element.tagName.toLowerCase()

  // Handle different HTML elements
  switch (tagName) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
    case 'p':
      return createRichTextBlock(element, tagName)

    case 'ul':
    case 'ol':
      return createListBlock(element, tagName === 'ol')

    case 'table':
      return createTableBlock(element)

    case 'div':
      return processDiv(element)

    case 'img':
      return createImageBlock(element)

    default:
      // For unknown tags, try to extract as rich text
      if (element.textContent.trim()) {
        return createRichTextBlock(element, 'p')
      }
      return null
  }
}

/**
 * Process a div element
 */
function processDiv(element) {
  const className = element.className || ''

  // Check if div contains an image
  const img = element.querySelector('img')
  if (img) {
    return createImageBlock(img)
  }

  // Check if div contains a table
  const table = element.querySelector('table')
  if (table) {
    return createTableBlock(table)
  }

  // Otherwise, process as rich text
  if (element.textContent.trim()) {
    return createRichTextBlock(element, 'p')
  }

  // Process children
  const blocks = []
  for (const child of element.children) {
    const block = processElementToBlock(child)
    if (block) {
      if (Array.isArray(block)) {
        blocks.push(...block)
      } else {
        blocks.push(block)
      }
    }
  }

  return blocks.length > 0 ? blocks : null
}

/**
 * Create a rich text block (using Lexical format)
 */
function createRichTextBlock(element, nodeType) {
  const textNodes = extractTextNodes(element)

  return {
    blockType: 'richText',
    content: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type:
              nodeType === 'h1'
                ? 'heading'
                : nodeType === 'h2'
                  ? 'heading'
                  : nodeType === 'h3'
                    ? 'heading'
                    : nodeType === 'h4'
                      ? 'heading'
                      : nodeType === 'h5'
                        ? 'heading'
                        : nodeType === 'h6'
                          ? 'heading'
                          : 'paragraph',
            tag: nodeType,
            format: '',
            indent: 0,
            version: 1,
            children:
              textNodes.length > 0
                ? textNodes
                : [
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
    },
    id: generateId(),
  }
}

/**
 * Extract text nodes with formatting from an element (Lexical format)
 */
function extractTextNodes(element) {
  const nodes = []

  for (const node of element.childNodes) {
    if (node.nodeType === 3) {
      // Text node
      const text = node.textContent
      if (text) {
        nodes.push({
          type: 'text',
          format: 0,
          style: '',
          text: text,
          version: 1,
          mode: 'normal',
        })
      }
    } else if (node.nodeType === 1) {
      // Element node
      const tagName = node.tagName.toLowerCase()
      const text = node.textContent.trim()

      if (!text) continue

      let format = 0

      switch (tagName) {
        case 'strong':
        case 'b':
          format = format | 1 // Bold = 1
          break
        case 'em':
        case 'i':
          format = format | 2 // Italic = 2
          break
        case 'u':
          format = format | 8 // Underline = 8
          break
        case 'a':
          // Handle links separately
          nodes.push({
            type: 'link',
            format: '',
            indent: 0,
            version: 1,
            url: node.getAttribute('href') || '',
            target: node.getAttribute('target') || null,
            rel: null,
            title: null,
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
          })
          continue
        case 'span':
        case 'br':
        default:
          // For other elements, just extract text
          break
      }

      nodes.push({
        type: 'text',
        format: format,
        style: '',
        text: text,
        version: 1,
        mode: 'normal',
      })
    }
  }

  return nodes
}

/**
 * Create a list block
 */
function createListBlock(element, ordered) {
  const items = []

  for (const li of element.querySelectorAll(':scope > li')) {
    items.push({
      text: li.textContent.trim(),
      id: generateId(),
    })
  }

  return {
    blockType: 'list',
    items: items,
    ordered: ordered,
    id: generateId(),
  }
}

/**
 * Create a table block
 */
function createTableBlock(element) {
  const rows = []

  for (const tr of element.querySelectorAll('tr')) {
    const columns = []
    const cells = tr.querySelectorAll('td, th')

    for (const cell of cells) {
      columns.push({
        value: cell.textContent.trim(),
        id: generateId(),
      })
    }

    if (columns.length > 0) {
      rows.push({
        columns: columns,
        id: generateId(),
      })
    }
  }

  return {
    blockType: 'table',
    rows: rows,
    id: generateId(),
  }
}

/**
 * Create an image block
 */
function createImageBlock(element) {
  const src = element.getAttribute('src') || ''
  const alt = element.getAttribute('alt') || ''

  // For now, store image URL as text
  // You may want to upload images to Payload media and get proper IDs
  return {
    blockType: 'html',
    code: `<img src="${src}" alt="${alt}" />`,
    id: generateId(),
  }
}

/**
 * Generate a unique ID
 */
function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

// Run the conversion
if (require.main === module) {
  convertCourseHtmlToBlocks()
    .then(() => {
      console.log('\n✅ Script completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error)
      process.exit(1)
    })
}

module.exports = { convertCourseHtmlToBlocks, htmlToBlocks }

