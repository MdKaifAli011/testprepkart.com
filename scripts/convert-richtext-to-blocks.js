const { MongoClient, ObjectId } = require('mongodb')

// MongoDB connection
const MONGODB_URI = process.env.DATABASE_URI || 'mongodb://127.0.0.1/Demo_testprepkart_backend'
// const MONGODB_URI ='mongodb+srv://testprepkartdev_db_user:testprepkartdev_db_pass@testprepkart.ouuudgs.mongodb.net/Demo_testprepkart_backend_new?retryWrites=true&w=majority&appName=TestprepKart'
// Function to extract text content from richtext nodes
function extractTextFromRichtext(richtextNode) {
  if (!richtextNode || !richtextNode.children) {
    return ''
  }

  let text = ''
  for (const child of richtextNode.children) {
    if (child.type === 'text') {
      text += child.text
    } else if (child.children) {
      text += extractTextFromRichtext(child)
    }
  }
  return text
}

// Function to check if text looks like a heading
function isHeading(text) {
  const trimmed = text.trim()
  return (
    trimmed.length < 100 && // Short text
    (trimmed.endsWith(':') ||
      trimmed.match(/^\d+\./) || // Numbered list
      trimmed.match(/^[A-Z][^a-z]*$/) || // All caps
      trimmed.match(/^(Why|How|What|When|Where|Benefits|Features|Course|JEE|IIT)/i)) // Common heading patterns
  )
}

// Function to check if text looks like a list item
function isListItem(text) {
  const trimmed = text.trim()
  return (
    trimmed.match(/^\d+\./) || // Numbered list
    trimmed.match(/^[•\-\*]/) || // Bullet list
    trimmed.match(/^[a-z]\)/) // Lettered list
  )
}

// Function to check if text looks like a question
function isQuestion(text) {
  const trimmed = text.trim()
  return trimmed.match(/^(Question \d+:|Q\d+:|Q:)/i)
}

// Function to check if text looks like an answer
function isAnswer(text) {
  const trimmed = text.trim()
  return trimmed.match(/^(Answer \d+:|A\d+:|A:)/i)
}

// Function to convert richtext content to Payload CMS blocks
function convertRichtextToBlocks(richtextContent) {
  if (!richtextContent || !richtextContent.root || !richtextContent.root.children) {
    return []
  }

  const blocks = []
  const paragraphs = richtextContent.root.children.filter((child) => child.type === 'paragraph')

  let currentListItems = []
  let currentListOrdered = false
  let currentQuestionAnswer = null

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i]
    const text = extractTextFromRichtext(paragraph).trim()

    if (!text) continue

    // Handle Question-Answer pairs
    if (isQuestion(text)) {
      // Save previous Q&A if exists
      if (currentQuestionAnswer) {
        blocks.push(currentQuestionAnswer)
      }

      currentQuestionAnswer = {
        blockType: 'richText',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [paragraph],
            direction: 'ltr',
          },
        },
      }
      continue
    }

    if (isAnswer(text) && currentQuestionAnswer) {
      // Add answer to current question
      currentQuestionAnswer.content.root.children.push(paragraph)
      blocks.push(currentQuestionAnswer)
      currentQuestionAnswer = null
      continue
    }

    // If we have a current question but this is not an answer, save the question
    if (currentQuestionAnswer && !isAnswer(text)) {
      blocks.push(currentQuestionAnswer)
      currentQuestionAnswer = null
    }

    // Handle lists
    if (isListItem(text)) {
      const isOrdered = text.match(/^\d+\./)
      if (currentListItems.length === 0) {
        currentListOrdered = isOrdered
      }

      if (currentListOrdered === isOrdered) {
        // Clean the list item text
        const cleanText = text
          .replace(/^\d+\.\s*/, '')
          .replace(/^[•\-\*]\s*/, '')
          .replace(/^[a-z]\)\s*/, '')
        currentListItems.push({ text: cleanText })
        continue
      } else {
        // Different list type, save current list and start new one
        if (currentListItems.length > 0) {
          blocks.push({
            blockType: 'list',
            items: currentListItems,
            ordered: currentListOrdered,
          })
        }
        currentListItems = []
        currentListOrdered = isOrdered
        const cleanText = text
          .replace(/^\d+\.\s*/, '')
          .replace(/^[•\-\*]\s*/, '')
          .replace(/^[a-z]\)\s*/, '')
        currentListItems.push({ text: cleanText })
        continue
      }
    }

    // If we have accumulated list items, save them
    if (currentListItems.length > 0) {
      blocks.push({
        blockType: 'list',
        items: currentListItems,
        ordered: currentListOrdered,
      })
      currentListItems = []
    }

    // Handle headings and regular paragraphs
    if (isHeading(text)) {
      // Create a richText block with heading-like formatting
      blocks.push({
        blockType: 'richText',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                ...paragraph,
                children: paragraph.children.map((child) => ({
                  ...child,
                  format: child.format | 1, // Bold formatting
                  style: 'font-weight: bold; font-size: 1.2em;',
                })),
              },
            ],
            direction: 'ltr',
          },
        },
      })
    } else {
      // Regular paragraph
      blocks.push({
        blockType: 'richText',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [paragraph],
            direction: 'ltr',
          },
        },
      })
    }
  }

  // Handle any remaining list items
  if (currentListItems.length > 0) {
    blocks.push({
      blockType: 'list',
      items: currentListItems,
      ordered: currentListOrdered,
    })
  }

  // Handle any remaining question-answer
  if (currentQuestionAnswer) {
    blocks.push(currentQuestionAnswer)
  }

  return blocks
}

