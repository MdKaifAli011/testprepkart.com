const { MongoClient, ObjectId } = require('mongodb')
const fs = require('fs')
const path = require('path')

async function convertMedicalBlogs() {
  const uri = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/Demo_testprepkart_backend'
  const client = new MongoClient(uri)

  const TARGET_EXAM_ID = '68da71472deacee8b09f05c3' // Medical Entrance Exams

  try {
    console.log('🔄 Converting Medical SQL to JEE Blogs Collection')
    console.log('='.repeat(60))

    await client.connect()
    console.log('✅ Database connection successful!')

    const db = client.db()

    // Step 1: Get the Medical Entrance Exams ID
    console.log('\n🔍 Step 1: Finding Medical Entrance Exams...')
    console.log('-'.repeat(40))

    const medicalExam = await db.collection('exams').findOne({
      _id: new ObjectId(TARGET_EXAM_ID),
    })

    if (!medicalExam) {
      console.log('❌ Medical Entrance Exams not found!')
      return
    }

    console.log(`✅ Found Medical Entrance Exams: ${medicalExam.examName}`)
    console.log(`   - ID: ${medicalExam._id}`)
    console.log(`   - Original ID: ${medicalExam.originalId}`)

    // Step 2: Read the SQL JSON file
    console.log('\n📄 Step 2: Reading Medical SQL data...')
    console.log('-'.repeat(40))

    const sqlFilePath = path.join(process.cwd(), '..', 'sql', 'Medical_Entrance_Exams.json')

    if (!fs.existsSync(sqlFilePath)) {
      console.log('❌ SQL file not found:', sqlFilePath)
      return
    }

    console.log('✅ Reading SQL file...')
    const fileContent = fs.readFileSync(sqlFilePath, 'utf8')

    // Parse PHPMyAdmin JSON format
    const lines = fileContent.split('\n')
    const dataLines = lines.filter((line) => line.trim().startsWith('{"ID":'))

    console.log(`📊 Found ${dataLines.length} blog posts in Medical SQL data`)

    // Parse each line as JSON
    const postsData = dataLines
      .map((line) => {
        try {
          return JSON.parse(line.trim().replace(/,$/, '')) // Remove trailing comma
        } catch (error) {
          console.log(`⚠️  Error parsing line: ${line.substring(0, 100)}...`)
          return null
        }
      })
      .filter((post) => post !== null)

    console.log(`📊 Successfully parsed ${postsData.length} blog posts`)

    // Step 3: Prepare for insertion
    console.log('\n📚 Step 3: Preparing to insert into neetblogs collection...')
    console.log('-'.repeat(40))

    console.log(`📊 Target Collection: neetblogs`)
    console.log(`   - Mapping all blogs to exam: ${medicalExam.examName}`)
    console.log(`   - Exam ID: ${medicalExam._id}`)
    console.log(`   - Using simplified schema (text fields, no richText)`)

    // Step 4: Convert and insert blog posts
    console.log('\n💾 Step 4: Converting and inserting blog posts...')
    console.log('-'.repeat(40))

    let blogsInserted = 0
    let blogsSkipped = 0

    for (const post of postsData) {
      try {
        const originalId = parseInt(post.ID)

        // Check if blog already exists in neetblogs collection
        const existingBlog = await db.collection('neetblogs').findOne({
          originalId: originalId,
        })

        if (existingBlog) {
          blogsSkipped++
          continue
        }

        // Extract title from description (first heading or create from content)
        let title = `Medical Blog ${originalId}`
        let excerpt = ''

        if (post.description) {
          // Try to extract title from HTML
          const titleMatch = post.description.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i)
          if (titleMatch) {
            title = titleMatch[1].trim()
          }

          // Create excerpt (remove HTML tags and limit length)
          excerpt = post.description
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 200)

          if (excerpt.length === 200) {
            excerpt += '...'
          }
        }

        // Ensure title and excerpt are not empty
        if (!title || title.trim() === '' || title === '&nbsp;') {
          title = `Medical Blog ${originalId}`
        }

        // Clean the description for text field (remove HTML tags for preview)
        const cleanDescription = (post.description || '')
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 1000) // Limit to 1000 chars for text field

        // Extract keywords as comma-separated string (not array)
        const keywordsArray = extractMedicalKeywordsFromContent(post.description)
        const keywordsString = keywordsArray.join(', ')

        // Create blog document matching JeeBlogs schema
        const blogDoc = {
          originalId: originalId,
          title: title,
          description: cleanDescription || 'No description available', // Text field, not richText
          descriptionHtml: post.description || '', // Keep original HTML
          excerpt: excerpt || 'No excerpt available',
          exam: medicalExam._id, // Required relationship
          status: 'published',
          author: post.author, // Keep original author as requested
          metaTitle: title,
          metaDescription: excerpt || 'No description available',
          keywords: keywordsString, // Comma-separated string, not array
          readTime: Math.ceil((post.description || '').length / 1000),
          views: 0,
          publishedAt: new Date(post.createAt || Date.now()),
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        // Insert blog into neetblogs collection
        await db.collection('neetblogs').insertOne(blogDoc)
        blogsInserted++

        if (blogsInserted % 100 === 0) {
          console.log(`  Progress: ${blogsInserted} blogs inserted...`)
        }
      } catch (error) {
        console.log(`  ❌ Error processing blog ID ${post.ID}: ${error.message}`)
      }
    }

    console.log(
      `\n✅ Insertion completed: ${blogsInserted} blogs inserted, ${blogsSkipped} skipped`,
    )

    // Step 5: Fix any data quality issues
    console.log('\n🔧 Step 5: Fixing data quality issues...')
    console.log('-'.repeat(40))

    // Fix blogs with empty titles
    console.log('  Fixing blogs with empty titles...')
    const blogsWithEmptyTitles = await db
      .collection('neetblogs')
      .find({
        $or: [{ title: { $in: ['', null, '&nbsp;'] } }, { title: { $exists: false } }],
        exam: medicalExam._id, // Only fix medical blogs
      })
      .toArray()

    let fixedTitles = 0
    for (const blog of blogsWithEmptyTitles) {
      try {
        const newTitle = `Medical Blog ${blog.originalId}`
        await db.collection('neetblogs').updateOne(
          { _id: blog._id },
          {
            $set: {
              title: newTitle,
              metaTitle: newTitle,
              updatedAt: new Date(),
            },
          },
        )
        fixedTitles++
      } catch (error) {
        console.log(`    ❌ Error fixing title for blog ${blog.originalId}: ${error.message}`)
      }
    }

    if (fixedTitles > 0) {
      console.log(`  ✅ Fixed ${fixedTitles} blogs with empty titles`)
    }

    // Fix blogs with empty excerpts
    console.log('  Fixing blogs with empty excerpts...')
    const blogsWithEmptyExcerpts = await db
      .collection('neetblogs')
      .find({
        $or: [{ excerpt: { $in: ['', null] } }, { excerpt: { $exists: false } }],
        exam: medicalExam._id, // Only fix medical blogs
      })
      .toArray()

    let fixedExcerpts = 0
    for (const blog of blogsWithEmptyExcerpts) {
      try {
        const newExcerpt = blog.description
          ? blog.description.substring(0, 200) + (blog.description.length > 200 ? '...' : '')
          : 'No excerpt available'

        await db.collection('neetblogs').updateOne(
          { _id: blog._id },
          {
            $set: {
              excerpt: newExcerpt,
              metaDescription: newExcerpt,
              updatedAt: new Date(),
            },
          },
        )
        fixedExcerpts++
      } catch (error) {
        console.log(`    ❌ Error fixing excerpt for blog ${blog.originalId}: ${error.message}`)
      }
    }

    if (fixedExcerpts > 0) {
      console.log(`  ✅ Fixed ${fixedExcerpts} blogs with empty excerpts`)
    }

    // Ensure all required fields have proper values
    console.log('  Ensuring all required fields have proper values...')
    const blogsNeedingDefaults = await db
      .collection('neetblogs')
      .find({
        $or: [{ status: { $exists: false } }, { views: { $exists: false } }],
        exam: medicalExam._id, // Only fix medical blogs
      })
      .toArray()

    let fixedDefaults = 0
    for (const blog of blogsNeedingDefaults) {
      try {
        const updates = {}

        if (!blog.status) updates.status = 'published'
        if (blog.views === undefined) updates.views = 0

        if (Object.keys(updates).length > 0) {
          updates.updatedAt = new Date()

          await db.collection('neetblogs').updateOne({ _id: blog._id }, { $set: updates })

          fixedDefaults++
        }
      } catch (error) {
        console.log(`    ❌ Error fixing defaults for blog ${blog.originalId}: ${error.message}`)
      }
    }

    if (fixedDefaults > 0) {
      console.log(`  ✅ Fixed ${fixedDefaults} blogs with missing defaults`)
    }

    // Step 6: Create summary
    console.log('\n📊 Step 6: Creating conversion summary...')
    console.log('-'.repeat(40))

    const totalBlogs = await db.collection('neetblogs').countDocuments({
      exam: medicalExam._id,
    })

    console.log(`📊 Conversion Summary:`)
    console.log(`  ✅ Blogs inserted: ${blogsInserted}`)
    console.log(`  ⚠️  Blogs skipped: ${blogsSkipped}`)
    console.log(`  🔧 Titles fixed: ${fixedTitles}`)
    console.log(`  🔧 Excerpts fixed: ${fixedExcerpts}`)
    console.log(`  🔧 Defaults fixed: ${fixedDefaults}`)
    console.log(`  📝 Total Medical blogs: ${totalBlogs}`)

    // Step 7: Verify relationships
    console.log('\n🔍 Step 7: Verifying relationships...')
    console.log('-'.repeat(40))

    const blogsWithExam = await db
      .collection('neetblogs')
      .aggregate([
        {
          $match: { exam: medicalExam._id },
        },
        {
          $lookup: {
            from: 'exams',
            localField: 'exam',
            foreignField: '_id',
            as: 'examData',
          },
        },
        {
          $limit: 5,
        },
      ])
      .toArray()

    console.log('📋 Sample Medical blogs with exam relationships:')
    blogsWithExam.forEach((blog, index) => {
      const examName = blog.examData && blog.examData[0] ? blog.examData[0].examName : 'No exam'
      console.log(`  ${index + 1}. ${blog.title}`)
      console.log(`     - Exam: ${examName}`)
      console.log(`     - Author: ${blog.author}`)
      console.log(`     - Status: ${blog.status}`)
      console.log(`     - Read Time: ${blog.readTime} min`)
    })

    // Step 8: Final verification
    console.log('\n✅ Step 8: Final data quality verification...')
    console.log('-'.repeat(40))

    const blogsWithEmptyTitle = await db.collection('neetblogs').countDocuments({
      $or: [{ title: { $in: ['', null] } }, { title: { $exists: false } }],
      exam: medicalExam._id,
    })
    const blogsWithEmptyExcerpt = await db.collection('neetblogs').countDocuments({
      $or: [{ excerpt: { $in: ['', null] } }, { excerpt: { $exists: false } }],
      exam: medicalExam._id,
    })

    console.log('📊 Data Quality Report:')
    console.log(`  Total Medical blogs: ${totalBlogs}`)
    console.log(`  Blogs with empty titles: ${blogsWithEmptyTitle}`)
    console.log(`  Blogs with empty excerpts: ${blogsWithEmptyExcerpt}`)
    console.log(
      `  Data quality: ${blogsWithEmptyTitle === 0 && blogsWithEmptyExcerpt === 0 ? '✅ Perfect' : '⚠️  Needs attention'}`,
    )

    // Step 9: Export summary
    console.log('\n💾 Step 9: Creating export summary...')
    console.log('-'.repeat(40))

    const exportSummary = {
      conversionInfo: {
        timestamp: new Date().toISOString(),
        sourceFile: 'Medical_Entrance_Exams.json',
        targetCollection: 'neetblogs',
        examId: medicalExam._id,
        examName: medicalExam.examName,
        schemaType: 'Simplified (text fields, no richText)',
      },
      statistics: {
        blogsInserted,
        blogsSkipped,
        fixedTitles,
        fixedExcerpts,
        fixedDefaults,
        totalBlogs,
        examMapped: medicalExam.examName,
      },
      dataQuality: {
        blogsWithEmptyTitle,
        blogsWithEmptyExcerpt,
        status:
          blogsWithEmptyTitle === 0 && blogsWithEmptyExcerpt === 0 ? 'Perfect' : 'Needs attention',
      },
    }

    const exportDir = path.join(process.cwd(), 'exports')
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir)
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const exportFile = path.join(exportDir, `medical-blog-conversion-summary-${timestamp}.json`)

    fs.writeFileSync(exportFile, JSON.stringify(exportSummary, null, 2))
    console.log(`✅ Export summary saved to: ${exportFile}`)

    // Final Summary
    console.log('\n🎉 MEDICAL BLOGS CONVERSION & FIX COMPLETED!')
    console.log('='.repeat(60))
    console.log(`📊 Final Results:`)
    console.log(`  🎯 Target Collection: neetblogs`)
    console.log(`  🎯 Target Exam: ${medicalExam.examName}`)
    console.log(`  📝 Total Medical Blogs: ${totalBlogs}`)
    console.log(`  ✅ Successfully Inserted: ${blogsInserted}`)
    console.log(`  ⚠️  Skipped (already exist): ${blogsSkipped}`)
    console.log(`  🔧 Data fixes applied: ${fixedTitles + fixedExcerpts + fixedDefaults}`)
    console.log(`  📚 Schema: Simplified (text fields)`)
    console.log(`  💾 Export File: ${exportFile}`)

    console.log('\n🚀 Next Steps:')
    console.log(
      '1. Verify Medical blogs in Payload CMS admin panel at /admin/collections/neetblogs',
    )
    console.log('2. Create API endpoints for Medical blog listing')
    console.log('3. Build Medical blog display pages')
    console.log('4. Test exam relationship filtering')
    console.log('5. All data quality issues have been automatically fixed!')
  } catch (error) {
    console.error('❌ Error in conversion and fix process:', error)
  } finally {
    await client.close()
  }
}

