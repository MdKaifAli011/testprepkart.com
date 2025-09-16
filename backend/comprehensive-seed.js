// Comprehensive seed script for all collections
const baseUrl = 'http://localhost:3000/api'

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  
  if (data) {
    options.body = JSON.stringify(data)
  }
  
  const response = await fetch(`${baseUrl}${endpoint}`, options)
  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(`API Error: ${result.error || 'Unknown error'}`)
  }
  
  return result
}

// Create exam categories
async function createExamCategories() {
  console.log('📚 Creating exam categories...')
  
  const categories = [
    {
      categoryName: 'Engineering Entrance',
      seo_title: 'Engineering Entrance Exams - JEE, GATE, BITSAT',
      seo_keyword: 'engineering entrance, JEE, GATE, BITSAT, engineering exams',
      seo_description: 'Complete guide to engineering entrance exams including JEE Main, JEE Advanced, GATE, and BITSAT'
    },
    {
      categoryName: 'Medical Entrance',
      seo_title: 'Medical Entrance Exams - NEET, AIIMS, JIPMER',
      seo_keyword: 'medical entrance, NEET, AIIMS, JIPMER, medical exams',
      seo_description: 'Comprehensive preparation for medical entrance exams including NEET, AIIMS, and JIPMER'
    },
    {
      categoryName: 'International Exams',
      seo_title: 'International Exams - SAT, ACT, GRE, GMAT',
      seo_keyword: 'international exams, SAT, ACT, GRE, GMAT, study abroad',
      seo_description: 'Prepare for international exams like SAT, ACT, GRE, and GMAT for study abroad opportunities'
    },
    {
      categoryName: 'Government Exams',
      seo_title: 'Government Exams - UPSC, SSC, Banking',
      seo_keyword: 'government exams, UPSC, SSC, banking, civil services',
      seo_description: 'Complete preparation for government exams including UPSC, SSC, and banking exams'
    },
    {
      categoryName: 'School Level',
      seo_title: 'School Level Exams - CBSE, ICSE, State Boards',
      seo_keyword: 'school exams, CBSE, ICSE, state boards, class 10, class 12',
      seo_description: 'Preparation materials for school level exams including CBSE, ICSE, and state board exams'
    }
  ]
  
  const createdCategories = []
  for (const category of categories) {
    try {
      const result = await apiCall('/exam-category', 'POST', category)
      createdCategories.push(result.data)
      console.log(`✅ Created category: ${category.categoryName}`)
    } catch (error) {
      console.log(`❌ Failed to create category ${category.categoryName}:`, error.message)
    }
  }
  
  return createdCategories
}

// Create exams
async function createExams(categories) {
  console.log('📝 Creating exams...')
  
  const exams = [
    {
      examName: 'JEE Main 2024',
      category: categories.find(c => c.categoryName === 'Engineering Entrance')?.id
    },
    {
      examName: 'JEE Advanced 2024',
      category: categories.find(c => c.categoryName === 'Engineering Entrance')?.id
    },
    {
      examName: 'NEET 2024',
      category: categories.find(c => c.categoryName === 'Medical Entrance')?.id
    },
    {
      examName: 'GATE 2024',
      category: categories.find(c => c.categoryName === 'Engineering Entrance')?.id
    },
    {
      examName: 'SAT 2024',
      category: categories.find(c => c.categoryName === 'International Exams')?.id
    },
    {
      examName: 'UPSC Civil Services 2024',
      category: categories.find(c => c.categoryName === 'Government Exams')?.id
    },
    {
      examName: 'CBSE Class 12 Physics',
      category: categories.find(c => c.categoryName === 'School Level')?.id
    },
    {
      examName: 'CBSE Class 12 Chemistry',
      category: categories.find(c => c.categoryName === 'School Level')?.id
    },
    {
      examName: 'CBSE Class 12 Mathematics',
      category: categories.find(c => c.categoryName === 'School Level')?.id
    },
    {
      examName: 'ACT 2024',
      category: categories.find(c => c.categoryName === 'International Exams')?.id
    }
  ]
  
  const createdExams = []
  for (const exam of exams) {
    try {
      const result = await apiCall('/exam', 'POST', exam)
      createdExams.push(result.data)
      console.log(`✅ Created exam: ${exam.examName}`)
    } catch (error) {
      console.log(`❌ Failed to create exam ${exam.examName}:`, error.message)
    }
  }
  
  return createdExams
}

