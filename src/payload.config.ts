// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Import collections and groups from index
import { 
  Users,
  coreCollections,
  examCollections,
  downloadCollections,
  courseCollections,
  blogCollections
} from './collections'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Collections are now imported from the index file

// Log database connection info
const databaseUrl = process.env.DATABASE_URI || ''
const dbName = databaseUrl.split('/').pop()?.split('?')[0] || 'Unknown'

console.log('\n🔌 Database Configuration:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log(`📊 Database Name: ${dbName}`)
console.log(`🌐 Connection URL: ${databaseUrl.replace(/\/\/[^:]+:[^@]+@/, '//*****:*****@')}`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    // Core Collections
    ...coreCollections,
    
    // Exam Collections
    ...examCollections,
    
    // Download Collections
    ...downloadCollections,
    
    // Course Collections
    ...courseCollections,
    
    // Blog Collections
    ...blogCollections,
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    connectOptions: {
      serverSelectionTimeoutMS: 5000,
    },
  }),
  onInit: async (_payload) => {
    const totalCollections = coreCollections.length + examCollections.length + downloadCollections.length + courseCollections.length + blogCollections.length
    
    console.log('\n✅ Payload CMS Initialized Successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`✅ Database Connected: ${dbName}`)
    console.log(`📦 Collections Loaded: ${totalCollections}`)
    console.log(`   - Core: ${coreCollections.length}`)
    console.log(`   - Exams: ${examCollections.length}`)
    console.log(`   - Downloads: ${downloadCollections.length}`)
    console.log(`   - Courses: ${courseCollections.length}`)
    console.log(`   - Blogs: ${blogCollections.length}`)
    console.log(`🔐 Admin User Collection: ${Users.slug}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  },
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