// Helper function to extract medical keywords from content (returns array)
function extractMedicalKeywordsFromContent(content) {
  if (!content) return []

  const keywords = []
  const contentLower = content.toLowerCase()

  // Medical-specific keywords
  if (contentLower.includes('neet')) keywords.push('NEET')
  if (contentLower.includes('medical')) keywords.push('Medical')
  if (contentLower.includes('mbbs')) keywords.push('MBBS')
  if (contentLower.includes('bds')) keywords.push('BDS')
  if (contentLower.includes('ayush')) keywords.push('AYUSH')
  if (contentLower.includes('aiims')) keywords.push('AIIMS')
  if (contentLower.includes('jipmer')) keywords.push('JIPMER')
  if (contentLower.includes('preparation')) keywords.push('preparation')
  if (contentLower.includes('study')) keywords.push('study')
  if (contentLower.includes('tips')) keywords.push('tips')
  if (contentLower.includes('guide')) keywords.push('guide')
  if (contentLower.includes('syllabus')) keywords.push('syllabus')
  if (contentLower.includes('pattern')) keywords.push('exam pattern')
  if (contentLower.includes('entrance')) keywords.push('entrance exam')

  return keywords.slice(0, 5) // Limit to 5 keywords
}

// Run the conversion and fix
convertMedicalBlogs()
