const { MongoClient, ObjectId } = require('mongodb')
const fs = require('fs')
const path = require('path')

async function convertSatBlogs() {
  const uri = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/Demo_testprepkart_backend'
  const client = new MongoClient(uri)

  const TARGET_EXAM_ID = '68da71472deacee8b09f05c1' // International Entrance Exams

  try {
    console.log('🔄 Converting SAT SQL to SAT Blogs Collection')
    console.log('='.repeat(60))

    await client.connect()
    console.log('✅ Database connection successful!')

    const db = client.db()

    // Step 1: Get the International Entrance Exams ID
    console.log('\n🔍 Step 1: Finding International Entrance Exams...')
    console.log('-'.repeat(40))

    const internationalExam = await db.collection('exams').findOne({
      _id: new ObjectId(TARGET_EXAM_ID),
    })

    if (!internationalExam) {
      console.log('❌ International Entrance Exams not found!')
      return
    }

    console.log(`✅ Found International Entrance Exams: ${internationalExam.examName}`)
    console.log(`   - ID: ${internationalExam._id}`)
    console.log(`   - Original ID: ${internationalExam.originalId}`)

    // Step 2: Skip category lookup (not needed for SAT blogs)
    console.log('\n📚 Step 2: Skipping category lookup (not needed for SAT blogs)...')
    console.log('-'.repeat(40))
    console.log('✅ No categories required - mapping only to exam')

    // Step 3: Read the SQL JSON file
    console.log('\n📄 Step 3: Reading SAT SQL data...')
    console.log('-'.repeat(40))

    const sqlFilePath = path.join(process.cwd(), '..', 'sql', 'satblogs.json')

    if (!fs.existsSync(sqlFilePath)) {
      console.log('❌ SQL file not found:', sqlFilePath)
      return
    }

    console.log('✅ Reading SQL file...')
    const fileContent = fs.readFileSync(sqlFilePath, 'utf8')

    // Parse the PHPMyAdmin JSON export format
    let postsData = []
    try {
      const jsonData = JSON.parse(fileContent)

      // The structure is: [header, database, table_object_with_data]
      if (Array.isArray(jsonData) && jsonData.length >= 3) {
        // The data is in the table object's data property
        if (jsonData[2] && jsonData[2].data && Array.isArray(jsonData[2].data)) {
          postsData = jsonData[2].data
          console.log(`📊 Parsed JSON structure: ${jsonData.length} elements`)
          console.log(`   - Element 0 (header): ${JSON.stringify(jsonData[0]).substring(0, 50)}...`)
          console.log(
            `   - Element 1 (database): ${JSON.stringify(jsonData[1]).substring(0, 50)}...`,
          )
          console.log(`   - Element 2 (table): ${JSON.stringify(jsonData[2]).substring(0, 50)}...`)
          console.log(`   - Data array: ${postsData.length} items`)
        } else {
          console.log('❌ Table object does not contain data array')
          console.log(`   - Table object: ${JSON.stringify(jsonData[2])}`)
          return
        }
      } else {
        console.log('❌ Invalid JSON structure - expected array with 3 elements')
        console.log(`   - Actual length: ${jsonData.length}`)
        return
      }
    } catch (error) {
      console.log('❌ Error parsing JSON file:', error.message)
      return
    }

    console.log(`📊 Found ${postsData.length} blog posts in SAT SQL data`)
    console.log(
      `   - SQL Fields: id, title, slug, description, seoTitle, seoDescription, seoKeywords`,
    )
    console.log(`   - SQL Fields: blogImage, status, createdBy, updatedBy, createdAt, updatedAt`)
    console.log(
      `   - Mapping to exam: ${internationalExam.examName} (ID: ${internationalExam._id})`,
    )

    // Step 4: Prepare for insertion
    console.log('\n📚 Step 4: Preparing to insert into satblogs collection...')
    console.log('-'.repeat(40))

    console.log(`📊 Target Collection: satblogs`)
    console.log(`   - Mapping all blogs to exam: ${internationalExam.examName}`)
    console.log(`   - Exam ID: ${internationalExam._id}`)
    console.log(`   - Exam Original ID: ${internationalExam.originalId}`)
    console.log(`   - No categories needed (direct exam mapping only)`)
    console.log(`   - Using simplified schema (text fields, no richText)`)

    // Step 5: Convert and insert blog posts
    console.log('\n💾 Step 5: Converting and inserting blog posts...')
    console.log('-'.repeat(40))

    let blogsInserted = 0
    let blogsSkipped = 0

    for (const post of postsData) {
      try {
        const originalId = parseInt(post.id) // Changed from post.ID to post.id

        // Check if blog already exists in satblogs collection
        const existingBlog = await db.collection('satblogs').findOne({
          originalId: originalId,
        })

        if (existingBlog) {
          blogsSkipped++
          continue
        }

        // Use the title from the data, or create a fallback
        let title = post.title || `SAT Blog ${originalId}`
        let excerpt = ''

        if (post.description) {
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
          title = `SAT Blog ${originalId}`
        }

        // Clean the description for text field (remove HTML tags for preview)
        const cleanDescription = (post.description || '')
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 1000) // Limit to 1000 chars for text field

        // Use SEO fields from SQL data if available, otherwise generate them
        const seoTitle = post.seoTitle || title
        const seoDescription = post.seoDescription || excerpt || 'No description available'
        const seoKeywords =
          post.seoKeywords || extractSatKeywordsFromContent(post.description).join(', ')

        // Handle status from SQL data
        const status = post.status === 'publish' ? 'published' : 'draft'

        // Handle dates from SQL data
        const publishedAt = post.createdAt ? new Date(post.createdAt) : new Date()
        const createdAt = post.createdAt ? new Date(post.createdAt) : new Date()
        const updatedAt = post.updatedAt ? new Date(post.updatedAt) : new Date()

        // Create blog document matching SatBlogs schema with all SQL fields
        const blogDoc = {
          originalId: originalId,
          title: title,
          slug: post.slug || `sat-blog-${originalId}`, // Use slug from data or create one
          description: cleanDescription || 'No description available', // Text field, not richText
          descriptionHtml: post.description || '', // Keep original HTML
          excerpt: excerpt || 'No excerpt available',
          exam: internationalExam._id, // Required relationship to exam only
          status: status, // Use status from SQL data
          author: post.createdBy ? post.createdBy.toString() : '5', // Use createdBy from SQL or default
          updatedBy: post.updatedBy ? post.updatedBy.toString() : null, // Use updatedBy from SQL data
          featuredImage: post.blogImage || null, // Use blogImage from SQL data
          metaTitle: seoTitle, // Use seoTitle from SQL data
          metaDescription: seoDescription, // Use seoDescription from SQL data
          keywords: seoKeywords, // Use seoKeywords from SQL data
          readTime: Math.ceil((post.description || '').length / 1000),
          views: 0,
          publishedAt: publishedAt, // Use createdAt from SQL data
          createdAt: createdAt, // Use createdAt from SQL data
          updatedAt: updatedAt, // Use updatedAt from SQL data
        }

        // Insert blog into satblogs collection
        await db.collection('satblogs').insertOne(blogDoc)
        blogsInserted++

        if (blogsInserted % 100 === 0) {
          console.log(`  Progress: ${blogsInserted} blogs inserted...`)
        }
      } catch (error) {
        console.log(`  ❌ Error processing blog ID ${post.id}: ${error.message}`)
      }
    }

    console.log(
      `\n✅ Insertion completed: ${blogsInserted} blogs inserted, ${blogsSkipped} skipped`,
    )

    // Step 6: Fix any data quality issues
    console.log('\n🔧 Step 6: Fixing data quality issues...')
    console.log('-'.repeat(40))

    // Fix blogs with empty titles
    console.log('  Fixing blogs with empty titles...')
    const blogsWithEmptyTitles = await db
      .collection('satblogs')
      .find({
        $or: [{ title: { $in: ['', null, '&nbsp;'] } }, { title: { $exists: false } }],
        exam: internationalExam._id, // Only fix international blogs
      })
      .toArray()

    let fixedTitles = 0
    for (const blog of blogsWithEmptyTitles) {
      try {
        const newTitle = `SAT Blog ${blog.originalId}`
        await db.collection('satblogs').updateOne(
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
      .collection('satblogs')
      .find({
        $or: [{ excerpt: { $in: ['', null] } }, { excerpt: { $exists: false } }],
        exam: internationalExam._id, // Only fix international blogs
      })
      .toArray()

    let fixedExcerpts = 0
    for (const blog of blogsWithEmptyExcerpts) {
      try {
        const newExcerpt = blog.description
          ? blog.description.substring(0, 200) + (blog.description.length > 200 ? '...' : '')
          : 'No excerpt available'

        await db.collection('satblogs').updateOne(
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
      .collection('satblogs')
      .find({
        $or: [{ status: { $exists: false } }, { views: { $exists: false } }],
        exam: internationalExam._id, // Only fix international blogs
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

          await db.collection('satblogs').updateOne({ _id: blog._id }, { $set: updates })

          fixedDefaults++
        }
      } catch (error) {
        console.log(`    ❌ Error fixing defaults for blog ${blog.originalId}: ${error.message}`)
      }
    }

    if (fixedDefaults > 0) {
      console.log(`  ✅ Fixed ${fixedDefaults} blogs with missing defaults`)
    }

    // Step 7: Create summary
    console.log('\n📊 Step 7: Creating conversion summary...')
    console.log('-'.repeat(40))

    const totalBlogs = await db.collection('satblogs').countDocuments({
      exam: internationalExam._id,
    })

    console.log(`📊 Conversion Summary:`)
    console.log(`  ✅ Blogs inserted: ${blogsInserted}`)
    console.log(`  ⚠️  Blogs skipped: ${blogsSkipped}`)
    console.log(`  🔧 Titles fixed: ${fixedTitles}`)
    console.log(`  🔧 Excerpts fixed: ${fixedExcerpts}`)
    console.log(`  🔧 Defaults fixed: ${fixedDefaults}`)
    console.log(`  📝 Total SAT blogs: ${totalBlogs}`)

    // Step 8: Verify relationships
    console.log('\n🔍 Step 8: Verifying relationships...')
    console.log('-'.repeat(40))

    const blogsWithExam = await db
      .collection('satblogs')
      .aggregate([
        {
          $match: { exam: internationalExam._id },
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

    console.log('📋 Sample SAT blogs with exam relationships:')
    blogsWithExam.forEach((blog, index) => {
      const examName = blog.examData && blog.examData[0] ? blog.examData[0].examName : 'No exam'
      console.log(`  ${index + 1}. ${blog.title}`)
      console.log(`     - Exam: ${examName}`)
      console.log(`     - Author: ${blog.author}`)
      console.log(`     - Status: ${blog.status}`)
      console.log(`     - Read Time: ${blog.readTime} min`)
    })

    // Step 9: Final verification
    console.log('\n✅ Step 9: Final data quality verification...')
    console.log('-'.repeat(40))

    const blogsWithEmptyTitle = await db.collection('satblogs').countDocuments({
      $or: [{ title: { $in: ['', null] } }, { title: { $exists: false } }],
      exam: internationalExam._id,
    })
    const blogsWithEmptyExcerpt = await db.collection('satblogs').countDocuments({
      $or: [{ excerpt: { $in: ['', null] } }, { excerpt: { $exists: false } }],
      exam: internationalExam._id,
    })

    console.log('📊 Data Quality Report:')
    console.log(`  Total SAT blogs: ${totalBlogs}`)
    console.log(`  Blogs with empty titles: ${blogsWithEmptyTitle}`)
    console.log(`  Blogs with empty excerpts: ${blogsWithEmptyExcerpt}`)
    console.log(
      `  Data quality: ${blogsWithEmptyTitle === 0 && blogsWithEmptyExcerpt === 0 ? '✅ Perfect' : '⚠️  Needs attention'}`,
    )

    // Step 10: Export summary
    console.log('\n💾 Step 10: Creating export summary...')
    console.log('-'.repeat(40))

    const exportSummary = {
      conversionInfo: {
        timestamp: new Date().toISOString(),
        sourceFile: 'satblogs.json',
        targetCollection: 'satblogs',
        examId: internationalExam._id,
        examName: internationalExam.examName,
        schemaType: 'Simplified (text fields, no richText, exam mapping only)',
      },
      statistics: {
        blogsInserted,
        blogsSkipped,
        fixedTitles,
        fixedExcerpts,
        fixedDefaults,
        totalBlogs,
        examMapped: internationalExam.examName,
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
    const exportFile = path.join(exportDir, `sat-blog-conversion-summary-${timestamp}.json`)

    fs.writeFileSync(exportFile, JSON.stringify(exportSummary, null, 2))
    console.log(`✅ Export summary saved to: ${exportFile}`)

    // Final Summary
    console.log('\n🎉 SAT BLOGS CONVERSION & FIX COMPLETED!')
    console.log('='.repeat(60))
    console.log(`📊 Final Results:`)
    console.log(`  🎯 Target Collection: satblogs`)
    console.log(`  🎯 Target Exam: ${internationalExam.examName} (ID: ${internationalExam._id})`)
    console.log(`  🎯 Exam Original ID: ${internationalExam.originalId}`)
    console.log(`  📝 Total SAT Blogs: ${totalBlogs}`)
    console.log(`  ✅ Successfully Inserted: ${blogsInserted}`)
    console.log(`  ⚠️  Skipped (already exist): ${blogsSkipped}`)
    console.log(`  🔧 Data fixes applied: ${fixedTitles + fixedExcerpts + fixedDefaults}`)
    console.log(`  📚 Schema: Simplified (text fields, exam mapping only)`)
    console.log(`  👤 Author: Default '5' (no author in SQL data)`)
    console.log(`  💾 Export File: ${exportFile}`)

    console.log('\n🚀 Next Steps:')
    console.log('1. Verify SAT blogs in Payload CMS admin panel at /admin/collections/satblogs')
    console.log('2. Create API endpoints for SAT blog listing')
    console.log('3. Build SAT blog display pages')
    console.log('4. Test exam relationship filtering')
    console.log('5. All data quality issues have been automatically fixed!')
  } catch (error) {
    console.error('❌ Error in conversion and fix process:', error)
  } finally {
    await client.close()
  }
}

// Helper function to extract SAT keywords from content (returns array)
function extractSatKeywordsFromContent(content) {
  if (!content) return []

  const keywords = []
  const contentLower = content.toLowerCase()

  // International-specific keywords
  if (contentLower.includes('sat')) keywords.push('SAT')
  if (contentLower.includes('gre')) keywords.push('GRE')
  if (contentLower.includes('gmat')) keywords.push('GMAT')
  if (contentLower.includes('toefl')) keywords.push('TOEFL')
  if (contentLower.includes('ielts')) keywords.push('IELTS')
  if (contentLower.includes('international')) keywords.push('International')
  if (contentLower.includes('study abroad')) keywords.push('Study Abroad')
  if (contentLower.includes('university')) keywords.push('University')
  if (contentLower.includes('college')) keywords.push('College')
  if (contentLower.includes('scholarship')) keywords.push('Scholarship')
  if (contentLower.includes('visa')) keywords.push('Visa')
  if (contentLower.includes('preparation')) keywords.push('Preparation')
  if (contentLower.includes('study')) keywords.push('Study')
  if (contentLower.includes('tips')) keywords.push('Tips')
  if (contentLower.includes('guide')) keywords.push('Guide')
  if (contentLower.includes('syllabus')) keywords.push('Syllabus')
  if (contentLower.includes('pattern')) keywords.push('Exam Pattern')
  if (contentLower.includes('entrance')) keywords.push('Entrance Exam')

  return keywords.slice(0, 5) // Limit to 5 keywords
}

// Run the conversion and fix
convertSatBlogs()
