const { MongoClient, ObjectId } = require('mongodb')
const fs = require('fs')
const path = require('path')

async function importSatComments() {
  const uri = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/Demo_testprepkart_backend'
  const client = new MongoClient(uri)

  try {
    console.log('💬 Importing SAT Comments with Blog Relationships')
    console.log('='.repeat(60))

    await client.connect()
    console.log('✅ Database connection successful!')

    const db = client.db()

    // Step 1: Read the SAT comments JSON file
    console.log('\n📄 Step 1: Reading SAT comments data...')
    console.log('-'.repeat(40))

    const commentsFilePath = path.join(process.cwd(), '..', 'sql', 'sat_comments.json')

    if (!fs.existsSync(commentsFilePath)) {
      console.log('❌ Comments file not found:', commentsFilePath)
      return
    }

    console.log('✅ Reading comments file...')
    const fileContent = fs.readFileSync(commentsFilePath, 'utf8')

    // Parse the JSON file
    let commentsData
    try {
      commentsData = JSON.parse(fileContent)
    } catch (error) {
      console.log('❌ Error parsing JSON file:', error.message)
      return
    }

    // Find the data array containing the actual comments
    let comments = []
    for (const item of commentsData) {
      if (item.type === 'table' && item.data && Array.isArray(item.data)) {
        comments = item.data
        break
      }
    }

    // Filter for valid comments
    comments = comments.filter(
      (item) =>
        item.comment_ID && item.comment_post_ID && item.comment_author && item.comment_content,
    )

    console.log(`📊 Found ${comments.length} comments in JSON file`)

    if (comments.length === 0) {
      console.log('❌ No valid comments found in file!')
      return
    }

    // Step 2: Get all SAT blogs to create mapping
    console.log('\n🔍 Step 2: Creating blog ID mapping...')
    console.log('-'.repeat(40))

    const satBlogs = await db.collection('satblogs').find({}).toArray()
    console.log(`📚 Found ${satBlogs.length} SAT blogs in database`)

    // Create mapping from originalId to MongoDB _id
    const blogMapping = {}
    satBlogs.forEach((blog) => {
      if (blog.originalId) {
        blogMapping[blog.originalId] = blog._id
      }
    })

    console.log(`🔗 Created mapping for ${Object.keys(blogMapping).length} blogs`)

    // Step 3: Analyze comments and prepare for import
    console.log('\n📊 Step 3: Analyzing comments...')
    console.log('-'.repeat(40))

    const analysis = {
      totalComments: comments.length,
      commentsWithValidBlogs: 0,
      commentsWithoutBlogs: 0,
      spamComments: 0,
      validComments: 0,
      uniquePostIds: new Set(),
      uniqueAuthors: new Set(),
    }

    // Analyze comments
    comments.forEach((comment) => {
      const postId = parseInt(comment.comment_post_ID)
      analysis.uniquePostIds.add(postId)
      analysis.uniqueAuthors.add(comment.comment_author)

      if (blogMapping[postId]) {
        analysis.commentsWithValidBlogs++
      } else {
        analysis.commentsWithoutBlogs++
      }

      // Detect spam comments
      if (isSpamComment(comment)) {
        analysis.spamComments++
      } else {
        analysis.validComments++
      }
    })

    console.log('📈 Comments Analysis:')
    console.log(`   Total Comments: ${analysis.totalComments}`)
    console.log(`   Comments with valid blogs: ${analysis.commentsWithValidBlogs}`)
    console.log(`   Comments without blogs: ${analysis.commentsWithoutBlogs}`)
    console.log(`   Valid comments: ${analysis.validComments}`)
    console.log(`   Spam comments: ${analysis.spamComments}`)
    console.log(`   Unique post IDs: ${analysis.uniquePostIds.size}`)
    console.log(`   Unique authors: ${analysis.uniqueAuthors.size}`)

    // Step 4: Import comments
    console.log('\n💾 Step 4: Importing comments...')
    console.log('-'.repeat(40))

    let commentsInserted = 0
    let commentsSkipped = 0
    let commentsWithErrors = 0

    for (const comment of comments) {
      try {
        const originalId = parseInt(comment.comment_ID)
        const postId = parseInt(comment.comment_post_ID)

        // Check if comment already exists
        const existingComment = await db.collection('sat_comments').findOne({
          originalId: originalId,
        })

        if (existingComment) {
          commentsSkipped++
          continue
        }

        // Find the related blog
        const relatedBlogId = blogMapping[postId]
        if (!relatedBlogId) {
          console.log(`⚠️  Comment ${originalId} references non-existent blog ID: ${postId}`)
          commentsWithErrors++
          continue
        }

        // Detect spam
        const isSpam = isSpamComment(comment)

        // Parse comment date
        let commentDate
        try {
          commentDate = new Date(comment.comment_date)
          if (isNaN(commentDate.getTime())) {
            commentDate = new Date()
          }
        } catch (error) {
          commentDate = new Date()
        }

        // Create comment document
        const commentDoc = {
          originalId: originalId,
          comment_post_ID: postId,
          blog: relatedBlogId, // MongoDB ObjectId reference
          comment_author: comment.comment_author || 'Anonymous',
          comment_author_email: comment.comment_author_email || '',
          comment_content: comment.comment_content || '',
          comment_date: commentDate,
          status: isSpam ? 'spam' : 'approved',
          isSpam: isSpam,
          isReply: false, // Could be enhanced to detect replies
          parentComment: null,
          likes: 0,
          dislikes: 0,
          ipAddress: null,
          userAgent: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        // Insert comment
        await db.collection('sat_comments').insertOne(commentDoc)
        commentsInserted++

        if (commentsInserted % 100 === 0) {
          console.log(`  Progress: ${commentsInserted} comments inserted...`)
        }
      } catch (error) {
        console.log(`  ❌ Error processing comment ${comment.comment_ID}: ${error.message}`)
        commentsWithErrors++
      }
    }

    console.log(
      `\n✅ Import completed: ${commentsInserted} comments inserted, ${commentsSkipped} skipped, ${commentsWithErrors} errors`,
    )

    // Step 5: Verify relationships
    console.log('\n🔍 Step 5: Verifying relationships...')
    console.log('-'.repeat(40))

    const commentsWithBlogs = await db
      .collection('sat_comments')
      .aggregate([
        {
          $lookup: {
            from: 'satblogs',
            localField: 'blog',
            foreignField: '_id',
            as: 'blogData',
          },
        },
        {
          $match: {
            'blogData.0': { $exists: true },
          },
        },
        {
          $limit: 5,
        },
      ])
      .toArray()

    console.log('📋 Sample comments with blog relationships:')
    commentsWithBlogs.forEach((comment, index) => {
      const blog = comment.blogData[0]
      console.log(`  ${index + 1}. Comment by: ${comment.comment_author}`)
      console.log(`     - Blog: "${blog.title}"`)
      console.log(`     - Blog Original ID: ${blog.originalId}`)
      console.log(`     - Comment Date: ${new Date(comment.comment_date).toLocaleDateString()}`)
      console.log(`     - Status: ${comment.status}`)
      console.log(`     - Content: ${comment.comment_content.substring(0, 100)}...`)
    })

    // Step 6: Generate final statistics
    console.log('\n📊 Step 6: Final statistics...')
    console.log('-'.repeat(40))

    const finalStats = {
      totalComments: await db.collection('sat_comments').countDocuments(),
      approvedComments: await db.collection('sat_comments').countDocuments({ status: 'approved' }),
      spamComments: await db.collection('sat_comments').countDocuments({ status: 'spam' }),
      commentsWithBlogs: await db
        .collection('sat_comments')
        .countDocuments({ blog: { $exists: true } }),
      commentsWithoutBlogs: await db
        .collection('sat_comments')
        .countDocuments({ blog: { $exists: false } }),
    }

    console.log('📈 Final Statistics:')
    console.log(`   Total Comments in DB: ${finalStats.totalComments}`)
    console.log(`   Approved Comments: ${finalStats.approvedComments}`)
    console.log(`   Spam Comments: ${finalStats.spamComments}`)
    console.log(`   Comments with Blog Relations: ${finalStats.commentsWithBlogs}`)
    console.log(`   Comments without Blog Relations: ${finalStats.commentsWithoutBlogs}`)

    // Step 7: Export summary
    console.log('\n💾 Step 7: Creating import summary...')
    console.log('-'.repeat(40))

    const importSummary = {
      importInfo: {
        timestamp: new Date().toISOString(),
        sourceFile: 'sat_comments.json',
        targetCollection: 'sat_comments',
        importType: 'comments_with_blog_relationships',
      },
      analysis: {
        totalCommentsInFile: analysis.totalComments,
        commentsWithValidBlogs: analysis.commentsWithValidBlogs,
        commentsWithoutBlogs: analysis.commentsWithoutBlogs,
        validComments: analysis.validComments,
        spamComments: analysis.spamComments,
        uniquePostIds: analysis.uniquePostIds.size,
        uniqueAuthors: analysis.uniqueAuthors.size,
      },
      importResults: {
        commentsInserted,
        commentsSkipped,
        commentsWithErrors,
      },
      finalStats,
    }

    // Create exports directory if it doesn't exist
    const exportDir = path.join(process.cwd(), 'exports')
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir)
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const exportFile = path.join(exportDir, `sat-comments-import-summary-${timestamp}.json`)

    fs.writeFileSync(exportFile, JSON.stringify(importSummary, null, 2))
    console.log(`✅ Import summary saved to: ${exportFile}`)

    // Final Summary
    console.log('\n🎉 SAT COMMENTS IMPORT COMPLETED!')
    console.log('='.repeat(60))
    console.log(`📊 Summary:`)
    console.log(`   📝 Total Comments Imported: ${commentsInserted}`)
    console.log(`   ✅ Approved Comments: ${finalStats.approvedComments}`)
    console.log(`   🚫 Spam Comments: ${finalStats.spamComments}`)
    console.log(`   🔗 With Blog Relations: ${finalStats.commentsWithBlogs}`)
    console.log(`   ⚠️  Without Blog Relations: ${finalStats.commentsWithoutBlogs}`)
    console.log(`   💾 Summary File: ${exportFile}`)

    console.log('\n🚀 Next Steps:')
    console.log('1. Review comments in Payload CMS admin panel at /admin/collections/sat_comments')
    console.log('2. Verify blog-comment relationships are working correctly')
    console.log('3. Set up comment moderation workflows')
    console.log('4. Create API endpoints for comment display and management')

    return {
      commentsInserted,
      finalStats,
      importSummary,
      exportFile,
    }
  } catch (error) {
    console.error('❌ Error importing SAT comments:', error)
    throw error
  } finally {
    await client.close()
  }
}

