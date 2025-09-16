#!/usr/bin/env node

// Simple script to insert dummy data using Payload API
import { getPayload } from 'payload'
import config from './src/payload.config.js'

async function insertDummyData() {
  console.log('🚀 Starting dummy data insertion...')
  
  try {
    const payload = await getPayload({ config })
    
    // 1. Create Exam Categories first
    console.log('📚 Creating exam categories...')
    const engineeringCategory = await payload.create({
      collection: 'exam-category',
      data: {
        categoryName: 'Engineering Entrance',
        seo_title: 'Engineering Entrance Exam Categories',
        seo_keyword: 'JEE, engineering, entrance exam',
        seo_description: 'Comprehensive guide for engineering entrance exams including JEE Main and Advanced',
      },
    })
    
    const medicalCategory = await payload.create({
      collection: 'exam-category',
      data: {
        categoryName: 'Medical Entrance',
        seo_title: 'Medical Entrance Exam Categories',
        seo_keyword: 'NEET, medical, entrance exam',
        seo_description: 'Complete preparation for medical entrance exams including NEET',
      },
    })
    
    const internationalCategory = await payload.create({
      collection: 'exam-category',
      data: {
        categoryName: 'International Exams',
        seo_title: 'International Exam Categories',
        seo_keyword: 'SAT, IB, international exams',
        seo_description: 'Preparation materials for international exams like SAT and IB',
      },
    })
    
    const boardCategory = await payload.create({
      collection: 'exam-category',
      data: {
        categoryName: 'Board Exams',
        seo_title: 'Board Exam Categories',
        seo_keyword: 'CBSE, board exams, class 10, class 12',
        seo_description: 'Study materials and resources for CBSE board exams',
      },
    })
    
    // 2. Create Exams
    console.log('📝 Creating exams...')
    const jeeMain = await payload.create({
      collection: 'exam',
      data: {
        examName: 'JEE Main 2024',
        category: engineeringCategory.id,
      },
    })
    
    const jeeAdvanced = await payload.create({
      collection: 'exam',
      data: {
        examName: 'JEE Advanced 2024',
        category: engineeringCategory.id,
      },
    })
    
    const neet = await payload.create({
      collection: 'exam',
      data: {
        examName: 'NEET 2024',
        category: medicalCategory.id,
      },
    })
    
    const sat = await payload.create({
      collection: 'exam',
      data: {
        examName: 'SAT 2024',
        category: internationalCategory.id,
      },
    })
    
    const cbse = await payload.create({
      collection: 'exam',
      data: {
        examName: 'CBSE Class 12 Physics',
        category: boardCategory.id,
      },
    })
    
    // 3. Create Leads
    console.log('👥 Creating leads...')
    await payload.create({
      collection: 'leads',
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        mobile: '9876543210',
        class: '12th',
        message: 'Interested in JEE preparation course',
      },
    })
    
    await payload.create({
      collection: 'leads',
      data: {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        mobile: '9876543211',
        class: '11th',
        message: 'Looking for NEET coaching',
      },
    })
    
    await payload.create({
      collection: 'leads',
      data: {
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        mobile: '9876543212',
        class: '10th',
        message: 'Need help with CBSE board exams',
      },
    })
    
    // 4. Create Posts
    console.log('📰 Creating posts...')
    await payload.create({
      collection: 'posts',
      data: {
        title: 'JEE Main 2024 Preparation Strategy',
        content: 'Complete guide to crack JEE Main 2024 with effective study strategies and time management tips.',
        category: 'Study Tips',
        status: 'published',
      },
    })
    
    await payload.create({
      collection: 'posts',
      data: {
        title: 'NEET 2024 Important Topics',
        content: 'Focus on these high-weightage topics to maximize your NEET 2024 score.',
        category: 'Exam Guide',
        status: 'published',
      },
    })
    
    // 5. Create Download Menus
    console.log('📁 Creating download menus...')
    const jeeMenu = await payload.create({
      collection: 'download-menus',
      data: {
        menuName: 'JEE Study Materials',
        examType: 'jee',
        description: 'Comprehensive study materials for JEE preparation',
        active: true,
        sortOrder: 1,
      },
    })
    
    const neetMenu = await payload.create({
      collection: 'download-menus',
      data: {
        menuName: 'NEET Question Papers',
        examType: 'neet',
        description: 'Previous year question papers and mock tests',
        active: true,
        sortOrder: 2,
      },
    })
    
    // 6. Create Sub Folders
    console.log('📂 Creating sub folders...')
    await payload.create({
      collection: 'sub-folders',
      data: {
        name: 'Mathematics',
        description: 'Math study materials and practice problems',
        parentFolder: jeeMenu.id,
      },
    })
    
    await payload.create({
      collection: 'sub-folders',
      data: {
        name: 'Physics',
        description: 'Physics concepts and numerical problems',
        parentFolder: jeeMenu.id,
      },
    })
    
    await payload.create({
      collection: 'sub-folders',
      data: {
        name: 'Biology',
        description: 'Biology study materials for NEET',
        parentFolder: neetMenu.id,
      },
    })
    
    // 7. Create Media Files
    console.log('🖼️ Creating media files...')
    await payload.create({
      collection: 'media',
      data: {
        filename: 'jee-main-syllabus.pdf',
        alt: 'JEE Main Syllabus 2024',
        type: 'document',
      },
    })
    
    await payload.create({
      collection: 'media',
      data: {
        filename: 'neet-sample-paper.jpg',
        alt: 'NEET Sample Paper',
        type: 'image',
      },
    })
    
    // 8. Update Exam Categories with Exams
    console.log('🔗 Linking exams to categories...')
    await payload.update({
      collection: 'exam-category',
      id: engineeringCategory.id,
      data: {
        exams: [jeeMain.id, jeeAdvanced.id],
      },
    })
    
    await payload.update({
      collection: 'exam-category',
      id: medicalCategory.id,
      data: {
        exams: [neet.id],
      },
    })
    
    await payload.update({
      collection: 'exam-category',
      id: internationalCategory.id,
      data: {
        exams: [sat.id],
      },
    })
    
    await payload.update({
      collection: 'exam-category',
      id: boardCategory.id,
      data: {
        exams: [cbse.id],
      },
    })
    
    console.log('✅ Dummy data insertion completed successfully!')
    console.log('\n📊 Summary:')
    console.log('- 4 Exam Categories created')
    console.log('- 5 Exams created')
    console.log('- 3 Leads created')
    console.log('- 2 Posts created')
    console.log('- 2 Download Menus created')
    console.log('- 3 Sub Folders created')
    console.log('- 2 Media Files created')
    console.log('- All relationships linked successfully')
    
  } catch (error) {
    console.error('❌ Error inserting dummy data:', error)
  } finally {
    process.exit(0)
  }
}

// Run the script
insertDummyData()