// Create leads/contacts
async function createLeads() {
  console.log('👥 Creating leads...')
  
  const leads = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      country: 'India',
      countryCode: '+91',
      mobile: '9876543210',
      class: '12',
      message: 'Interested in JEE Main preparation',
      submissionDetails: {
        ipAddress: '192.168.1.1',
        referrerUrl: 'https://google.com',
        currentUrl: 'https://testprepkart.com/contact',
        timestamp: new Date().toISOString(),
        source: 'contact-form'
      }
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      country: 'India',
      countryCode: '+91',
      mobile: '9876543211',
      class: '11',
      message: 'Looking for NEET coaching',
      submissionDetails: {
        ipAddress: '192.168.1.2',
        referrerUrl: 'https://facebook.com',
        currentUrl: 'https://testprepkart.com/neet',
        timestamp: new Date().toISOString(),
        source: 'neet-form'
      }
    },
    {
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      country: 'USA',
      countryCode: '+1',
      mobile: '5551234567',
      class: '12+',
      message: 'SAT preparation materials needed',
      submissionDetails: {
        ipAddress: '192.168.1.3',
        referrerUrl: 'https://collegeboard.org',
        currentUrl: 'https://testprepkart.com/sat',
        timestamp: new Date().toISOString(),
        source: 'sat-form'
      }
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      country: 'India',
      countryCode: '+91',
      mobile: '9876543212',
      class: '10',
      message: 'CBSE Class 10 preparation',
      submissionDetails: {
        ipAddress: '192.168.1.4',
        referrerUrl: 'https://youtube.com',
        currentUrl: 'https://testprepkart.com/cbse',
        timestamp: new Date().toISOString(),
        source: 'cbse-form'
      }
    },
    {
      name: 'David Brown',
      email: 'david.brown@example.com',
      country: 'India',
      countryCode: '+91',
      mobile: '9876543213',
      class: '12',
      message: 'GATE preparation for Computer Science',
      submissionDetails: {
        ipAddress: '192.168.1.5',
        referrerUrl: 'https://gate.iitd.ac.in',
        currentUrl: 'https://testprepkart.com/gate',
        timestamp: new Date().toISOString(),
        source: 'gate-form'
      }
    }
  ]
  
  const createdLeads = []
  for (const lead of leads) {
    try {
      const result = await apiCall('/leads', 'POST', lead)
      createdLeads.push(result.data)
      console.log(`✅ Created lead: ${lead.name}`)
    } catch (error) {
      console.log(`❌ Failed to create lead ${lead.name}:`, error.message)
    }
  }
  
  return createdLeads
}