// Function to convert a single course's richtext to blocks
async function convertCourseRichtextToBlocks(courseId) {
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

    // Check if description is already in richtext blocks format
    if (!Array.isArray(course.description)) {
      console.log('Description is not in blocks format. Please convert HTML to richtext first.')
      return
    }

    // Check if it's already converted to multiple blocks
    if (
      course.description.length > 1 ||
      (course.description.length === 1 && course.description[0].blockType !== 'richText')
    ) {
      console.log('Description is already converted to multiple blocks. Skipping conversion.')
      return
    }

    // Get the richtext content from the first block
    const richtextBlock = course.description[0]
    if (richtextBlock.blockType !== 'richText' || !richtextBlock.content) {
      console.log('No richtext content found to convert.')
      return
    }

    // Convert richtext to multiple blocks
    const newBlocks = convertRichtextToBlocks(richtextBlock.content)

    console.log(`Converted richtext to ${newBlocks.length} blocks:`)
    console.log(
      'Block types:',
      newBlocks.map((b) => b.blockType),
    )

    // Show sample of converted blocks
    newBlocks.slice(0, 3).forEach((block, index) => {
      console.log(`\nBlock ${index + 1} (${block.blockType}):`)
      if (block.blockType === 'richText') {
        const text = extractTextFromRichtext(block.content.root)
        console.log(`  Text: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`)
      } else if (block.blockType === 'list') {
        console.log(`  List items: ${block.items.length} (ordered: ${block.ordered})`)
        console.log(`  Sample: ${block.items[0]?.text?.substring(0, 50)}...`)
      }
    })

    // Update the course with new blocks format
    const updateResult = await coursesCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          description: newBlocks,
          updatedAt: new Date(),
        },
      },
    )

    if (updateResult.modifiedCount > 0) {
      console.log(
        `\n✅ Successfully converted richtext to blocks for course: ${course.course_name}`,
      )
      console.log(`   - Total blocks: ${newBlocks.length}`)
      console.log(
        `   - RichText blocks: ${newBlocks.filter((b) => b.blockType === 'richText').length}`,
      )
      console.log(`   - List blocks: ${newBlocks.filter((b) => b.blockType === 'list').length}`)
    } else {
      console.log('No changes made to the course')
    }
  } catch (_error) {
    console.error('Error converting course richtext to blocks:', _error)
  } finally {
    await client.close()
  }
}

