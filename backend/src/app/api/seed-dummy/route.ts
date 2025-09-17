import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getNextId } from '../../../utils/autoId'

export async function POST(_request: NextRequest) {
  try {
    console.log('🌱 Starting to seed dummy data with automatic ID generation...')

    const payload = await getPayload({ config })

    // Seed Users first (required for relationships)
    console.log('👤 Creating users...')
    const users = []
    const userData = [
      { email: 'admin@testprepkart.com', password: 'admin123', role: 'admin' },
      { email: 'editor@testprepkart.com', password: 'editor123', role: 'editor' },
      { email: 'content@testprepkart.com', password: 'content123', role: 'editor' },
      { email: 'support@testprepkart.com', password: 'support123', role: 'user' },
    ]

    // Get existing users first
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 100,
    })

    for (const userInfo of userData) {
      // Check if user already exists
      const existingUser = existingUsers.docs.find((u) => u.email === userInfo.email)
      if (existingUser) {
        console.log(`User ${userInfo.email} already exists, skipping...`)
        users.push(existingUser)
      } else {
        // Get the next available customId
        const nextId = await getNextId(payload, 'users')
        const user = await payload.create({
          collection: 'users',
          data: {
            ...userInfo,
            customId: nextId,
          } as any,
        })
        users.push(user)
      }
    }

    console.log('✅ Users processed successfully')

    // Seed Media - Skip for now due to upload requirements
    console.log('📁 Skipping media files (requires actual file uploads)...')
    const mediaFiles = [] // Empty array for now
    console.log('✅ Media files skipped')

    // Seed Exam Categories
    console.log('📚 Creating exam categories...')
    const examCategories = []
    const categoryNames = [
      'Engineering',
      'Medical',
      'Management',
      'Law',
      'Arts & Humanities',
      'Science',
      'Commerce',
      'Defense',
    ]

    for (let i = 0; i < categoryNames.length; i++) {
      // Get the next available customId
      const nextId = await getNextId(payload, 'exam-category')
      const category = await payload.create({
        collection: 'exam-category',
        data: {
          categoryName: categoryNames[i],
          customId: nextId,
        } as any,
      })
      examCategories.push(category)
    }
    console.log('✅ Exam categories created successfully')

    // Seed Exams
    console.log('📝 Creating exams...')
    const exams = []
    const examData = [
      { name: 'JEE Main', category: 'Engineering' },
      { name: 'JEE Advanced', category: 'Engineering' },
      { name: 'NEET', category: 'Medical' },
      { name: 'AIIMS', category: 'Medical' },
      { name: 'CAT', category: 'Management' },
      { name: 'XAT', category: 'Management' },
      { name: 'CLAT', category: 'Law' },
      { name: 'AILET', category: 'Law' },
      { name: 'UPSC', category: 'Defense' },
      { name: 'SSC CGL', category: 'Defense' },
    ]

    for (let i = 0; i < examData.length; i++) {
      const examInfo = examData[i]
      const category = examCategories.find((cat) => cat.categoryName === examInfo.category)
      if (category) {
        // Get the next available customId
        const nextId = await getNextId(payload, 'exam')
        const exam = await payload.create({
          collection: 'exam',
          data: {
            examName: examInfo.name,
            category: category.id,
            customId: nextId,
          } as any,
        })
        exams.push(exam)
      }
    }
    console.log('✅ Exams created successfully')

    // Seed Courses
    console.log('🎓 Creating courses...')
    const courses = []
    const courseData = [
      {
        name: 'JEE Main Complete Course 2024',
        category: 'Engineering',
        price: 2999,
        level: 'going_to_12th',
        type: 'online',
        description:
          'Comprehensive JEE Main preparation covering Physics, Chemistry, and Mathematics with expert faculty and practice tests.',
        faculty: 'Dr. Rajesh Kumar',
        duration: 1200,
        studentCount: 1250,
      },
      {
        name: 'NEET Biology Masterclass',
        category: 'Medical',
        price: 2499,
        level: 'going_to_12th',
        type: 'online',
        description:
          'Complete NEET Biology preparation with detailed explanations, diagrams, and practice questions.',
        faculty: 'Dr. Priya Sharma',
        duration: 1000,
        studentCount: 980,
      },
      {
        name: 'CAT Quantitative Aptitude',
        category: 'Management',
        price: 1999,
        level: '12th_pass',
        type: 'online',
        description:
          'Master CAT Quantitative Aptitude with shortcut techniques and extensive practice.',
        faculty: 'Prof. Amit Verma',
        duration: 800,
        studentCount: 750,
      },
      {
        name: 'CLAT Legal Reasoning',
        category: 'Law',
        price: 1799,
        level: '12th_pass',
        type: 'online',
        description:
          'Comprehensive CLAT Legal Reasoning preparation with case studies and mock tests.',
        faculty: 'Adv. Sneha Singh',
        duration: 600,
        studentCount: 420,
      },
      {
        name: 'UPSC General Studies',
        category: 'Defense',
        price: 3999,
        level: 'graduate',
        type: 'online',
        description:
          'Complete UPSC General Studies preparation covering all subjects with current affairs.',
        faculty: 'Dr. Vikram Mehta',
        duration: 2000,
        studentCount: 2100,
      },
      {
        name: 'JEE Advanced Physics',
        category: 'Engineering',
        price: 3499,
        level: 'going_to_12th',
        type: 'offline',
        description: 'Advanced Physics concepts for JEE Advanced with problem-solving techniques.',
        faculty: 'Dr. Anil Gupta',
        duration: 1500,
        studentCount: 650,
      },
      {
        name: 'NEET Chemistry Crash Course',
        category: 'Medical',
        price: 1299,
        level: 'going_to_12th',
        type: 'online',
        description: 'Quick revision course for NEET Chemistry covering all important topics.',
        faculty: 'Dr. Sunita Patel',
        duration: 400,
        studentCount: 850,
      },
      {
        name: 'CAT Verbal Ability',
        category: 'Management',
        price: 1599,
        level: '12th_pass',
        type: 'online',
        description: 'Master CAT Verbal Ability with reading comprehension and grammar.',
        faculty: 'Prof. Ravi Kumar',
        duration: 500,
        studentCount: 680,
      },
      {
        name: 'SSC CGL Complete Course',
        category: 'Defense',
        price: 2299,
        level: '12th_pass',
        type: 'online',
        description: 'Complete SSC CGL preparation with all subjects and mock tests.',
        faculty: 'Dr. Manoj Tiwari',
        duration: 1200,
        studentCount: 1100,
      },
      {
        name: 'AIIMS Medical Entrance',
        category: 'Medical',
        price: 2799,
        level: 'going_to_12th',
        type: 'online',
        description: 'Specialized AIIMS preparation with medical concepts and reasoning.',
        faculty: 'Dr. Neha Agarwal',
        duration: 1000,
        studentCount: 520,
      },
    ]

    for (let i = 0; i < courseData.length; i++) {
      const course = courseData[i]
      const category = examCategories.find((cat) => cat.categoryName === course.category)
      if (category) {
        const courseRecord = await payload.create({
          collection: 'courses',
          data: {
            category: category.id,
            course_name: course.name,
            course_short_description: course.description,
            description: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        version: 1,
                        text: `${course.description} This comprehensive course includes detailed study materials, practice tests, doubt clearing sessions, and expert guidance to help you excel in your preparation.`,
                      },
                    ],
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
            price: course.price,
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
            review:
              'Excellent course with great content and teaching methodology. Highly recommended for serious aspirants.',
            start_date: new Date().toISOString(),
            duration: course.duration,
            student_count: course.studentCount,
            course_type: course.type as 'online' | 'offline',
            course_level: course.level as
              | 'going_to_9th'
              | 'going_to_10th'
              | 'going_to_11th'
              | 'going_to_12th'
              | '12th_pass'
              | 'graduate'
              | 'post_graduate',
            other_details:
              'Includes study materials, practice tests, doubt clearing sessions, and 24/7 support.',
            faculty_name: course.faculty,
            // faculty_image: mediaFiles[Math.floor(Math.random() * 10)].id, // Skip for now
            // course_image: mediaFiles[Math.floor(Math.random() * 10) + 10].id, // Skip for now
            // course_video: mediaFiles[Math.floor(Math.random() * 5) + 15].id, // Skip for now
            seo_title: `${course.name} - Complete Preparation Course 2024`,
            seo_description: `Master ${course.name} with our comprehensive preparation course. Expert faculty, detailed study materials, and practice tests included.`,
            seo_keywords: `${course.name}, preparation, course, study material, practice tests, 2024`,
            customId: await getNextId(payload, 'courses'),
          } as any,
        })
        courses.push(courseRecord)
      }
    }
    console.log('✅ Courses created successfully')

    // Seed Exam Info
    console.log('📖 Creating exam info...')
    const examInfos = []
    const examInfoData = [
      { name: 'JEE Main Study Guide', exam: 'JEE Main', category: 'Engineering' },
      { name: 'JEE Main Practice Tests', exam: 'JEE Main', category: 'Engineering' },
      { name: 'JEE Advanced Preparation', exam: 'JEE Advanced', category: 'Engineering' },
      { name: 'NEET Biology Notes', exam: 'NEET', category: 'Medical' },
      { name: 'NEET Chemistry Guide', exam: 'NEET', category: 'Medical' },
      { name: 'AIIMS Preparation Material', exam: 'AIIMS', category: 'Medical' },
      { name: 'CAT Quantitative Aptitude', exam: 'CAT', category: 'Management' },
      { name: 'CAT Verbal Ability', exam: 'CAT', category: 'Management' },
      { name: 'CLAT Legal Reasoning', exam: 'CLAT', category: 'Law' },
      { name: 'UPSC General Studies', exam: 'UPSC', category: 'Defense' },
    ]

    for (let i = 0; i < examInfoData.length; i++) {
      const info = examInfoData[i]
      const exam = exams.find((e) => e.examName === info.exam)
      const category = examCategories.find((cat) => cat.categoryName === info.category)
      if (exam && category) {
        const examInfo = await payload.create({
          collection: 'exam-info',
          data: {
            menuName: info.name,
            exam: exam.id,
            category: category.id,
            seo_title: `${info.name} - Complete Study Material`,
            seo_description: `Comprehensive study material for ${info.name}`,
            seo_keywords: `${info.exam}, study material, preparation, notes`,
            sortOrder: Math.floor(Math.random() * 10),
            customId: await getNextId(payload, 'exam-info'),
          } as any,
        })
        examInfos.push(examInfo)
      }
    }
    console.log('✅ Exam info created successfully')

    // Seed Exam Sub Info
    console.log('📋 Creating exam sub info...')
    const examSubInfos = []
    const subInfoData = [
      { name: 'Physics Notes', parent: 'JEE Main Study Guide' },
      { name: 'Chemistry Notes', parent: 'JEE Main Study Guide' },
      { name: 'Mathematics Notes', parent: 'JEE Main Study Guide' },
      { name: 'Biology Theory', parent: 'NEET Biology Notes' },
      { name: 'Biology Practice', parent: 'NEET Biology Notes' },
      { name: 'Organic Chemistry', parent: 'NEET Chemistry Guide' },
      { name: 'Inorganic Chemistry', parent: 'NEET Chemistry Guide' },
      { name: 'Quantitative Methods', parent: 'CAT Quantitative Aptitude' },
      { name: 'Data Interpretation', parent: 'CAT Quantitative Aptitude' },
      { name: 'Reading Comprehension', parent: 'CAT Verbal Ability' },
    ]

    for (let i = 0; i < subInfoData.length; i++) {
      const subInfo = subInfoData[i]
      const parentInfo = examInfos.find((info) => info.menuName === subInfo.parent)
      if (parentInfo) {
        const examSubInfo = await payload.create({
          collection: 'exam-sub-info',
          data: {
            subMenuName: subInfo.name,
            menuId: parentInfo.id,
            seo_title: `${subInfo.name} - ${parentInfo.menuName}`,
            seo_description: `Detailed ${subInfo.name} for ${parentInfo.menuName}`,
            seo_keywords: `${subInfo.name}, ${parentInfo.menuName}, study notes`,
            order: Math.floor(Math.random() * 10),
            customId: await getNextId(payload, 'exam-sub-info'),
          } as any,
        })
        examSubInfos.push(examSubInfo)
      }
    }
    console.log('✅ Exam sub info created successfully')

    // Seed Download Menus
    console.log('📁 Creating download menus...')
    const downloadMenus = []
    const downloadMenuData = [
      { name: 'JEE Main Downloads', exam: 'JEE Main', category: 'Engineering' },
      { name: 'NEET Downloads', exam: 'NEET', category: 'Medical' },
      { name: 'CAT Downloads', exam: 'CAT', category: 'Management' },
      { name: 'CLAT Downloads', exam: 'CLAT', category: 'Law' },
      { name: 'UPSC Downloads', exam: 'UPSC', category: 'Defense' },
    ]

    for (let i = 0; i < downloadMenuData.length; i++) {
      const menu = downloadMenuData[i]
      const exam = exams.find((e) => e.examName === menu.exam)
      const category = examCategories.find((cat) => cat.categoryName === menu.category)
      if (exam && category) {
        const downloadMenu = await payload.create({
          collection: 'download-menus',
          data: {
            menuName: menu.name,
            exam: exam.id,
            category: category.id,
            seo_title: `${menu.name} - Free Study Material`,
            seo_description: `Download free study material for ${menu.exam}`,
            seo_keywords: `${menu.exam}, downloads, study material, free`,
            sortOrder: Math.floor(Math.random() * 10),
            customId: await getNextId(payload, 'download-menus'),
          } as any,
        })
        downloadMenus.push(downloadMenu)
      }
    }
    console.log('✅ Download menus created successfully')

    // Seed Sub Folders
    console.log('📂 Creating sub folders...')
    const subFolders = []
    const subFolderData = [
      { name: 'Physics PDFs', parent: 'JEE Main Downloads' },
      { name: 'Chemistry PDFs', parent: 'JEE Main Downloads' },
      { name: 'Mathematics PDFs', parent: 'JEE Main Downloads' },
      { name: 'Biology PDFs', parent: 'NEET Downloads' },
      { name: 'Physics PDFs', parent: 'NEET Downloads' },
      { name: 'Chemistry PDFs', parent: 'NEET Downloads' },
      { name: 'Quantitative PDFs', parent: 'CAT Downloads' },
      { name: 'Verbal PDFs', parent: 'CAT Downloads' },
      { name: 'Legal PDFs', parent: 'CLAT Downloads' },
      { name: 'General Studies PDFs', parent: 'UPSC Downloads' },
    ]

    for (let i = 0; i < subFolderData.length; i++) {
      const folder = subFolderData[i]
      const parentMenu = downloadMenus.find((menu) => menu.menuName === folder.parent)
      if (parentMenu) {
        const subFolder = await payload.create({
          collection: 'sub-folders',
          data: {
            subMenuName: folder.name,
            menuId: parentMenu.id,
            order: Math.floor(Math.random() * 10),
            customId: await getNextId(payload, 'sub-folders'),
          } as any,
        })
        subFolders.push(subFolder)
      }
    }
    console.log('✅ Sub folders created successfully')

    // Seed Blog Posts
    console.log('📝 Creating blog posts...')
    const blogPosts = []
    const blogPostData = [
      {
        title: 'JEE Main 2024 Preparation Strategy: Complete Guide',
        exam: 'JEE Main',
        category: 'Engineering',
        description:
          'Comprehensive guide to JEE Main 2024 preparation covering all subjects, time management, and exam strategies.',
      },
      {
        title: 'NEET Biology Important Topics: Must-Know Concepts',
        exam: 'NEET',
        category: 'Medical',
        description:
          'Essential NEET Biology topics that every aspirant must master for success in the medical entrance exam.',
      },
      {
        title: 'CAT Quantitative Aptitude Tips: Master the Math',
        exam: 'CAT',
        category: 'Management',
        description:
          'Proven strategies and tips to excel in CAT Quantitative Aptitude section with practice techniques.',
      },
      {
        title: 'CLAT Legal Reasoning Guide: Crack the Logic',
        exam: 'CLAT',
        category: 'Law',
        description:
          'Complete guide to CLAT Legal Reasoning with case studies, logical reasoning, and practice questions.',
      },
      {
        title: 'UPSC General Studies Preparation: Complete Roadmap',
        exam: 'UPSC',
        category: 'Defense',
        description:
          'Comprehensive UPSC General Studies preparation strategy covering all subjects and current affairs.',
      },
      {
        title: 'JEE Advanced Physics Concepts: Advanced Problem Solving',
        exam: 'JEE Advanced',
        category: 'Engineering',
        description:
          'Master advanced Physics concepts for JEE Advanced with problem-solving techniques and shortcuts.',
      },
      {
        title: 'AIIMS Medical Entrance Tips: Success Strategies',
        exam: 'AIIMS',
        category: 'Medical',
        description:
          'Expert tips and strategies to crack AIIMS medical entrance exam with focused preparation.',
      },
      {
        title: 'XAT Decision Making Strategies: Master the Art',
        exam: 'XAT',
        category: 'Management',
        description:
          'Complete guide to XAT Decision Making section with case studies and analytical reasoning.',
      },
      {
        title: 'SSC CGL Complete Preparation Guide 2024',
        exam: 'SSC CGL',
        category: 'Defense',
        description:
          'Comprehensive SSC CGL preparation guide covering all subjects, exam pattern, and preparation tips.',
      },
      {
        title: 'AILET Legal Aptitude: Complete Study Plan',
        exam: 'AILET',
        category: 'Law',
        description:
          'Detailed study plan for AILET Legal Aptitude section with practice questions and mock tests.',
      },
    ]

    for (let i = 0; i < blogPostData.length; i++) {
      const post = blogPostData[i]
      const exam = exams.find((e) => e.examName === post.exam)
      const category = examCategories.find((cat) => cat.categoryName === post.category)
      const author = users[Math.floor(Math.random() * users.length)]
      if (exam && category) {
        const blogPost = await payload.create({
          collection: 'post',
          data: {
            title: post.title,
            slug: `${post.title
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '')}-${Date.now()}-${i}`,
            description: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        version: 1,
                        text: post.description,
                      },
                    ],
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
            exam: exam.id,
            category: category.id,
            seo_title: `${post.title} - Complete Guide 2024`,
            seo_description: post.description,
            seo_keywords: `${post.exam}, preparation, tips, strategy, 2024, study guide`,
            created_by: author.id,
            updated_by: author.id,
            // blog_image: mediaFiles[Math.floor(Math.random() * 10)].id, // Skip for now
            status: 'published',
            publishedDate: new Date().toISOString(),
            customId: await getNextId(payload, 'post'),
          } as any,
        })
        blogPosts.push(blogPost)
      }
    }
    console.log('✅ Blog posts created successfully')

    // Seed Blog Comments
    console.log('💬 Creating blog comments...')
    const blogComments = []
    const commentData = [
      {
        post: 'JEE Main 2024 Preparation Strategy',
        author: 'Rahul Sharma',
        email: 'rahul@example.com',
        content: 'Great tips! Very helpful for my preparation.',
      },
      {
        post: 'NEET Biology Important Topics',
        author: 'Priya Patel',
        email: 'priya@example.com',
        content: 'This really helped me understand the important topics.',
      },
      {
        post: 'CAT Quantitative Aptitude Tips',
        author: 'Amit Kumar',
        email: 'amit@example.com',
        content: 'Excellent strategies for quantitative section.',
      },
      {
        post: 'CLAT Legal Reasoning Guide',
        author: 'Sneha Singh',
        email: 'sneha@example.com',
        content: 'Very detailed explanation of legal reasoning concepts.',
      },
      {
        post: 'UPSC General Studies Preparation',
        author: 'Vikram Mehta',
        email: 'vikram@example.com',
        content: 'Comprehensive guide for GS preparation.',
      },
    ]

    for (let i = 0; i < commentData.length; i++) {
      const comment = commentData[i]
      const post = blogPosts.find((p) => p.title === comment.post)
      if (post) {
        const blogComment = await payload.create({
          collection: 'blog-comments',
          data: {
            blog: post.id,
            author_name: comment.author,
            author_email: comment.email,
            comment_author_ip: '192.168.1.' + Math.floor(Math.random() * 255),
            comment_date: new Date().toISOString(),
            content: comment.content,
            status: 'approved',
            // customId will be auto-generated by the hook
          } as any,
        })
        blogComments.push(blogComment)
      }
    }
    console.log('✅ Blog comments created successfully')

    // Seed Blog Comment Replies
    console.log('💭 Creating blog comment replies...')
    const replyData = [
      {
        comment: 'Rahul Sharma',
        content: 'I agree! These tips really helped me too.',
        author: 'Anjali Verma',
        email: 'anjali@example.com',
      },
      {
        comment: 'Priya Patel',
        content: 'Thanks for sharing your experience!',
        author: 'Rohit Gupta',
        email: 'rohit@example.com',
      },
      {
        comment: 'Amit Kumar',
        content: 'Great to hear it worked for you!',
        author: 'Deepak Singh',
        email: 'deepak@example.com',
      },
    ]

    for (let i = 0; i < replyData.length; i++) {
      const reply = replyData[i]
      const comment = blogComments.find((c) => c.author_name === reply.comment)
      if (comment) {
        await payload.create({
          collection: 'blog-comment-replies',
          data: {
            comment: comment.id,
            reply_content: reply.content,
            reply_author_name: reply.author,
            reply_author_email: reply.email,
            reply_author_ip: '192.168.1.' + Math.floor(Math.random() * 255),
            reply_date: new Date().toISOString(),
            status: 'approved',
            // customId will be auto-generated by the hook
          } as any,
        })
      }
    }
    console.log('✅ Blog comment replies created successfully')

    // Seed Contact/Leads
    console.log('📞 Creating contact leads...')
    const contactLeads = []
    const contactData = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        mobile: '9876543210',
        class: '12',
        country: 'India',
        countryCode: '+91',
        message:
          'Interested in JEE Main preparation course. Please provide more details about the curriculum.',
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@yahoo.com',
        mobile: '9876543211',
        class: '11',
        country: 'India',
        countryCode: '+91',
        message:
          'Need help with NEET Biology preparation. Looking for comprehensive study material.',
      },
      {
        name: 'Amit Kumar',
        email: 'amit.kumar@outlook.com',
        mobile: '9876543212',
        class: '12',
        country: 'India',
        countryCode: '+91',
        message: 'Looking for CAT coaching. Interested in both online and offline options.',
      },
      {
        name: 'Sneha Singh',
        email: 'sneha.singh@gmail.com',
        mobile: '9876543213',
        class: '10',
        country: 'India',
        countryCode: '+91',
        message: 'Interested in CLAT preparation. Need guidance on legal reasoning section.',
      },
      {
        name: 'Vikram Mehta',
        email: 'vikram.mehta@gmail.com',
        mobile: '9876543214',
        class: '12',
        country: 'India',
        countryCode: '+91',
        message: 'Need UPSC guidance. Looking for comprehensive General Studies preparation.',
      },
      {
        name: 'Anjali Verma',
        email: 'anjali.verma@yahoo.com',
        mobile: '9876543215',
        class: '11',
        country: 'India',
        countryCode: '+91',
        message: 'Interested in AIIMS preparation. Need help with medical concepts.',
      },
      {
        name: 'Rohit Gupta',
        email: 'rohit.gupta@gmail.com',
        mobile: '9876543216',
        class: '12',
        country: 'India',
        countryCode: '+91',
        message: 'Looking for SSC CGL preparation. Need complete course details.',
      },
      {
        name: 'Deepak Singh',
        email: 'deepak.singh@outlook.com',
        mobile: '9876543217',
        class: '12',
        country: 'India',
        countryCode: '+91',
        message: 'Interested in XAT preparation. Need guidance on decision making section.',
      },
      {
        name: 'Kavita Joshi',
        email: 'kavita.joshi@gmail.com',
        mobile: '9876543218',
        class: '11',
        country: 'India',
        countryCode: '+91',
        message:
          'Need help with JEE Advanced Physics. Looking for advanced problem solving techniques.',
      },
      {
        name: 'Rajesh Tiwari',
        email: 'rajesh.tiwari@yahoo.com',
        mobile: '9876543219',
        class: '12',
        country: 'India',
        countryCode: '+91',
        message: 'Interested in AILET preparation. Need complete study plan and materials.',
      },
      {
        name: 'Sunita Agarwal',
        email: 'sunita.agarwal@gmail.com',
        mobile: '9876543220',
        class: '10',
        country: 'India',
        countryCode: '+91',
        message: 'Looking for NEET Chemistry preparation. Need crash course details.',
      },
      {
        name: 'Manoj Kumar',
        email: 'manoj.kumar@outlook.com',
        mobile: '9876543221',
        class: '12',
        country: 'India',
        countryCode: '+91',
        message: 'Interested in CLAT preparation. Need help with English section.',
      },
      {
        name: 'Neha Sharma',
        email: 'neha.sharma@gmail.com',
        mobile: '9876543222',
        class: '11',
        country: 'India',
        countryCode: '+91',
        message: 'Need UPSC preparation guidance. Looking for current affairs material.',
      },
      {
        name: 'Arun Verma',
        email: 'arun.verma@yahoo.com',
        mobile: '9876543223',
        class: '12',
        country: 'India',
        countryCode: '+91',
        message: 'Interested in CAT preparation. Need help with verbal ability section.',
      },
      {
        name: 'Pooja Singh',
        email: 'pooja.singh@gmail.com',
        mobile: '9876543224',
        class: '10',
        country: 'India',
        countryCode: '+91',
        message: 'Looking for JEE Main preparation. Need complete course information.',
      },
    ]

    for (let i = 0; i < contactData.length; i++) {
      const contact = contactData[i]
      const lead = await payload.create({
        collection: 'leads',
        data: {
          name: contact.name,
          email: contact.email,
          mobile: contact.mobile,
          class: contact.class as '6' | '7' | '8' | '9' | '10' | '11' | '12' | '12+',
          country: contact.country,
          countryCode: contact.countryCode,
          message: contact.message,
          customId: await getNextId(payload, 'leads'),
        } as any,
      })
      contactLeads.push(lead)
    }
    console.log('✅ Contact leads created successfully')

    const summary = {
      users: users.length,
      media: mediaFiles.length,
      examCategories: examCategories.length,
      exams: exams.length,
      courses: courses.length,
      examInfos: examInfos.length,
      examSubInfos: examSubInfos.length,
      downloadMenus: downloadMenus.length,
      subFolders: subFolders.length,
      blogPosts: blogPosts.length,
      blogComments: blogComments.length,
      blogCommentReplies: replyData.length,
      contactLeads: contactData.length,
    }

    console.log('🎉 All dummy data seeded successfully with automatic ID generation!')
    console.log('\n📊 Summary:')
    console.log(`- Users: ${summary.users}`)
    console.log(`- Media Files: ${summary.media}`)
    console.log(`- Exam Categories: ${summary.examCategories}`)
    console.log(`- Exams: ${summary.exams}`)
    console.log(`- Courses: ${summary.courses}`)
    console.log(`- Exam Info: ${summary.examInfos}`)
    console.log(`- Exam Sub Info: ${summary.examSubInfos}`)
    console.log(`- Download Menus: ${summary.downloadMenus}`)
    console.log(`- Sub Folders: ${summary.subFolders}`)
    console.log(`- Blog Posts: ${summary.blogPosts}`)
    console.log(`- Blog Comments: ${summary.blogComments}`)
    console.log(`- Blog Comment Replies: ${summary.blogCommentReplies}`)
    console.log(`- Contact Leads: ${summary.contactLeads}`)
    console.log('\n✨ All collections now have auto-generated sequential IDs!')
    console.log('🔒 ID fields are hidden and read-only in admin panel.')
    console.log('📝 Comprehensive dummy data created for testing and development.')

    return NextResponse.json({
      success: true,
      message: 'Dummy data seeded successfully with automatic ID generation!',
      data: summary,
    })
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error seeding data',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
