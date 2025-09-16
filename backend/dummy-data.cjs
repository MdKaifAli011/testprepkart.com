// Dummy Data Insertion Script for TestPrepKart
// Run this script to populate your database with sample data

const { getPayload } = require('payload')
const config = require('./src/payload.config')

async function insertDummyData() {
  const payload = await getPayload({ config })

  try {
    console.log('🚀 Starting dummy data insertion...')

    // 1. Create Exam Categories
    console.log('📚 Creating exam categories...')
    const examCategories = await Promise.all([
      payload.create({
        collection: 'exam-category',
        data: {
          categoryName: 'Engineering Entrance',
          seo_title: 'Engineering Entrance Exam Categories',
          seo_keyword: 'JEE, engineering, entrance exam',
          seo_description: 'Comprehensive guide for engineering entrance exams including JEE Main and Advanced',
        },
      }),
      payload.create({
        collection: 'exam-category',
        data: {
          categoryName: 'Medical Entrance',
          seo_title: 'Medical Entrance Exam Categories',
          seo_keyword: 'NEET, medical, entrance exam',
          seo_description: 'Complete preparation for medical entrance exams including NEET',
        },
      }),
      payload.create({
        collection: 'exam-category',
        data: {
          categoryName: 'International Exams',
          seo_title: 'International Exam Categories',
          seo_keyword: 'SAT, IB, international exams',
          seo_description: 'Preparation materials for international exams like SAT and IB',
        },
      }),
      payload.create({
        collection: 'exam-category',
        data: {
          categoryName: 'Board Exams',
          seo_title: 'Board Exam Categories',
          seo_keyword: 'CBSE, board exams, class 10, class 12',
          seo_description: 'Study materials and resources for CBSE board exams',
        },
      }),
    ])

    // 2. Create Exams
    console.log('📝 Creating exams...')
    const exams = await Promise.all([
      payload.create({
        collection: 'exam',
        data: {
          examName: 'JEE Main 2024',
          category: examCategories[0].id,
        },
      }),
      payload.create({
        collection: 'exam',
        data: {
          examName: 'JEE Advanced 2024',
          category: examCategories[0].id,
        },
      }),
      payload.create({
        collection: 'exam',
        data: {
          examName: 'NEET 2024',
          category: examCategories[1].id,
        },
      }),
      payload.create({
        collection: 'exam',
        data: {
          examName: 'SAT 2024',
          category: examCategories[2].id,
        },
      }),
      payload.create({
        collection: 'exam',
        data: {
          examName: 'CBSE Class 12 Physics',
          category: examCategories[3].id,
        },
      }),
    ])

    // 3. Create Contacts/Leads
    console.log('👥 Creating leads...')
    const leads = await Promise.all([
      payload.create({
        collection: 'leads',
        data: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          mobile: '9876543210',
          class: '12th',
          message: 'Interested in JEE preparation course',
        },
      }),
      payload.create({
        collection: 'leads',
        data: {
          name: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          mobile: '9876543211',
          class: '11th',
          message: 'Looking for NEET coaching',
        },
      }),
      payload.create({
        collection: 'leads',
        data: {
          name: 'Michael Brown',
          email: 'michael.brown@example.com',
          mobile: '9876543212',
          class: '10th',
          message: 'Need help with CBSE board exams',
        },
      }),
      payload.create({
        collection: 'leads',
        data: {
          name: 'Emily Davis',
          email: 'emily.davis@example.com',
          mobile: '9876543213',
          class: '12th',
          message: 'Interested in SAT preparation',
        },
      }),
      payload.create({
        collection: 'leads',
        data: {
          name: 'David Miller',
          email: 'david.miller@example.com',
          mobile: '9876543214',
          class: '11th',
          message: 'Looking for comprehensive study materials',
        },
      }),
    ])

    // 4. Create Posts
    console.log('📰 Creating posts...')
    const posts = await Promise.all([
      payload.create({
        collection: 'posts',
        data: {
          title: 'JEE Main 2024 Preparation Strategy',
          content: 'Complete guide to crack JEE Main 2024 with effective study strategies and time management tips.',
          category: 'Study Tips',
          status: 'published',
        },
      }),
      payload.create({
        collection: 'posts',
        data: {
          title: 'NEET 2024 Important Topics',
          content: 'Focus on these high-weightage topics to maximize your NEET 2024 score.',
          category: 'Exam Guide',
          status: 'published',
        },
      }),
      payload.create({
        collection: 'posts',
        data: {
          title: 'SAT Math Section Tips',
          content: 'Master the SAT Math section with these proven strategies and practice techniques.',
          category: 'International Exams',
          status: 'published',
        },
      }),
      payload.create({
        collection: 'posts',
        data: {
          title: 'CBSE Board Exam Preparation',
          content: 'Complete roadmap for CBSE Class 12 board exam preparation.',
          category: 'Board Exams',
          status: 'draft',
        },
      }),
    ])

    // 5. Create Download Menus
    console.log('📁 Creating download menus...')
    const downloadMenus = await Promise.all([
      payload.create({
        collection: 'download-menus',
        data: {
          menuName: 'JEE Study Materials',
          examType: 'jee',
          description: 'Comprehensive study materials for JEE preparation',
          active: true,
          sortOrder: 1,
        },
      }),
      payload.create({
        collection: 'download-menus',
        data: {
          menuName: 'NEET Question Papers',
          examType: 'neet',
          description: 'Previous year question papers and mock tests',
          active: true,
          sortOrder: 2,
        },
      }),
      payload.create({
        collection: 'download-menus',
        data: {
          menuName: 'SAT Practice Tests',
          examType: 'sat',
          description: 'Official SAT practice tests and sample questions',
          active: true,
          sortOrder: 3,
        },
      }),
    ])

    // 6. Create Sub Folders
    console.log('📂 Creating sub folders...')
    const subFolders = await Promise.all([
      payload.create({
        collection: 'sub-folders',
        data: {
          name: 'Mathematics',
          description: 'Math study materials and practice problems',
          parentFolder: downloadMenus[0].id,
        },
      }),
      payload.create({
        collection: 'sub-folders',
        data: {
          name: 'Physics',
          description: 'Physics concepts and numerical problems',
          parentFolder: downloadMenus[0].id,
        },
      }),
      payload.create({
        collection: 'sub-folders',
        data: {
          name: 'Chemistry',
          description: 'Chemistry theory and practice questions',
          parentFolder: downloadMenus[0].id,
        },
      }),
      payload.create({
        collection: 'sub-folders',
        data: {
          name: 'Biology',
          description: 'Biology study materials for NEET',
          parentFolder: downloadMenus[1].id,
        },
      }),
    ])

    // 7. Create Media Files
    console.log('🖼️ Creating media files...')
    const mediaFiles = await Promise.all([
      payload.create({
        collection: 'media',
        data: {
          filename: 'jee-main-syllabus.pdf',
          alt: 'JEE Main Syllabus 2024',
          type: 'document',
        },
      }),
      payload.create({
        collection: 'media',
        data: {
          filename: 'neet-sample-paper.jpg',
          alt: 'NEET Sample Paper',
          type: 'image',
        },
      }),
      payload.create({
        collection: 'media',
        data: {
          filename: 'sat-math-formulas.pdf',
          alt: 'SAT Math Formulas Sheet',
          type: 'document',
        },
      }),
    ])

    // 8. Update Exam Categories with Exams
    console.log('🔗 Linking exams to categories...')
    await Promise.all([
      payload.update({
        collection: 'exam-category',
        id: examCategories[0].id,
        data: {
          exams: [exams[0].id, exams[1].id],
        },
      }),
      payload.update({
        collection: 'exam-category',
        id: examCategories[1].id,
        data: {
          exams: [exams[2].id],
        },
      }),
      payload.update({
        collection: 'exam-category',
        id: examCategories[2].id,
        data: {
          exams: [exams[3].id],
        },
      }),
      payload.update({
        collection: 'exam-category',
        id: examCategories[3].id,
        data: {
          exams: [exams[4].id],
        },
      }),
    ])

    console.log('✅ Dummy data insertion completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- ${examCategories.length} Exam Categories created`)
    console.log(`- ${exams.length} Exams created`)
    console.log(`- ${leads.length} Leads created`)
    console.log(`- ${posts.length} Posts created`)
    console.log(`- ${downloadMenus.length} Download Menus created`)
    console.log(`- ${subFolders.length} Sub Folders created`)
    console.log(`- ${mediaFiles.length} Media Files created`)

  } catch (error) {
    console.error('❌ Error inserting dummy data:', error)
  } finally {
    process.exit(0)
  }
}

// Run the script
insertDummyData()
