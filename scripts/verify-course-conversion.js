const { MongoClient, ObjectId } = require('mongodb')

async function verifyCourseConversion() {
  const uri = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/Demo_testprepkart_backend'
  const client = new MongoClient(uri)

  try {
    console.log('🔍 Verifying Course HTML to Blocks Conversion')
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

    console.log(`✅ Course: "${course.course_name}"`)
    console.log('\n📊 Conversion Summary:')
    console.log('='.repeat(70))

    // Check if description is now blocks
    if (Array.isArray(course.description)) {
      console.log(`✅ Description is now in blocks format`)
      console.log(`📦 Total blocks: ${course.description.length}`)

      // Count block types
      const blockTypes = {}
      course.description.forEach((block) => {
        const type = block.blockType || 'unknown'
        blockTypes[type] = (blockTypes[type] || 0) + 1
      })

      console.log('\n📈 Block Type Distribution:')
      Object.entries(blockTypes).forEach(([type, count]) => {
        console.log(`   - ${type}: ${count} blocks`)
      })

      // Show sample blocks
      console.log('\n📝 Sample Blocks:')
      console.log('='.repeat(70))

      // Show first richText block
      const richTextBlock = course.description.find((b) => b.blockType === 'richText')
      if (richTextBlock) {
        console.log('\n1️⃣  Rich Text Block (H2 Heading):')
        const heading = richTextBlock.content.root.children[0]
        if (heading && heading.children && heading.children[0]) {
          console.log(`   Type: ${heading.type}`)
          console.log(`   Tag: ${heading.tag}`)
          console.log(`   Text: "${heading.children[0].text.substring(0, 80)}..."`)
        }
      }

      // Show first table block
      const tableBlock = course.description.find((b) => b.blockType === 'table')
      if (tableBlock) {
        console.log('\n2️⃣  Table Block:')
        console.log(`   Rows: ${tableBlock.rows.length}`)
        if (tableBlock.rows.length > 0) {
          console.log(`   Columns: ${tableBlock.rows[0].columns.length}`)
          console.log(`   Sample cell: "${tableBlock.rows[0].columns[0].value}"`)
        }
      }

      // Show first list block
      const listBlock = course.description.find((b) => b.blockType === 'list')
      if (listBlock) {
        console.log('\n3️⃣  List Block:')
        console.log(`   Items: ${listBlock.items.length}`)
        console.log(`   Ordered: ${listBlock.ordered}`)
        if (listBlock.items.length > 0) {
          console.log(`   First item: "${listBlock.items[0].text.substring(0, 60)}..."`)
        }
      }

      // Show first HTML block (images)
      const htmlBlock = course.description.find((b) => b.blockType === 'html')
      if (htmlBlock) {
        console.log('\n4️⃣  HTML Block (Image):')
        console.log(`   Code: ${htmlBlock.code.substring(0, 100)}...`)
      }

      // Check for backup HTML
      if (course.description_html_backup) {
        console.log('\n✅ Original HTML backed up in description_html_backup field')
        console.log(`   Backup size: ${course.description_html_backup.length} characters`)
      }
    } else {
      console.log(`❌ Description is still in old format (${typeof course.description})`)
    }

    console.log('\n' + '='.repeat(70))
    console.log('🎉 Verification Complete!')
    console.log('\n💡 Next Steps:')
    console.log('1. View the course in Payload CMS admin panel: /admin/collections/courses')
    console.log('2. Edit the course to see the blocks in action')
    console.log('3. Update your frontend to render the blocks properly')

    await client.close()
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.close()
  }
}

verifyCourseConversion()