// Function to convert all courses with richtext descriptions
async function convertAllCourseRichtextToBlocks() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db()
    const coursesCollection = db.collection('courses')

    // Find all courses with richtext blocks (single richText block)
    const courses = await coursesCollection
      .find({
        description: {
          $type: 'array',
          $elemMatch: { blockType: 'richText' },
        },
      })
      .toArray()

    // Filter to only courses with single richtext block
    const coursesToConvert = courses.filter(
      (course) =>
        Array.isArray(course.description) &&
        course.description.length === 1 &&
        course.description[0].blockType === 'richText',
    )

    console.log(`Found ${coursesToConvert.length} courses with single richtext blocks to convert`)

    let convertedCount = 0
    let errorCount = 0

    for (const course of coursesToConvert) {
      try {
        console.log(`\nConverting course: ${course.course_name} (ID: ${course._id})`)

        const newBlocks = convertRichtextToBlocks(course.description[0].content)

        await coursesCollection.updateOne(
          { _id: course._id },
          {
            $set: {
              description: newBlocks,
              updatedAt: new Date(),
            },
          },
        )

        convertedCount++
        console.log(`✅ Converted: ${course.course_name} (${newBlocks.length} blocks)`)
      } catch (_error) {
        console.error(`❌ Error converting ${course.course_name}:`, _error.message)
        errorCount++
      }
    }

    console.log(`\n✅ Conversion completed:`)
    console.log(`   - Converted: ${convertedCount} courses`)
    console.log(`   - Errors: ${errorCount} courses`)
  } catch (_error) {
    console.error('Error converting course richtext to blocks:', _error)
  } finally {
    await client.close()
  }
}

// Function to preview conversion without updating database
async function previewConversion(courseId) {
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

    if (!Array.isArray(course.description) || course.description.length === 0) {
      console.log('No richtext blocks found to convert.')
      return
    }

    const richtextBlock = course.description[0]
    if (richtextBlock.blockType !== 'richText' || !richtextBlock.content) {
      console.log('No richtext content found to convert.')
      return
    }

    // Convert richtext to multiple blocks
    const newBlocks = convertRichtextToBlocks(richtextBlock.content)

    console.log(`\n📋 PREVIEW: Would convert to ${newBlocks.length} blocks:`)
    console.log('='.repeat(60))

    newBlocks.forEach((block, index) => {
      console.log(`\nBlock ${index + 1}: ${block.blockType.toUpperCase()}`)
      console.log('-'.repeat(40))

      if (block.blockType === 'richText') {
        const text = extractTextFromRichtext(block.content.root)
        console.log(`Text: ${text.substring(0, 150)}${text.length > 150 ? '...' : ''}`)
      } else if (block.blockType === 'list') {
        console.log(`List type: ${block.ordered ? 'Ordered' : 'Unordered'}`)
        console.log(`Items: ${block.items.length}`)
        block.items.slice(0, 3).forEach((item, i) => {
          console.log(
            `  ${i + 1}. ${item.text.substring(0, 80)}${item.text.length > 80 ? '...' : ''}`,
          )
        })
        if (block.items.length > 3) {
          console.log(`  ... and ${block.items.length - 3} more items`)
        }
      }
    })
  } catch (_error) {
    console.error('Error previewing conversion:', _error)
  } finally {
    await client.close()
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage:')
    console.log('  node convert-richtext-to-blocks.js <course-id>        # Convert specific course')
    console.log('  node convert-richtext-to-blocks.js <course-id> --preview  # Preview conversion')
    console.log('  node convert-richtext-to-blocks.js --all             # Convert all courses')
    return
  }

  if (args[0] === '--all') {
    await convertAllCourseRichtextToBlocks()
  } else if (args[1] === '--preview') {
    await previewConversion(args[0])
  } else {
    const courseId = args[0]
    await convertCourseRichtextToBlocks(courseId)
  }
}

// Run the script
main().catch(console.error)
