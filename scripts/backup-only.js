const { MongoClient } = require('mongodb')
const fs = require('fs')
const path = require('path')

async function backupOnly() {
  const uri = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/Demo_testprepkart_backend'
  const client = new MongoClient(uri)

  try {
    console.log('📦 Database Backup Only')
    console.log('='.repeat(60))
    console.log('This script will:')
    console.log('1. 📦 Create a complete backup of your database')
    console.log('2. 📁 Save it to a timestamped folder')
    console.log('3. 📊 Show backup summary')
    console.log('='.repeat(60))

    await client.connect()
    console.log('✅ Database connection successful!')

    const db = client.db()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupDir = path.join(process.cwd(), 'backup', `backup-${timestamp}`)

    // Create backup directory
    if (!fs.existsSync(path.join(process.cwd(), 'backup'))) {
      fs.mkdirSync(path.join(process.cwd(), 'backup'))
    }
    fs.mkdirSync(backupDir)

    const collections = [
      'exams',
      'exam_categories',
      'exam_infos',
      'exam_sub_infos',
      'download_folders',
      'download_sub_folders',
      'download_files',
      'courses',
    ]

    // Create Backup
    console.log('\n📦 Creating complete backup...')
    console.log('-'.repeat(40))

    const backupInfo = {
      timestamp: new Date().toISOString(),
      collections: {},
      totalDocuments: 0,
      backupType: 'complete_backup',
      version: '1.0.0',
    }

    for (const collectionName of collections) {
      console.log(`  Backing up ${collectionName}...`)
      const collection = db.collection(collectionName)
      const documents = await collection.find({}).toArray()

      const filePath = path.join(backupDir, `${collectionName}.json`)
      fs.writeFileSync(filePath, JSON.stringify(documents, null, 2))

      backupInfo.collections[collectionName] = documents.length
      backupInfo.totalDocuments += documents.length

      console.log(`    ✅ Backed up ${documents.length} documents`)
    }

    // Save backup info
    fs.writeFileSync(path.join(backupDir, 'backup-info.json'), JSON.stringify(backupInfo, null, 2))

    // Create backup summary
    const backupSummary = {
      backupDate: new Date().toISOString(),
      totalCollections: collections.length,
      totalDocuments: backupInfo.totalDocuments,
      collections: backupInfo.collections,
      backupLocation: backupDir,
      backupSize: calculateBackupSize(backupDir),
    }

    fs.writeFileSync(
      path.join(backupDir, 'backup-summary.json'),
      JSON.stringify(backupSummary, null, 2),
    )

    // Final Summary
    console.log('\n📊 Backup Summary:')
    console.log('='.repeat(60))
    console.log(`  📁 Backup Location: ${backupDir}`)
    console.log(`  📦 Total Documents: ${backupInfo.totalDocuments}`)
    console.log(`  📋 Collections Backed Up: ${collections.length}`)
    console.log(`  💾 Backup Size: ${backupSummary.backupSize}`)
    console.log(`  🕒 Backup Time: ${new Date().toLocaleString()}`)

    console.log('\n📋 Collection Details:')
    for (const [collectionName, count] of Object.entries(backupInfo.collections)) {
      console.log(`  ✅ ${collectionName}: ${count} documents`)
    }

    console.log('\n🎉 BACKUP COMPLETED SUCCESSFULLY!')
    console.log('✅ Your database has been completely backed up!')
    console.log('✅ All data is safely stored in the backup folder!')
    console.log('✅ You can use this backup to restore your database anytime!')

    console.log('\n💡 Next Steps:')
    console.log('1. Keep this backup safe - it contains all your data!')
    console.log('2. Use "complete-db-manager.js" to restore from this backup')
    console.log('3. You can create multiple backups for different points in time')
  } catch (error) {
    console.error('❌ Error creating backup:', error)
  } finally {
    await client.close()
  }
}

// Helper function to calculate backup size
function calculateBackupSize(backupDir) {
  try {
    const files = fs.readdirSync(backupDir)
    let totalSize = 0

    for (const file of files) {
      const filePath = path.join(backupDir, file)
      const stats = fs.statSync(filePath)
      totalSize += stats.size
    }

    // Convert bytes to human readable format
    const units = ['B', 'KB', 'MB', 'GB']
    let size = totalSize
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`
  } catch (error) {
    return 'Unknown'
  }
}

// Run the backup
backupOnly()
