const { MongoClient, ObjectId } = require('mongodb')
const fs = require('fs')
const path = require('path')

async function fetchJeeBlogsDetails() {
  const uri = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/Demo_testprepkart_backend'
  const client = new MongoClient(uri)

  try {
    console.log('🔍 Fetching JEE Blogs Details from Database')
    console.log('='.repeat(60))

    await client.connect()
    console.log('✅ Database connection successful!')

    const db = client.db()

    // Step 1: Get all JEE blogs with detailed information
    console.log('\n📚 Step 1: Fetching JEE blogs with relationships...')
    console.log('-'.repeat(40))

    const jeeBlogs = await db
      .collection('jeeblogs')
      .aggregate([
        {
          $lookup: {
            from: 'exams',
            localField: 'exam',
            foreignField: '_id',
            as: 'examData',
          },
        },
        {
          $lookup: {
            from: 'media',
            localField: 'featuredImage',
            foreignField: '_id',
            as: 'featuredImageData',
          },
        },
        {
          $sort: { createdAt: -1 }, // Sort by newest first
        },
      ])
      .toArray()

    console.log(`📊 Found ${jeeBlogs.length} JEE blogs in database`)

    if (jeeBlogs.length === 0) {
      console.log('❌ No JEE blogs found in database!')
      return
    }

    // Step 2: Display detailed information for each blog
    console.log('\n📋 Step 2: Displaying detailed blog information...')
    console.log('-'.repeat(40))

    jeeBlogs.forEach((blog, index) => {
      console.log(`\n📝 Blog ${index + 1}:`)
      console.log(`   ID: ${blog._id}`)
      console.log(`   Original ID: ${blog.originalId}`)
      console.log(`   Title: ${blog.title}`)
      console.log(`   Author: ${blog.author}`)
      console.log(`   Status: ${blog.status}`)
      console.log(`   Views: ${blog.views || 0}`)
      console.log(`   Read Time: ${blog.readTime || 'N/A'} minutes`)
      console.log(
        `   Created: ${blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'N/A'}`,
      )
      console.log(
        `   Updated: ${blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString() : 'N/A'}`,
      )
      console.log(
        `   Published: ${blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'N/A'}`,
      )

      // Exam relationship
      if (blog.examData && blog.examData.length > 0) {
        const exam = blog.examData[0]
        console.log(`   Exam: ${exam.examName} (ID: ${exam._id})`)
        console.log(`   Exam Original ID: ${exam.originalId || 'N/A'}`)
      } else {
        console.log(`   Exam: No exam relationship found`)
      }

      // Featured image
      if (blog.featuredImageData && blog.featuredImageData.length > 0) {
        const image = blog.featuredImageData[0]
        console.log(`   Featured Image: ${image.filename} (${image.mimeType})`)
        console.log(`   Image URL: ${image.url || 'N/A'}`)
      } else {
        console.log(`   Featured Image: None`)
      }

      // SEO fields
      console.log(`   Meta Title: ${blog.metaTitle || 'N/A'}`)
      console.log(
        `   Meta Description: ${blog.metaDescription ? blog.metaDescription.substring(0, 100) + '...' : 'N/A'}`,
      )
      console.log(`   Keywords: ${blog.keywords || 'N/A'}`)

      // Content preview
      console.log(`   Excerpt: ${blog.excerpt ? blog.excerpt.substring(0, 150) + '...' : 'N/A'}`)
      console.log(
        `   Description Length: ${blog.description ? blog.description.length : 0} characters`,
      )
      console.log(
        `   HTML Description Length: ${blog.descriptionHtml ? blog.descriptionHtml.length : 0} characters`,
      )
    })

    // Step 3: Generate statistics
    console.log('\n📊 Step 3: Generating statistics...')
    console.log('-'.repeat(40))

    const stats = {
      totalBlogs: jeeBlogs.length,
      publishedBlogs: jeeBlogs.filter((blog) => blog.status === 'published').length,
      draftBlogs: jeeBlogs.filter((blog) => blog.status === 'draft').length,
      archivedBlogs: jeeBlogs.filter((blog) => blog.status === 'archived').length,
      blogsWithImages: jeeBlogs.filter(
        (blog) => blog.featuredImageData && blog.featuredImageData.length > 0,
      ).length,
      blogsWithExam: jeeBlogs.filter((blog) => blog.examData && blog.examData.length > 0).length,
      totalViews: jeeBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
      averageReadTime:
        jeeBlogs.reduce((sum, blog) => sum + (blog.readTime || 0), 0) / jeeBlogs.length,
    }

    console.log('📈 JEE Blogs Statistics:')
    console.log(`   Total Blogs: ${stats.totalBlogs}`)
    console.log(`   Published: ${stats.publishedBlogs}`)
    console.log(`   Draft: ${stats.draftBlogs}`)
    console.log(`   Archived: ${stats.archivedBlogs}`)
    console.log(`   With Featured Images: ${stats.blogsWithImages}`)
    console.log(`   With Exam Relationships: ${stats.blogsWithExam}`)
    console.log(`   Total Views: ${stats.totalViews}`)
    console.log(`   Average Read Time: ${stats.averageReadTime.toFixed(1)} minutes`)

    // Step 4: Export detailed data to JSON
    console.log('\n💾 Step 4: Exporting detailed data...')
    console.log('-'.repeat(40))

    const exportData = {
      exportInfo: {
        timestamp: new Date().toISOString(),
        collection: 'jeeblogs',
        totalBlogs: jeeBlogs.length,
        exportType: 'detailed_fetch',
      },
      statistics: stats,
      blogs: jeeBlogs.map((blog) => ({
        id: blog._id,
        originalId: blog.originalId,
        title: blog.title,
        author: blog.author,
        status: blog.status,
        views: blog.views || 0,
        readTime: blog.readTime,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        publishedAt: blog.publishedAt,
        exam:
          blog.examData && blog.examData.length > 0
            ? {
                id: blog.examData[0]._id,
                name: blog.examData[0].examName,
                originalId: blog.examData[0].originalId,
              }
            : null,
        featuredImage:
          blog.featuredImageData && blog.featuredImageData.length > 0
            ? {
                id: blog.featuredImageData[0]._id,
                filename: blog.featuredImageData[0].filename,
                mimeType: blog.featuredImageData[0].mimeType,
                url: blog.featuredImageData[0].url,
              }
            : null,
        seo: {
          metaTitle: blog.metaTitle,
          metaDescription: blog.metaDescription,
          keywords: blog.keywords,
        },
        content: {
          excerpt: blog.excerpt,
          descriptionLength: blog.description ? blog.description.length : 0,
          htmlDescriptionLength: blog.descriptionHtml ? blog.descriptionHtml.length : 0,
        },
      })),
    }

    // Create exports directory if it doesn't exist
    const exportDir = path.join(process.cwd(), 'exports')
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir)
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const exportFile = path.join(exportDir, `jee-blogs-details-${timestamp}.json`)

    fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2))
    console.log(`✅ Detailed data exported to: ${exportFile}`)

    // Step 5: Prepare for comment table integration
    console.log('\n🔗 Step 5: Preparing for comment table integration...')
    console.log('-'.repeat(40))

    console.log('📋 Ready for comment table integration:')
    console.log(`   - Found ${jeeBlogs.length} JEE blogs with unique IDs`)
    console.log(`   - Each blog has an 'originalId' field for SQL relationship`)
    console.log(`   - Each blog has a MongoDB '_id' field for direct relationship`)
    console.log(`   - Comment table can reference either field for relationship`)

    // Show sample IDs for comment table reference
    console.log('\n📝 Sample blog IDs for comment table relationship:')
    jeeBlogs.slice(0, 5).forEach((blog, index) => {
      console.log(`   ${index + 1}. Blog: "${blog.title}"`)
      console.log(`      - MongoDB ID: ${blog._id}`)
      console.log(`      - Original ID: ${blog.originalId}`)
    })

    // Step 6: Data quality check
    console.log('\n🔍 Step 6: Data quality analysis...')
    console.log('-'.repeat(40))

    const qualityIssues = {
      blogsWithoutTitle: jeeBlogs.filter((blog) => !blog.title || blog.title.trim() === '').length,
      blogsWithoutExcerpt: jeeBlogs.filter((blog) => !blog.excerpt || blog.excerpt.trim() === '')
        .length,
      blogsWithoutExam: jeeBlogs.filter((blog) => !blog.examData || blog.examData.length === 0)
        .length,
      blogsWithoutDescription: jeeBlogs.filter(
        (blog) => !blog.description || blog.description.trim() === '',
      ).length,
    }

    console.log('🔍 Data Quality Report:')
    console.log(`   Blogs without title: ${qualityIssues.blogsWithoutTitle}`)
    console.log(`   Blogs without excerpt: ${qualityIssues.blogsWithoutExcerpt}`)
    console.log(`   Blogs without exam relationship: ${qualityIssues.blogsWithoutExam}`)
    console.log(`   Blogs without description: ${qualityIssues.blogsWithoutDescription}`)

    const totalIssues = Object.values(qualityIssues).reduce((sum, count) => sum + count, 0)
    console.log(`   Total quality issues: ${totalIssues}`)
    console.log(`   Data quality: ${totalIssues === 0 ? '✅ Perfect' : '⚠️  Needs attention'}`)

    // Final Summary
    console.log('\n🎉 JEE BLOGS DETAILED FETCH COMPLETED!')
    console.log('='.repeat(60))
    console.log(`📊 Summary:`)
    console.log(`   📚 Total JEE Blogs: ${jeeBlogs.length}`)
    console.log(`   ✅ Published: ${stats.publishedBlogs}`)
    console.log(`   📊 Total Views: ${stats.totalViews}`)
    console.log(`   🖼️  With Images: ${stats.blogsWithImages}`)
    console.log(`   🔗 With Exam Relations: ${stats.blogsWithExam}`)
    console.log(`   💾 Export File: ${exportFile}`)
    console.log(`   🔍 Quality Issues: ${totalIssues}`)

    console.log('\n🚀 Ready for next steps:')
    console.log('1. Review the exported JSON file for detailed blog information')
    console.log('2. Provide the comment table SQL structure')
    console.log('3. Create comment table integration script')
    console.log('4. Set up comment-blog relationships using originalId or MongoDB _id')

    return {
      blogs: jeeBlogs,
      statistics: stats,
      qualityIssues,
      exportFile,
    }
  } catch (error) {
    console.error('❌ Error fetching JEE blogs details:', error)
    throw error
  } finally {
    await client.close()
  }
}

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Run the fetch function
if (require.main === module) {
  fetchJeeBlogsDetails()
    .then((result) => {
      console.log('\n✅ Script completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error)
      process.exit(1)
    })
}

module.exports = { fetchJeeBlogsDetails }

