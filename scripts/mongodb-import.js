const { MongoClient, ObjectId } = require('mongodb')
const fs = require('fs')
const path = require('path')

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/Demo_testprepkart_backend'
const DATABASE_NAME = process.env.DATABASE_NAME || 'Demo_testprepkart_backend'

// File paths for JSON data
const SQL_DATA_PATH = path.join(__dirname, '../sql')

class MongoDBImporter {
  constructor() {
    this.client = null
    this.db = null
    this.idMappings = {
      exams: new Map(),
      examCategories: new Map(),
      examInfos: new Map(),
      examSubInfos: new Map(),
      downloadFolders: new Map(),
      downloadSubFolders: new Map(),
      downloadFiles: new Map(),
      courses: new Map(),
    }
  }

  async connect() {
    try {
      this.client = new MongoClient(MONGODB_URI)
      await this.client.connect()
      this.db = this.client.db(DATABASE_NAME)
      console.log('✅ Connected to MongoDB successfully')
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error)
      throw error
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close()
      console.log('✅ Disconnected from MongoDB')
    }
  }

  // Load JSON data from files
  loadJsonData(filename) {
    try {
      const filePath = path.join(SQL_DATA_PATH, filename)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const jsonData = JSON.parse(fileContent)

      // Extract data array from the JSON structure
      const dataEntry = jsonData.find((entry) => entry.type === 'table')
      const data = dataEntry ? dataEntry.data : []

      // Validate the data structure
      this.validateJsonData(filename, data)

      return data
    } catch (error) {
      console.error(`❌ Error loading ${filename}:`, error.message)
      return []
    }
  }

  // Helper function to handle import with error tracking
  async importWithErrorHandling(importFunction, data, collectionName) {
    let successCount = 0
    let errorCount = 0

    for (const itemData of data) {
      try {
        await importFunction(itemData)
        successCount++
      } catch (error) {
        console.error(
          `❌ Failed to import ${collectionName}: ${itemData.id || 'unknown'}`,
          error.message,
        )
        errorCount++
      }
    }

    console.log(`✅ Imported ${successCount} ${collectionName} successfully, ${errorCount} failed`)
    return { successCount, errorCount }
  }

  // Validate JSON data structure
  validateJsonData(filename, data) {
    if (!Array.isArray(data)) {
      console.warn(`⚠️  ${filename}: Data is not an array, got ${typeof data}`)
      return false
    }

    if (data.length === 0) {
      console.warn(`⚠️  ${filename}: Data array is empty`)
      return false
    }

    console.log(`✅ ${filename}: Loaded ${data.length} records`)
    return true
  }

  // Convert SQL date string to MongoDB Date
  convertDate(dateString) {
    if (!dateString || dateString === '0000-00-00' || dateString === '0000-00-00 00:00:00') {
      return null
    }
    try {
      const date = new Date(dateString)
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn(`⚠️  Invalid date format: ${dateString}`)
        return null
      }
      return date
    } catch (error) {
      console.warn(`⚠️  Error parsing date: ${dateString}`, error.message)
      return null
    }
  }

  // Transform exam data
  transformExamData(examData) {
    if (!examData.id || !examData.exam_name) {
      throw new Error(
        `Invalid exam data: missing required fields (id: ${examData.id}, exam_name: ${examData.exam_name})`,
      )
    }
    return {
      originalId: parseInt(examData.id),
      examName: examData.exam_name,
      createdAt: this.convertDate(examData.created_at),
      updatedAt: this.convertDate(examData.updated_at),
      categories: [], // Will be populated later
    }
  }

  // Transform exam category data
  transformExamCategoryData(categoryData) {
    if (!categoryData.id || !categoryData.category_name) {
      throw new Error(
        `Invalid category data: missing required fields (id: ${categoryData.id}, category_name: ${categoryData.category_name})`,
      )
    }
    return {
      originalId: parseInt(categoryData.id),
      examId: parseInt(categoryData.exam_id),
      categoryName: categoryData.category_name,
      seo: {
        title: categoryData.seo_title || '',
        description: categoryData.seo_description || '',
        keywords: categoryData.seo_keyword || '',
      },
      examInfos: [], // Will be populated later
      downloadFolders: [], // Will be populated later
    }
  }

  // Transform exam info data
  transformExamInfoData(infoData) {
    if (!infoData.id || !infoData.menu_name) {
      throw new Error(
        `Invalid exam info data: missing required fields (id: ${infoData.id}, menu_name: ${infoData.menu_name})`,
      )
    }
    return {
      originalId: parseInt(infoData.id),
      categoryId: parseInt(infoData.category_id),
      menuName: infoData.menu_name,
      description: infoData.description || '',
      seo: {
        title: infoData.seo_title || '',
        description: infoData.seo_description || '',
        keywords: infoData.seo_keywords || '',
      },
      subInfos: [], // Will be populated later
    }
  }

  // Transform exam sub info data
  transformExamSubInfoData(subInfoData) {
    if (!subInfoData.id || !subInfoData.sub_menu_name) {
      throw new Error(
        `Invalid exam sub info data: missing required fields (id: ${subInfoData.id}, sub_menu_name: ${subInfoData.sub_menu_name})`,
      )
    }
    return {
      originalId: parseInt(subInfoData.id),
      examInfoId: parseInt(subInfoData.menu_id),
      subMenuName: subInfoData.sub_menu_name,
      description: subInfoData.description || '',
      seo: {
        title: subInfoData.seo_title || '',
        description: subInfoData.seo_description || '',
        keywords: subInfoData.seo_keywords || '',
      },
    }
  }

  // Transform download folder data
  transformDownloadFolderData(folderData) {
    if (!folderData.id || !folderData.menu_name) {
      throw new Error(
        `Invalid download folder data: missing required fields (id: ${folderData.id}, menu_name: ${folderData.menu_name})`,
      )
    }
    return {
      originalId: parseInt(folderData.id),
      categoryId: parseInt(folderData.category_id),
      menuName: folderData.menu_name,
      seo: {
        title: folderData.seo_title || '',
        description: folderData.seo_description || '',
        keywords: folderData.seo_keywords || '',
      },
      createdAt: this.convertDate(folderData.created_at),
      updatedAt: this.convertDate(folderData.updated_at),
      subFolders: [], // Will be populated later
    }
  }

  // Transform download sub folder data
  transformDownloadSubFolderData(subFolderData) {
    if (!subFolderData.id || !subFolderData.sub_menu_name) {
      throw new Error(
        `Invalid download sub folder data: missing required fields (id: ${subFolderData.id}, sub_menu_name: ${subFolderData.sub_menu_name})`,
      )
    }
    return {
      originalId: parseInt(subFolderData.id),
      downloadFolderId: parseInt(subFolderData.menu_id),
      subMenuName: subFolderData.sub_menu_name,
      seo: {
        title: subFolderData.seo_title || '',
        description: subFolderData.seo_description || '',
        keywords: subFolderData.seo_keywords || '',
      },
      createdAt: this.convertDate(subFolderData.created_at),
      updatedAt: this.convertDate(subFolderData.updated_at),
      files: [], // Will be populated later
    }
  }

  // Transform download file data
  transformDownloadFileData(fileData) {
    if (!fileData.id || !fileData.file_name || !fileData.file_url) {
      throw new Error(
        `Invalid download file data: missing required fields (id: ${fileData.id}, file_name: ${fileData.file_name}, file_url: ${fileData.file_url})`,
      )
    }

    // Extract file type from URL or filename if not provided
    let fileType = fileData.file_type || 'pdf'
    if (!fileData.file_type) {
      const url = fileData.file_url.toLowerCase()
      const filename = fileData.file_name.toLowerCase()
      if (url.includes('.pdf') || filename.includes('.pdf')) {
        fileType = 'pdf'
      } else if (url.includes('.doc') || filename.includes('.doc')) {
        fileType = 'doc'
      } else if (url.includes('.zip') || filename.includes('.zip')) {
        fileType = 'zip'
      }
    }

    return {
      originalId: parseInt(fileData.id),
      subMenuId: parseInt(fileData.sub_menu_id),
      fileName: fileData.file_name,
      fileUrl: fileData.file_url,
      fileType: fileType,
      fileSize: fileData.file_size ? parseInt(fileData.file_size) : 0,
      downloadCount: fileData.download_count ? parseInt(fileData.download_count) : 0,
      createdAt: this.convertDate(fileData.created_at),
      updatedAt: this.convertDate(fileData.updated_at),
    }
  }

  // Transform course data
  transformCourseData(courseData) {
    if (!courseData.id || !courseData.course_name) {
      throw new Error(
        `Invalid course data: missing required fields (id: ${courseData.id}, course_name: ${courseData.course_name})`,
      )
    }
    return {
      originalId: parseInt(courseData.id),
      categoryId: parseInt(courseData.category_id),
      course_name: courseData.course_name,
      course_short_description: courseData.course_short_description || '',
      description: courseData.description || '',
      price: courseData.price ? parseFloat(courseData.price) : 0,
      rating: courseData.rating ? parseInt(courseData.rating) : 0,
      review: courseData.review ? parseInt(courseData.review) : 0,
      start_date: this.convertDate(courseData.start_date),
      duration: courseData.duration || '',
      student_count: courseData.student_count ? parseInt(courseData.student_count) : 0,
      course_type: courseData.course_type || '',
      course_level: courseData.course_level ? parseInt(courseData.course_level) : 0,
      other_details: courseData.other_details || '',
      faculty_name: courseData.faculty_name || '',
      faculty_image: courseData.faculty_image || '',
      course_image: courseData.course_image || '',
      course_video: courseData.course_video || '',
      seo_title: courseData.seo_title || '',
      seo_description: courseData.seo_description || '',
      seo_keywords: courseData.seo_keywords || '',
      createdAt: this.convertDate(courseData.created_at),
      updatedAt: this.convertDate(courseData.updated_at),
    }
  }

  // Import exams data
  async importExams() {
    console.log('📥 Importing exams data...')
    const examsData = this.loadJsonData('exams.json')
    const examsCollection = this.db.collection('exams')

    const importSingleExam = async (examData) => {
      const transformedData = this.transformExamData(examData)
      const result = await examsCollection.insertOne(transformedData)
      // Map using ObjectId instead of originalId
      this.idMappings.exams.set(result.insertedId.toString(), result.insertedId)
      console.log(`✅ Imported exam: ${transformedData.examName} (ObjectId: ${result.insertedId})`)
    }

    await this.importWithErrorHandling(importSingleExam, examsData, 'exams')
  }

  // Import exam categories data
  async importExamCategories() {
    console.log('📥 Importing exam categories data...')
    const categoriesData = this.loadJsonData('exam_categories.json')
    const categoriesCollection = this.db.collection('exam_categories')

    for (const categoryData of categoriesData) {
      const transformedData = this.transformExamCategoryData(categoryData)

      // Populate exam relationship
      if (transformedData.examId) {
        const exam = await this.db.collection('exams').findOne({
          originalId: transformedData.examId,
        })
        if (exam) {
          transformedData.exam = exam._id
          delete transformedData.examId
        } else {
          console.log(
            `⚠️  No exam found for category: ${transformedData.categoryName} (examId: ${transformedData.examId})`,
          )
        }
      }

      const result = await categoriesCollection.insertOne(transformedData)
      // Map using ObjectId instead of originalId
      this.idMappings.examCategories.set(result.insertedId.toString(), result.insertedId)
      console.log(
        `✅ Imported category: ${transformedData.categoryName} (ObjectId: ${result.insertedId})`,
      )
    }

    console.log(`✅ Imported ${categoriesData.length} exam categories`)
  }

  // Import exam infos data
  async importExamInfos() {
    console.log('📥 Importing exam infos data...')
    const infosData = this.loadJsonData('exam_infos.json')
    const infosCollection = this.db.collection('exam_infos')

    for (const infoData of infosData) {
      const transformedData = this.transformExamInfoData(infoData)

      // Populate category relationship
      if (transformedData.categoryId) {
        const category = await this.db.collection('exam_categories').findOne({
          originalId: transformedData.categoryId,
        })
        if (category) {
          transformedData.category = category._id
          delete transformedData.categoryId
        } else {
          console.log(
            `⚠️  No category found for exam info: ${transformedData.menuName} (categoryId: ${transformedData.categoryId})`,
          )
        }
      }

      const result = await infosCollection.insertOne(transformedData)
      // Map using ObjectId instead of originalId
      this.idMappings.examInfos.set(result.insertedId.toString(), result.insertedId)
      console.log(
        `✅ Imported exam info: ${transformedData.menuName} (ObjectId: ${result.insertedId})`,
      )
    }

    console.log(`✅ Imported ${infosData.length} exam infos`)
  }

  // Import exam sub infos data
  async importExamSubInfos() {
    console.log('📥 Importing exam sub infos data...')
    const subInfosData = this.loadJsonData('exam_sub_infos.json')
    const subInfosCollection = this.db.collection('exam_sub_infos')

    for (const subInfoData of subInfosData) {
      const transformedData = this.transformExamSubInfoData(subInfoData)

      // Populate examInfo relationship
      if (transformedData.examInfoId) {
        const examInfo = await this.db.collection('exam_infos').findOne({
          originalId: transformedData.examInfoId,
        })
        if (examInfo) {
          transformedData.examInfo = examInfo._id
          delete transformedData.examInfoId
        } else {
          console.log(
            `⚠️  No exam info found for sub info: ${transformedData.subMenuName} (examInfoId: ${transformedData.examInfoId})`,
          )
        }
      }

      const result = await subInfosCollection.insertOne(transformedData)
      // Map using ObjectId instead of originalId
      this.idMappings.examSubInfos.set(result.insertedId.toString(), result.insertedId)
      console.log(
        `✅ Imported exam sub info: ${transformedData.subMenuName} (ObjectId: ${result.insertedId})`,
      )
    }

    console.log(`✅ Imported ${subInfosData.length} exam sub infos`)
  }

  // Import download folders data
  async importDownloadFolders() {
    console.log('📥 Importing download folders data...')
    const foldersData = this.loadJsonData('download_folders.json')
    const foldersCollection = this.db.collection('download_folders')

    for (const folderData of foldersData) {
      const transformedData = this.transformDownloadFolderData(folderData)

      // Populate category relationship
      if (transformedData.categoryId) {
        const category = await this.db.collection('exam_categories').findOne({
          originalId: transformedData.categoryId,
        })
        if (category) {
          transformedData.category = category._id
          delete transformedData.categoryId
        } else {
          console.log(
            `⚠️  No category found for download folder: ${transformedData.menuName} (categoryId: ${transformedData.categoryId})`,
          )
        }
      }

      const result = await foldersCollection.insertOne(transformedData)
      // Map using ObjectId instead of originalId
      this.idMappings.downloadFolders.set(result.insertedId.toString(), result.insertedId)
      console.log(
        `✅ Imported download folder: ${transformedData.menuName} (ObjectId: ${result.insertedId})`,
      )
    }

    console.log(`✅ Imported ${foldersData.length} download folders`)
  }

  // Import download sub folders data
  async importDownloadSubFolders() {
    console.log('📥 Importing download sub folders data...')
    const subFoldersData = this.loadJsonData('download_sub_folders.json')
    const subFoldersCollection = this.db.collection('download_sub_folders')

    for (const subFolderData of subFoldersData) {
      const transformedData = this.transformDownloadSubFolderData(subFolderData)

      // Populate downloadFolder relationship
      if (transformedData.downloadFolderId) {
        const downloadFolder = await this.db.collection('download_folders').findOne({
          originalId: transformedData.downloadFolderId,
        })
        if (downloadFolder) {
          transformedData.downloadFolder = downloadFolder._id
          delete transformedData.downloadFolderId
        } else {
          console.log(
            `⚠️  No download folder found for sub folder: ${transformedData.subMenuName} (downloadFolderId: ${transformedData.downloadFolderId})`,
          )
        }
      }

      const result = await subFoldersCollection.insertOne(transformedData)
      // Map using ObjectId instead of originalId
      this.idMappings.downloadSubFolders.set(result.insertedId.toString(), result.insertedId)
      console.log(
        `✅ Imported download sub folder: ${transformedData.subMenuName} (ObjectId: ${result.insertedId})`,
      )
    }

    console.log(`✅ Imported ${subFoldersData.length} download sub folders`)
  }

  // Import download files data
  async importDownloadFiles() {
    console.log('📥 Importing download files data...')
    const filesData = this.loadJsonData('download_files.json')
    const filesCollection = this.db.collection('download_files')

    for (const fileData of filesData) {
      const transformedData = this.transformDownloadFileData(fileData)

      // Populate downloadSubFolder relationship
      if (transformedData.subMenuId) {
        const downloadSubFolder = await this.db.collection('download_sub_folders').findOne({
          originalId: transformedData.subMenuId,
        })
        if (downloadSubFolder) {
          transformedData.downloadSubFolder = downloadSubFolder._id
          delete transformedData.subMenuId
        } else {
          console.log(
            `⚠️  No download sub folder found for file: ${transformedData.fileName} (subMenuId: ${transformedData.subMenuId})`,
          )
        }
      }

      const result = await filesCollection.insertOne(transformedData)
      // Map using ObjectId instead of originalId
      this.idMappings.downloadFiles.set(result.insertedId.toString(), result.insertedId)
      console.log(
        `✅ Imported download file: ${transformedData.fileName} (ObjectId: ${result.insertedId})`,
      )
    }

    console.log(`✅ Imported ${filesData.length} download files`)
  }

  // Import courses data
  async importCourses() {
    console.log('📥 Importing courses data...')
    const coursesData = this.loadJsonData('ca_courses_copy.json')
    const coursesCollection = this.db.collection('courses')

    for (const courseData of coursesData) {
      const transformedData = this.transformCourseData(courseData)

      // Map categoryId to actual category ObjectId
      if (transformedData.categoryId) {
        // Find category by originalId in the database
        const category = await this.db.collection('exam_categories').findOne({
          originalId: transformedData.categoryId,
        })
        if (category) {
          transformedData.category = category._id
          delete transformedData.categoryId
        } else {
          console.log(
            `⚠️  No category found for course: ${transformedData.course_name} (categoryId: ${transformedData.categoryId})`,
          )
        }
      }

      const result = await coursesCollection.insertOne(transformedData)
      // Map using ObjectId instead of originalId
      this.idMappings.courses.set(result.insertedId.toString(), result.insertedId)
      console.log(
        `✅ Imported course: ${transformedData.course_name} (ObjectId: ${result.insertedId})`,
      )
    }

    console.log(`✅ Imported ${coursesData.length} courses`)
  }

  // Populate reverse relationships after all imports
  async populateReverseRelationships() {
    console.log('🔄 Populating reverse relationships...')

    // Populate exams.categories from exam_categories.exam
    console.log('📋 Populating exams.categories...')
    const examCategories = await this.db.collection('exam_categories').find({}).toArray()
    const examCategoriesByExam = new Map()

    for (const category of examCategories) {
      if (category.exam) {
        if (!examCategoriesByExam.has(category.exam.toString())) {
          examCategoriesByExam.set(category.exam.toString(), [])
        }
        examCategoriesByExam.get(category.exam.toString()).push(category._id)
      }
    }

    for (const [examId, categoryIds] of examCategoriesByExam) {
      await this.db
        .collection('exams')
        .updateOne({ _id: new ObjectId(examId) }, { $set: { categories: categoryIds } })
    }
    console.log(`✅ Updated ${examCategoriesByExam.size} exams with categories`)

    // Populate exam_categories.examInfos from exam_infos.category
    console.log('📋 Populating exam_categories.examInfos...')
    const examInfos = await this.db.collection('exam_infos').find({}).toArray()
    const examInfosByCategory = new Map()

    for (const examInfo of examInfos) {
      if (examInfo.category) {
        if (!examInfosByCategory.has(examInfo.category.toString())) {
          examInfosByCategory.set(examInfo.category.toString(), [])
        }
        examInfosByCategory.get(examInfo.category.toString()).push(examInfo._id)
      }
    }

    for (const [categoryId, examInfoIds] of examInfosByCategory) {
      await this.db
        .collection('exam_categories')
        .updateOne({ _id: new ObjectId(categoryId) }, { $set: { examInfos: examInfoIds } })
    }
    console.log(`✅ Updated ${examInfosByCategory.size} categories with exam infos`)

    // Populate exam_infos.examSubInfos from exam_sub_infos.examInfo
    console.log('📋 Populating exam_infos.examSubInfos...')
    const examSubInfos = await this.db.collection('exam_sub_infos').find({}).toArray()
    const examSubInfosByExamInfo = new Map()

    for (const examSubInfo of examSubInfos) {
      if (examSubInfo.examInfo) {
        if (!examSubInfosByExamInfo.has(examSubInfo.examInfo.toString())) {
          examSubInfosByExamInfo.set(examSubInfo.examInfo.toString(), [])
        }
        examSubInfosByExamInfo.get(examSubInfo.examInfo.toString()).push(examSubInfo._id)
      }
    }

    for (const [examInfoId, examSubInfoIds] of examSubInfosByExamInfo) {
      await this.db
        .collection('exam_infos')
        .updateOne({ _id: new ObjectId(examInfoId) }, { $set: { examSubInfos: examSubInfoIds } })
    }
    console.log(`✅ Updated ${examSubInfosByExamInfo.size} exam infos with sub infos`)

    // Populate exam_categories.downloadFolders from download_folders.category
    console.log('📋 Populating exam_categories.downloadFolders...')
    const downloadFolders = await this.db.collection('download_folders').find({}).toArray()
    const downloadFoldersByCategory = new Map()

    for (const downloadFolder of downloadFolders) {
      if (downloadFolder.category) {
        if (!downloadFoldersByCategory.has(downloadFolder.category.toString())) {
          downloadFoldersByCategory.set(downloadFolder.category.toString(), [])
        }
        downloadFoldersByCategory.get(downloadFolder.category.toString()).push(downloadFolder._id)
      }
    }

    for (const [categoryId, downloadFolderIds] of downloadFoldersByCategory) {
      await this.db
        .collection('exam_categories')
        .updateOne(
          { _id: new ObjectId(categoryId) },
          { $set: { downloadFolders: downloadFolderIds } },
        )
    }
    console.log(`✅ Updated ${downloadFoldersByCategory.size} categories with download folders`)

    // Populate download_folders.subFolders from download_sub_folders.downloadFolder
    console.log('📋 Populating download_folders.subFolders...')
    const downloadSubFolders = await this.db.collection('download_sub_folders').find({}).toArray()
    const downloadSubFoldersByFolder = new Map()

    for (const downloadSubFolder of downloadSubFolders) {
      if (downloadSubFolder.downloadFolder) {
        if (!downloadSubFoldersByFolder.has(downloadSubFolder.downloadFolder.toString())) {
          downloadSubFoldersByFolder.set(downloadSubFolder.downloadFolder.toString(), [])
        }
        downloadSubFoldersByFolder
          .get(downloadSubFolder.downloadFolder.toString())
          .push(downloadSubFolder._id)
      }
    }

    for (const [folderId, subFolderIds] of downloadSubFoldersByFolder) {
      await this.db
        .collection('download_folders')
        .updateOne({ _id: new ObjectId(folderId) }, { $set: { subFolders: subFolderIds } })
    }
    console.log(`✅ Updated ${downloadSubFoldersByFolder.size} download folders with sub folders`)

    // Populate download_sub_folders.files from download_files.downloadSubFolder
    console.log('📋 Populating download_sub_folders.files...')
    const downloadFiles = await this.db.collection('download_files').find({}).toArray()
    const downloadFilesBySubFolder = new Map()

    for (const downloadFile of downloadFiles) {
      if (downloadFile.downloadSubFolder) {
        if (!downloadFilesBySubFolder.has(downloadFile.downloadSubFolder.toString())) {
          downloadFilesBySubFolder.set(downloadFile.downloadSubFolder.toString(), [])
        }
        downloadFilesBySubFolder
          .get(downloadFile.downloadSubFolder.toString())
          .push(downloadFile._id)
      }
    }

    for (const [subFolderId, fileIds] of downloadFilesBySubFolder) {
      await this.db
        .collection('download_sub_folders')
        .updateOne({ _id: new ObjectId(subFolderId) }, { $set: { files: fileIds } })
    }
    console.log(`✅ Updated ${downloadFilesBySubFolder.size} download sub folders with files`)

    // Populate exam_categories.courses from courses.category
    console.log('📋 Populating exam_categories.courses...')
    const courses = await this.db.collection('courses').find({}).toArray()
    const coursesByCategory = new Map()

    for (const course of courses) {
      if (course.category) {
        if (!coursesByCategory.has(course.category.toString())) {
          coursesByCategory.set(course.category.toString(), [])
        }
        coursesByCategory.get(course.category.toString()).push(course._id)
      }
    }

    for (const [categoryId, courseIds] of coursesByCategory) {
      await this.db
        .collection('exam_categories')
        .updateOne({ _id: new ObjectId(categoryId) }, { $set: { courses: courseIds } })
    }
    console.log(`✅ Updated ${coursesByCategory.size} categories with courses`)

    console.log('🎉 Reverse relationships populated successfully!')
  }

  // Create embedded collections (Alternative approach)
  async createEmbeddedCollections() {
    console.log('📥 Creating embedded collections...')

    // Load all data
    const examsData = this.loadJsonData('exams.json')
    const categoriesData = this.loadJsonData('exam_categories.json')
    const infosData = this.loadJsonData('exam_infos.json')
    const subInfosData = this.loadJsonData('exam_sub_infos.json')
    const foldersData = this.loadJsonData('download_folders.json')
    const subFoldersData = this.loadJsonData('download_sub_folders.json')
    const filesData = this.loadJsonData('download_files.json')

    const embeddedCollection = this.db.collection('exams_embedded')

    for (const examData of examsData) {
      const exam = this.transformExamData(examData)

      // Find categories for this exam
      const examCategories = categoriesData
        .filter((cat) => parseInt(cat.exam_id) === exam.originalId)
        .map((categoryData) => {
          const category = this.transformExamCategoryData(categoryData)

          // Find exam infos for this category
          const categoryInfos = infosData
            .filter((info) => parseInt(info.category_id) === category.originalId)
            .map((infoData) => {
              const info = this.transformExamInfoData(infoData)

              // Find sub infos for this exam info
              const infoSubInfos = subInfosData
                .filter((subInfo) => parseInt(subInfo.menu_id) === info.originalId)
                .map((subInfoData) => this.transformExamSubInfoData(subInfoData))

              info.subInfos = infoSubInfos
              return info
            })

          // Find download folders for this category
          const categoryFolders = foldersData
            .filter((folder) => parseInt(folder.category_id) === category.originalId)
            .map((folderData) => {
              const folder = this.transformDownloadFolderData(folderData)

              // Find sub folders for this download folder
              const folderSubFolders = subFoldersData
                .filter((subFolder) => parseInt(subFolder.menu_id) === folder.originalId)
                .map((subFolderData) => {
                  const subFolder = this.transformDownloadSubFolderData(subFolderData)

                  // Find files for this sub folder
                  const subFolderFiles = filesData
                    .filter((file) => parseInt(file.sub_menu_id) === subFolder.originalId)
                    .map((fileData) => this.transformDownloadFileData(fileData))

                  subFolder.files = subFolderFiles
                  return subFolder
                })

              folder.subFolders = folderSubFolders
              return folder
            })

          category.examInfos = categoryInfos
          category.downloadFolders = categoryFolders
          return category
        })

      exam.categories = examCategories

      await embeddedCollection.insertOne(exam)
      console.log(
        `✅ Created embedded document for exam: ${exam.examName} (ID: ${exam.originalId})`,
      )
    }

    console.log(`✅ Created ${examsData.length} embedded exam documents`)
  }

  // Create indexes for better performance
  async createIndexes() {
    console.log('📊 Creating indexes...')

    const collections = [
      'exams',
      'exam_categories',
      'exam_infos',
      'exam_sub_infos',
      'download_folders',
      'download_sub_folders',
      'download_files',
      'courses',
      'exams_embedded',
    ]

    for (const collectionName of collections) {
      const collection = this.db.collection(collectionName)

      // Create index on originalId for fast lookups
      await collection.createIndex({ originalId: 1 })

      // Create compound indexes for common queries
      if (collectionName === 'exam_categories') {
        await collection.createIndex({ exam: 1, originalId: 1 })
      }
      if (collectionName === 'exam_infos') {
        await collection.createIndex({ category: 1, originalId: 1 })
      }
      if (collectionName === 'exam_sub_infos') {
        await collection.createIndex({ examInfo: 1, originalId: 1 })
      }
      if (collectionName === 'download_folders') {
        await collection.createIndex({ category: 1, originalId: 1 })
      }
      if (collectionName === 'download_sub_folders') {
        await collection.createIndex({ downloadFolder: 1, originalId: 1 })
      }
      if (collectionName === 'download_files') {
        await collection.createIndex({ downloadSubFolder: 1, originalId: 1 })
      }
      if (collectionName === 'courses') {
        await collection.createIndex({ category: 1, originalId: 1 })
      }

      console.log(`✅ Created indexes for ${collectionName}`)
    }
  }

  // Clear existing data (optional)
  async clearExistingData() {
    console.log('🗑️ Clearing existing data...')

    const collections = [
      'exams',
      'exam_categories',
      'exam_infos',
      'exam_sub_infos',
      'download_folders',
      'download_sub_folders',
      'download_files',
      'courses',
      'exams_embedded',
    ]

    for (const collectionName of collections) {
      const collection = this.db.collection(collectionName)
      await collection.deleteMany({})
      console.log(`✅ Cleared ${collectionName}`)
    }
  }

  // Main import function
  async importData(options = {}) {
    const { clearExisting = false, useEmbedded = false, createIndexes = true } = options

    try {
      await this.connect()

      if (clearExisting) {
        await this.clearExistingData()
      }

      if (useEmbedded) {
        await this.createEmbeddedCollections()
      } else {
        // Import in dependency order
        await this.importExams()
        await this.importExamCategories()
        await this.importExamInfos()
        await this.importExamSubInfos()
        await this.importDownloadFolders()
        await this.importDownloadSubFolders()
        await this.importDownloadFiles()
        await this.importCourses()
      }

      // Populate reverse relationships after all imports
      await this.populateReverseRelationships()

      if (createIndexes) {
        await this.createIndexes()
      }

      console.log('🎉 Data import completed successfully!')

      // Print summary
      await this.printSummary()
    } catch (error) {
      console.error('❌ Import failed:', error)
      throw error
    } finally {
      await this.disconnect()
    }
  }

  // Print import summary
  async printSummary() {
    console.log('\n📊 Import Summary:')
    console.log('==================')

    const collections = [
      'exams',
      'exam_categories',
      'exam_infos',
      'exam_sub_infos',
      'download_folders',
      'download_sub_folders',
      'download_files',
      'courses',
      'exams_embedded',
    ]

    for (const collectionName of collections) {
      const collection = this.db.collection(collectionName)
      const count = await collection.countDocuments()
      console.log(`${collectionName}: ${count} documents`)
    }
  }
}

// CLI usage
async function main() {
  console.log('🚀 Starting MongoDB import...')
  console.log('📋 This script imports data with the latest schema structure:')
  console.log('   - SEO fields organized in groups (seo.title, seo.description, seo.keywords)')
  console.log('   - Rich text support for descriptions')
  console.log('   - Proper relationship mappings')

  const args = process.argv.slice(2)
  const options = {
    clearExisting: args.includes('--clear'),
    useEmbedded: args.includes('--embedded'),
    createIndexes: !args.includes('--no-indexes'),
  }

  console.log('Options:', options)
  console.log('Database URI:', MONGODB_URI)
  console.log('Database Name:', DATABASE_NAME)

  try {
    const importer = new MongoDBImporter()
    await importer.importData(options)
    console.log('✅ Import completed successfully!')
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
}

// Export for use as module
module.exports = MongoDBImporter

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}
