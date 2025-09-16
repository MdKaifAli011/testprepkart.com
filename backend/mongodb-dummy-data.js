// MongoDB Dummy Data Queries for TestPrepKart
// Run these queries directly in MongoDB Compass or MongoDB Shell

// 1. Exam Categories
db.getCollection('exam-category').insertMany([
  {
    categoryName: 'Engineering Entrance',
    seo_title: 'Engineering Entrance Exam Categories',
    seo_keyword: 'JEE, engineering, entrance exam',
    seo_description: 'Comprehensive guide for engineering entrance exams including JEE Main and Advanced',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    categoryName: 'Medical Entrance',
    seo_title: 'Medical Entrance Exam Categories',
    seo_keyword: 'NEET, medical, entrance exam',
    seo_description: 'Complete preparation for medical entrance exams including NEET',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    categoryName: 'International Exams',
    seo_title: 'International Exam Categories',
    seo_keyword: 'SAT, IB, international exams',
    seo_description: 'Preparation materials for international exams like SAT and IB',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    categoryName: 'Board Exams',
    seo_title: 'Board Exam Categories',
    seo_keyword: 'CBSE, board exams, class 10, class 12',
    seo_description: 'Study materials and resources for CBSE board exams',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// 2. Exams
db.getCollection('exam').insertMany([
  {
    examName: 'JEE Main 2024',
    category: ObjectId('EXAM_CATEGORY_ID_1'), // Replace with actual ID
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    examName: 'JEE Advanced 2024',
    category: ObjectId('EXAM_CATEGORY_ID_1'), // Replace with actual ID
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    examName: 'NEET 2024',
    category: ObjectId('EXAM_CATEGORY_ID_2'), // Replace with actual ID
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    examName: 'SAT 2024',
    category: ObjectId('EXAM_CATEGORY_ID_3'), // Replace with actual ID
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    examName: 'CBSE Class 12 Physics',
    category: ObjectId('EXAM_CATEGORY_ID_4'), // Replace with actual ID
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// 3. Leads (Contacts)
db.getCollection('leads').insertMany([
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '9876543210',
    class: '12th',
    message: 'Interested in JEE preparation course',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    mobile: '9876543211',
    class: '11th',
    message: 'Looking for NEET coaching',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    mobile: '9876543212',
    class: '10th',
    message: 'Need help with CBSE board exams',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    mobile: '9876543213',
    class: '12th',
    message: 'Interested in SAT preparation',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'David Miller',
    email: 'david.miller@example.com',
    mobile: '9876543214',
    class: '11th',
    message: 'Looking for comprehensive study materials',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// 4. Posts
db.getCollection('posts').insertMany([
  {
    title: 'JEE Main 2024 Preparation Strategy',
    content: 'Complete guide to crack JEE Main 2024 with effective study strategies and time management tips.',
    category: 'Study Tips',
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'NEET 2024 Important Topics',
    content: 'Focus on these high-weightage topics to maximize your NEET 2024 score.',
    category: 'Exam Guide',
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'SAT Math Section Tips',
    content: 'Master the SAT Math section with these proven strategies and practice techniques.',
    category: 'International Exams',
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'CBSE Board Exam Preparation',
    content: 'Complete roadmap for CBSE Class 12 board exam preparation.',
    category: 'Board Exams',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// 5. Download Menus
db.getCollection('download-menus').insertMany([
  {
    menuName: 'JEE Study Materials',
    examType: 'jee',
    description: 'Comprehensive study materials for JEE preparation',
    active: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    menuName: 'NEET Question Papers',
    examType: 'neet',
    description: 'Previous year question papers and mock tests',
    active: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    menuName: 'SAT Practice Tests',
    examType: 'sat',
    description: 'Official SAT practice tests and sample questions',
    active: true,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// 6. Sub Folders
db.getCollection('sub-folders').insertMany([
  {
    name: 'Mathematics',
    description: 'Math study materials and practice problems',
    parentFolder: ObjectId('DOWNLOAD_MENU_ID_1'), // Replace with actual ID
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Physics',
    description: 'Physics concepts and numerical problems',
    parentFolder: ObjectId('DOWNLOAD_MENU_ID_1'), // Replace with actual ID
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Chemistry',
    description: 'Chemistry theory and practice questions',
    parentFolder: ObjectId('DOWNLOAD_MENU_ID_1'), // Replace with actual ID
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Biology',
    description: 'Biology study materials for NEET',
    parentFolder: ObjectId('DOWNLOAD_MENU_ID_2'), // Replace with actual ID
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// 7. Media Files
db.getCollection('media').insertMany([
  {
    filename: 'jee-main-syllabus.pdf',
    alt: 'JEE Main Syllabus 2024',
    type: 'document',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    filename: 'neet-sample-paper.jpg',
    alt: 'NEET Sample Paper',
    type: 'image',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    filename: 'sat-math-formulas.pdf',
    alt: 'SAT Math Formulas Sheet',
    type: 'document',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// 8. Users (Admin Users)
db.getCollection('users').insertMany([
  {
    email: 'admin@testprepkart.com',
    password: '$2a$10$encrypted_password_here', // This should be properly hashed
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: 'editor@testprepkart.com',
    password: '$2a$10$encrypted_password_here', // This should be properly hashed
    role: 'editor',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