// Create posts
async function createPosts() {
  console.log('📰 Creating posts...')
  
  const posts = [
    {
      title: 'JEE Main 2024: Complete Preparation Strategy',
      author: 'Dr. Rajesh Kumar',
      publishedDate: new Date().toISOString(),
      layout: [
        {
          blockType: 'hero',
          headline: 'JEE Main 2024: Complete Preparation Strategy',
          subheadline: 'Master the most important engineering entrance exam with our comprehensive guide',
          background: null
        },
        {
          blockType: 'richText',
          body: [
            {
              children: [
                {
                  text: 'The Joint Entrance Examination (JEE) Main is one of the most competitive engineering entrance exams in India. With over 10 lakh students appearing every year, proper preparation is crucial for success.'
                }
              ]
            }
          ]
        },
        {
          blockType: 'list',
          title: 'Key Preparation Tips',
          listType: 'bullet',
          items: [
            {
              text: 'Understand the syllabus thoroughly',
              description: 'Go through each topic and subtopic carefully'
            },
            {
              text: 'Practice previous year papers',
              description: 'Solve at least 10 years of previous papers'
            },
            {
              text: 'Take mock tests regularly',
              description: 'Attempt at least 2-3 mock tests per week'
            },
            {
              text: 'Focus on weak areas',
              description: 'Identify and work on your weak subjects'
            }
          ]
        }
      ]
    },
    {
      title: 'NEET 2024: Biology Preparation Tips',
      author: 'Dr. Priya Sharma',
      publishedDate: new Date().toISOString(),
      layout: [
        {
          blockType: 'hero',
          headline: 'NEET 2024: Biology Preparation Tips',
          subheadline: 'Excel in Biology section with these proven strategies',
          background: null
        },
        {
          blockType: 'richText',
          body: [
            {
              children: [
                {
                  text: 'Biology is the highest scoring subject in NEET, contributing 360 marks out of 720. Here are some effective strategies to maximize your score in this section.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'SAT Math: Formula Sheet and Tips',
      author: 'Prof. Michael Chen',
      publishedDate: new Date().toISOString(),
      layout: [
        {
          blockType: 'hero',
          headline: 'SAT Math: Formula Sheet and Tips',
          subheadline: 'Essential formulas and strategies for SAT Mathematics',
          background: null
        },
        {
          blockType: 'richText',
          body: [
            {
              children: [
                {
                  text: 'The SAT Math section tests your knowledge of algebra, geometry, and basic trigonometry. Here are the essential formulas you need to know.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
  
  const createdPosts = []
  for (const post of posts) {
    try {
      const result = await apiCall('/posts', 'POST', post)
      createdPosts.push(result.data)
      console.log(`✅ Created post: ${post.title}`)
    } catch (error) {
      console.log(`❌ Failed to create post ${post.title}:`, error.message)
    }
  }
  
  return createdPosts
}

// Create download menus
async function createDownloadMenus() {
  console.log('📁 Creating download menus...')
  
  const downloadMenus = [
    {
      name: 'JEE Main Study Material',
      exam: 'JEE Main',
      sortOrder: 1
    },
    {
      name: 'JEE Advanced Previous Year Papers',
      exam: 'JEE Advanced',
      sortOrder: 2
    },
    {
      name: 'NEET Biology Notes',
      exam: 'NEET',
      sortOrder: 1
    },
    {
      name: 'GATE Computer Science Papers',
      exam: 'GATE',
      sortOrder: 1
    },
    {
      name: 'SAT Practice Tests',
      exam: 'SAT',
      sortOrder: 1
    },
    {
      name: 'CBSE Sample Papers',
      exam: 'All Exams',
      sortOrder: 1
    }
  ]
  
  const createdMenus = []
  for (const menu of downloadMenus) {
    try {
      const result = await apiCall('/download-menus', 'POST', menu)
      createdMenus.push(result.data)
      console.log(`✅ Created download menu: ${menu.name}`)
    } catch (error) {
      console.log(`❌ Failed to create download menu ${menu.name}:`, error.message)
    }
  }
  
  return createdMenus
}

// Create sub folders
async function createSubFolders(downloadMenus) {
  console.log('📂 Creating sub folders...')
  
  const subFolders = [
    {
      name: 'Physics Sample Papers',
      order: 1,
      files: [
        {
          title: 'Physics Test 1',
          url: 'https://example.com/physics-test-1.pdf',
          fileType: 'PDF File',
          locked: true,
          order: 1
        },
        {
          title: 'Physics Test 2',
          url: 'https://example.com/physics-test-2.pdf',
          fileType: 'PDF File',
          locked: true,
          order: 2
        }
      ]
    },
    {
      name: 'Chemistry Sample Papers',
      order: 2,
      files: [
        {
          title: 'Chemistry Test 1',
          url: 'https://example.com/chemistry-test-1.pdf',
          fileType: 'PDF File',
          locked: true,
          order: 1
        }
      ]
    },
    {
      name: 'Mathematics Sample Papers',
      order: 3,
      files: [
        {
          title: 'Math Test 1',
          url: 'https://example.com/math-test-1.pdf',
          fileType: 'PDF File',
          locked: false,
          order: 1
        }
      ]
    }
  ]
  
  const createdSubFolders = []
  for (const subFolder of subFolders) {
    try {
      const result = await apiCall('/sub-folders', 'POST', subFolder)
      createdSubFolders.push(result.data)
      console.log(`✅ Created sub folder: ${subFolder.name}`)
    } catch (error) {
      console.log(`❌ Failed to create sub folder ${subFolder.name}:`, error.message)
    }
  }
  
  return createdSubFolders
}

// Create exam info
async function createExamInfo(exams) {
  console.log('📚 Creating exam info...')
  
  const examInfo = [
    {
      title: 'JEE Main 2024 Complete Study Guide',
      exam: exams.find(e => e.examName === 'JEE Main 2024')?.id,
      sortOrder: 1,
      files: [
        {
          title: 'JEE Main Physics Syllabus',
          url: 'https://example.com/jee-physics-syllabus.pdf',
          fileType: 'PDF File',
          order: 1
        },
        {
          title: 'JEE Main Chemistry Notes',
          url: 'https://example.com/jee-chemistry-notes.pdf',
          fileType: 'PDF File',
          order: 2
        },
        {
          title: 'JEE Main Math Formulas',
          url: 'https://example.com/jee-math-formulas.pdf',
          fileType: 'PDF File',
          order: 3
        }
      ]
    },
    {
      title: 'NEET 2024 Biology Preparation',
      exam: exams.find(e => e.examName === 'NEET 2024')?.id,
      sortOrder: 1,
      files: [
        {
          title: 'NEET Biology NCERT Notes',
          url: 'https://example.com/neet-biology-ncert.pdf',
          fileType: 'PDF File',
          order: 1
        },
        {
          title: 'NEET Biology Previous Year Questions',
          url: 'https://example.com/neet-biology-pyp.pdf',
          fileType: 'PDF File',
          order: 2
        }
      ]
    },
    {
      title: 'SAT 2024 Math Formula Sheet',
      exam: exams.find(e => e.examName === 'SAT 2024')?.id,
      sortOrder: 1,
      files: [
        {
          title: 'SAT Math Formulas',
          url: 'https://example.com/sat-math-formulas.pdf',
          fileType: 'PDF File',
          order: 1
        },
        {
          title: 'SAT Math Practice Questions',
          url: 'https://example.com/sat-math-practice.pdf',
          fileType: 'PDF File',
          order: 2
        }
      ]
    }
  ]
  
  const createdExamInfo = []
  for (const info of examInfo) {
    try {
      const result = await apiCall('/exam-info', 'POST', info)
      createdExamInfo.push(result.data)
      console.log(`✅ Created exam info: ${info.title}`)
    } catch (error) {
      console.log(`❌ Failed to create exam info ${info.title}:`, error.message)
    }
  }
  
  return createdExamInfo
}

// Create exam sub info
async function createExamSubInfo(examInfo) {
  console.log('📋 Creating exam sub info...')
  
  const examSubInfo = [
    {
      title: 'Physics Mechanics',
      parentInfo: examInfo.find(i => i.title === 'JEE Main 2024 Complete Study Guide')?.id,
      order: 1
    },
    {
      title: 'Organic Chemistry',
      parentInfo: examInfo.find(i => i.title === 'JEE Main 2024 Complete Study Guide')?.id,
      order: 2
    },
    {
      title: 'Human Physiology',
      parentInfo: examInfo.find(i => i.title === 'NEET 2024 Biology Preparation')?.id,
      order: 1
    },
    {
      title: 'Algebra Basics',
      parentInfo: examInfo.find(i => i.title === 'SAT 2024 Math Formula Sheet')?.id,
      order: 1
    }
  ]
  
  const createdExamSubInfo = []
  for (const subInfo of examSubInfo) {
    try {
      const result = await apiCall('/exam-sub-info', 'POST', subInfo)
      createdExamSubInfo.push(result.data)
      console.log(`✅ Created exam sub info: ${subInfo.title}`)
    } catch (error) {
      console.log(`❌ Failed to create exam sub info ${subInfo.title}:`, error.message)
    }
  }
  
  return createdExamSubInfo
}

// Create media files
async function createMedia() {
  console.log('🖼️ Creating media files...')
  
  const mediaFiles = [
    {
      alt: 'JEE Main Preparation Banner',
      filename: 'jee-main-banner.jpg',
      mimeType: 'image/jpeg',
      filesize: 1024000,
      width: 1200,
      height: 600
    },
    {
      alt: 'NEET Biology Book Cover',
      filename: 'neet-biology-cover.jpg',
      mimeType: 'image/jpeg',
      filesize: 512000,
      width: 400,
      height: 600
    },
    {
      alt: 'SAT Math Formula Sheet',
      filename: 'sat-math-formulas.pdf',
      mimeType: 'application/pdf',
      filesize: 2048000,
      width: null,
      height: null
    }
  ]
  
  const createdMedia = []
  for (const media of mediaFiles) {
    try {
      const result = await apiCall('/media', 'POST', media)
      createdMedia.push(result.data)
      console.log(`✅ Created media: ${media.alt}`)
    } catch (error) {
      console.log(`❌ Failed to create media ${media.alt}:`, error.message)
    }
  }
  
  return createdMedia
}

// Main seeding function
async function seedAllData() {
  console.log('🚀 Starting comprehensive data seeding...')
  console.log('='.repeat(50))
  
  try {
    // 1. Create exam categories
    const categories = await createExamCategories()
    
    // 2. Create exams
    const exams = await createExams(categories)
    
    // 3. Create leads
    const leads = await createLeads()
    
    // 4. Create posts
    const posts = await createPosts()
    
    // 5. Create download menus
    const downloadMenus = await createDownloadMenus()
    
    // 6. Create sub folders
    const subFolders = await createSubFolders(downloadMenus)
    
    // 7. Create exam info
    const examInfo = await createExamInfo(exams)
    
    // 8. Create exam sub info
    const examSubInfo = await createExamSubInfo(examInfo)
    
    // 9. Create media
    const media = await createMedia()
    
    console.log('='.repeat(50))
    console.log('🎉 Seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Exam Categories: ${categories.length}`)
    console.log(`- Exams: ${exams.length}`)
    console.log(`- Leads: ${leads.length}`)
    console.log(`- Posts: ${posts.length}`)
    console.log(`- Download Menus: ${downloadMenus.length}`)
    console.log(`- Sub Folders: ${subFolders.length}`)
    console.log(`- Exam Info: ${examInfo.length}`)
    console.log(`- Exam Sub Info: ${examSubInfo.length}`)
    console.log(`- Media Files: ${media.length}`)
    console.log('\n🌐 Check your admin panel at: http://localhost:3000/admin')
    
  } catch (error) {
    console.error('❌ Error during seeding:', error.message)
    console.log('\n💡 Make sure your server is running: npm run dev')
  }
}

// Run the seeding
seedAllData()
