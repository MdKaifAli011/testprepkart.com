const { MongoClient, ObjectId } = require('mongodb')
const { JSDOM } = require('jsdom')

async function convertCourseHtmlToRichtext() {
  const uri = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/Demo_testprepkart_backend'
  const client = new MongoClient(uri)

  try {
    console.log('🔄 Converting Course HTML Description to Payload CMS Rich Text')
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

    // Convert HTML to Slate-like rich text format
    console.log('\n🔧 Converting HTML to rich text format...')
    const richTextContent = htmlToSlateFormat(course.description)

    console.log(`✅ Converted to ${richTextContent.length} content blocks`)

    // Update the course with the new rich text content
    console.log('\n💾 Updating course in database...')

    const result = await db.collection('courses').updateOne(
      { _id: new ObjectId(courseId) },
      {
        $set: {
          description_richtext: richTextContent,
          description_html: course.description, // Keep original HTML as backup
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
      { projection: { course_name: 1, description_richtext: 1 } },
    )

    if (updatedCourse.description_richtext) {
      console.log('✅ Rich text content verified!')
      console.log(`📊 Content blocks: ${updatedCourse.description_richtext.length}`)
      console.log('\n📝 First 3 content blocks:')
      console.log(JSON.stringify(updatedCourse.description_richtext.slice(0, 3), null, 2))
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
 * Convert HTML to Slate-like rich text format used by Payload CMS
 */
function htmlToSlateFormat(html) {
  const content = []

  // Create a DOM from the HTML
  const dom = new JSDOM(html)
  const document = dom.window.document
  const body = document.body

  // Process each child element
  for (const child of body.children) {
    const block = processElement(child)
    if (block) {
      if (Array.isArray(block)) {
        content.push(...block)
      } else {
        content.push(block)
      }
    }
  }

  return content
}

/**
 * Process an HTML element and convert it to Slate format
 */
function processElement(element) {
  const tagName = element.tagName.toLowerCase()

  switch (tagName) {
    case 'h1':
      return createHeading(element, 'h1')
    case 'h2':
      return createHeading(element, 'h2')
    case 'h3':
      return createHeading(element, 'h3')
    case 'h4':
      return createHeading(element, 'h4')
    case 'h5':
      return createHeading(element, 'h5')
    case 'h6':
      return createHeading(element, 'h6')
    case 'p':
      return createParagraph(element)
    case 'ul':
      return createList(element, 'ul')
    case 'ol':
      return createList(element, 'ol')
    case 'table':
      return createTable(element)
    case 'div':
      return processDiv(element)
    case 'img':
      return createImage(element)
    case 'a':
      return createLink(element)
    case 'br':
      return null // Skip standalone br tags
    default:
      // For unknown tags, try to extract text content
      if (element.textContent.trim()) {
        return createParagraph(element)
      }
      return null
  }
}

/**
 * Process a div element (could contain images, tables, or text)
 */
function processDiv(element) {
  const className = element.className || ''

  // Check if div contains an image
  const img = element.querySelector('img')
  if (img) {
    return createImage(img)
  }

  // Check if div contains a table
  const table = element.querySelector('table')
  if (table) {
    return createTable(table)
  }

  // Otherwise, process as paragraph
  if (element.textContent.trim()) {
    return createParagraph(element)
  }

  // Process children
  const blocks = []
  for (const child of element.children) {
    const block = processElement(child)
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
 * Create a heading block
 */
function createHeading(element, tag) {
  const children = processTextContent(element)

  return {
    type: 'h' + tag.charAt(1),
    children: children.length > 0 ? children : [{ text: '' }],
  }
}

/**
 * Create a paragraph block
 */
function createParagraph(element) {
  const children = processTextContent(element)

  return {
    type: 'p',
    children: children.length > 0 ? children : [{ text: '' }],
  }
}

/**
 * Create a list block
 */
function createList(element, listType) {
  const items = []

  for (const li of element.querySelectorAll(':scope > li')) {
    items.push({
      type: 'li',
      children: processTextContent(li),
    })
  }

  return {
    type: listType,
    children: items.length > 0 ? items : [{ type: 'li', children: [{ text: '' }] }],
  }
}

/**
 * Create a table block (convert to paragraph with formatted text for simplicity)
 */
function createTable(element) {
  // For tables, we'll create a simple paragraph representation
  // You might want to enhance this to create actual table blocks
  const rows = element.querySelectorAll('tr')
  const tableText = []

  for (const row of rows) {
    const cells = row.querySelectorAll('td, th')
    const cellTexts = Array.from(cells).map((cell) => cell.textContent.trim())
    tableText.push(cellTexts.join(' | '))
  }

  return {
    type: 'p',
    children: [{ text: tableText.join('\n') }],
  }
}

/**
 * Create an image block
 */
function createImage(element) {
  const src = element.getAttribute('src') || ''
  const alt = element.getAttribute('alt') || ''

  return {
    type: 'upload',
    value: {
      id: src, // Store the image URL/path
    },
    relationTo: 'media',
    children: [{ text: '' }],
  }
}

/**
 * Create a link
 */
function createLink(element) {
  const href = element.getAttribute('href') || ''
  const text = element.textContent.trim()

  return {
    type: 'link',
    url: href,
    children: [{ text: text || href }],
  }
}

/**
 * Process text content with formatting (bold, italic, etc.)
 */
function processTextContent(element) {
  const children = []

  // Process child nodes
  for (const node of element.childNodes) {
    if (node.nodeType === 3) {
      // Text node
      const text = node.textContent
      if (text) {
        children.push({ text: text })
      }
    } else if (node.nodeType === 1) {
      // Element node
      const tagName = node.tagName.toLowerCase()

      switch (tagName) {
        case 'strong':
        case 'b':
          children.push({ text: node.textContent, bold: true })
          break
        case 'em':
        case 'i':
          children.push({ text: node.textContent, italic: true })
          break
        case 'u':
          children.push({ text: node.textContent, underline: true })
          break
        case 'a':
          const href = node.getAttribute('href') || ''
          children.push({
            type: 'link',
            url: href,
            children: [{ text: node.textContent }],
          })
          break
        case 'span':
          // Check for inline styles
          const style = node.getAttribute('style') || ''
          const textObj = { text: node.textContent }

          if (style.includes('font-weight: bold') || style.includes('font-weight:bold')) {
            textObj.bold = true
          }
          if (style.includes('font-style: italic') || style.includes('font-style:italic')) {
            textObj.italic = true
          }

          children.push(textObj)
          break
        case 'br':
          children.push({ text: '\n' })
          break
        case 'img':
          // For inline images, add as a reference
          const src = node.getAttribute('src') || ''
          const alt = node.getAttribute('alt') || ''
          children.push({ text: `[Image: ${alt || src}]` })
          break
        default:
          // For other elements, just get the text
          if (node.textContent) {
            children.push({ text: node.textContent })
          }
      }
    }
  }

  return children.length > 0 ? children : [{ text: '' }]
}

// Run the conversion
if (require.main === module) {
  convertCourseHtmlToRichtext()
    .then(() => {
      console.log('\n✅ Script completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error)
      process.exit(1)
    })
}

module.exports = { convertCourseHtmlToRichtext, htmlToSlateFormat }

