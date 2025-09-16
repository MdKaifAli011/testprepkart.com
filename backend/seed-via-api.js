// Simple script to seed data via API calls
// Make sure your server is running first: npm run dev

const baseUrl = 'http://localhost:3000/api'

async function createExamCategory(data) {
  const response = await fetch(`${baseUrl}/exam-category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

async function createExam(data) {
  const response = await fetch(`${baseUrl}/exam`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

async function createLead(data) {
  const response = await fetch(`${baseUrl}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

async function createPost(data) {
  const response = await fetch(`${baseUrl}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

async function createDownloadMenu(data) {
  const response = await fetch(`${baseUrl}/download-menus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

async function createSubFolder(data) {
  const response = await fetch(`${baseUrl}/sub-folders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

async function createMedia(data) {
  const response = await fetch(`${baseUrl}/media`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

async function seedData() {
  console.log('🚀 Starting data seeding via API...')
  console.log('⚠️  Make sure your server is running: npm run dev')
  
  try {
    // 1. Create Exam Categories
    console.log('📚 Creating exam categories...')
    const engineeringCategory = await createExamCategory({
      categoryName: 'Engineering Entrance',
      seo_title: 'Engineering Entrance Exam Categories',
      seo_keyword: 'JEE, engineering, entrance exam',
      seo_description: 'Comprehensive guide for engineering entrance exams including JEE Main and Advanced',
    })
    
    const medicalCategory = await createExamCategory({
      categoryName: 'Medical Entrance',
      seo_title: 'Medical Entrance Exam Categories',
      seo_keyword: 'NEET, medical, entrance exam',
      seo_description: 'Complete preparation for medical entrance exams including NEET',
    })
    
    const internationalCategory = await createExamCategory({
      categoryName: 'International Exams',
      seo_title: 'International Exam Categories',
      seo_keyword: 'SAT, IB, international exams',
      seo_description: 'Preparation materials for international exams like SAT and IB',
    })
    
    const boardCategory = await createExamCategory({
      categoryName: 'Board Exams',
      seo_title: 'Board Exam Categories',
      seo_keyword: 'CBSE, board exams, class 10, class 12',
      seo_description: 'Study materials and resources for CBSE board exams',
    })
    
    console.log('✅ Exam categories created')
    
    // 2. Create Exams
    console.log('📝 Creating exams...')
    const jeeMain = await createExam({
      examName: 'JEE Main 2024',
      category: engineeringCategory.doc?.id || engineeringCategory.id,
    })
    
    const jeeAdvanced = await createExam({
      examName: 'JEE Advanced 2024',
      category: engineeringCategory.doc?.id || engineeringCategory.id,
    })
    
    const neet = await createExam({
      examName: 'NEET 2024',
      category: medicalCategory.doc?.id || medicalCategory.id,
    })
    
    const sat = await createExam({
      examName: 'SAT 2024',
      category: internationalCategory.doc?.id || internationalCategory.id,
    })
    
    const cbse = await createExam({
      examName: 'CBSE Class 12 Physics',
      category: boardCategory.doc?.id || boardCategory.id,
    })
    
    console.log('✅ Exams created')
    
    // 3. Create Leads
    console.log('👥 Creating leads...')
    await createLead({
      name: 'John Doe',
      email: 'john.doe@example.com',
      mobile: '9876543210',
      class: '12th',
      message: 'Interested in JEE preparation course',
    })
    
    await createLead({
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      mobile: '9876543211',
      class: '11th',
      message: 'Looking for NEET coaching',
    })
    
    await createLead({
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      mobile: '9876543212',
      class: '10th',
      message: 'Need help with CBSE board exams',
    })
    
    console.log('✅ Leads created')
    
    // 4. Create Posts
    console.log('📰 Creating posts...')
    await createPost({
      title: 'JEE Main 2024 Preparation Strategy',
      content: 'Complete guide to crack JEE Main 2024 with effective study strategies and time management tips.',
      category: 'Study Tips',
      status: 'published',
    })
    
    await createPost({
      title: 'NEET 2024 Important Topics',
      content: 'Focus on these high-weightage topics to maximize your NEET 2024 score.',
      category: 'Exam Guide',
      status: 'published',
    })
    
    console.log('✅ Posts created')
    
    // 5. Create Download Menus
    console.log('📁 Creating download menus...')
    const jeeMenu = await createDownloadMenu({
      menuName: 'JEE Study Materials',
      examType: 'jee',
      description: 'Comprehensive study materials for JEE preparation',
      active: true,
      sortOrder: 1,
    })
    
    const neetMenu = await createDownloadMenu({
      menuName: 'NEET Question Papers',
      examType: 'neet',
      description: 'Previous year question papers and mock tests',
      active: true,
      sortOrder: 2,
    })
    
    console.log('✅ Download menus created')
    
    // 6. Create Sub Folders
    console.log('📂 Creating sub folders...')
    await createSubFolder({
      name: 'Mathematics',
      description: 'Math study materials and practice problems',
      parentFolder: jeeMenu.doc?.id || jeeMenu.id,
    })
    
    await createSubFolder({
      name: 'Physics',
      description: 'Physics concepts and numerical problems',
      parentFolder: jeeMenu.doc?.id || jeeMenu.id,
    })
    
    await createSubFolder({
      name: 'Biology',
      description: 'Biology study materials for NEET',
      parentFolder: neetMenu.doc?.id || neetMenu.id,
    })
    
    console.log('✅ Sub folders created')
    
    // 7. Create Media Files
    console.log('🖼️ Creating media files...')
    await createMedia({
      filename: 'jee-main-syllabus.pdf',
      alt: 'JEE Main Syllabus 2024',
      type: 'document',
    })
    
    await createMedia({
      filename: 'neet-sample-paper.jpg',
      alt: 'NEET Sample Paper',
      type: 'image',
    })
    
    console.log('✅ Media files created')
    
    console.log('\n🎉 Data seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log('- 4 Exam Categories created')
    console.log('- 5 Exams created')
    console.log('- 3 Leads created')
    console.log('- 2 Posts created')
    console.log('- 2 Download Menus created')
    console.log('- 3 Sub Folders created')
    console.log('- 2 Media Files created')
    console.log('\n🌐 Check your admin panel at: http://localhost:3000/admin')
    
  } catch (error) {
    console.error('❌ Error seeding data:', error.message)
    console.log('\n💡 Make sure your server is running: npm run dev')
  }
}

// Run the seeding
seedData()