// Helper function to detect spam comments
function isSpamComment(comment) {
  const content = (comment.comment_content || '').toLowerCase()
  const author = (comment.comment_author || '').toLowerCase()
  const email = (comment.comment_author_email || '').toLowerCase()

  // Spam indicators
  const spamKeywords = [
    'http://',
    'https://',
    'www.',
    '.com',
    '.net',
    '.org',
    'buy now',
    'click here',
    'free money',
    'viagra',
    'casino',
    'lottery',
    'winner',
    'congratulations',
    'click this link',
    'make money',
    'work from home',
    'get rich',
    'seo services',
    'backlinks',
    'increase traffic',
    'social media marketing',
  ]

  const spamAuthors = ['spam', 'bot', 'admin', 'test', 'fake', 'dummy']

  // Check for spam keywords in content
  const hasSpamKeywords = spamKeywords.some((keyword) => content.includes(keyword))

  // Check for spam author names
  const hasSpamAuthor = spamAuthors.some((spamAuthor) => author.includes(spamAuthor))

  // Check for suspicious email patterns
  const hasSuspiciousEmail =
    email.includes('@') &&
    (email.includes('spam') ||
      email.includes('bot') ||
      email.includes('fake') ||
      email.includes('test'))

  // Check for very short or very long content
  const contentLength = content.length
  const isSuspiciousLength = contentLength < 10 || contentLength > 2000

  // Check for repeated characters or words
  const hasRepeatedContent = /(.)\1{4,}/.test(content) || /(\b\w+\b)(\s+\1){3,}/.test(content)

  return (
    hasSpamKeywords ||
    hasSpamAuthor ||
    hasSuspiciousEmail ||
    isSuspiciousLength ||
    hasRepeatedContent
  )
}

// Run the import function
if (require.main === module) {
  importSatComments()
    .then((result) => {
      console.log('\n✅ Script completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error)
      process.exit(1)
    })
}

module.exports = { importSatComments }


