// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Contact } from './collections/Contact'
import { Exam } from './collections/Exam'
import { Post } from './collections/Post'
import { DownloadMenu } from './collections/DownloadMenu'
import { SubFolder } from './collections/SubFolder'
import { ExamCategory } from './collections/ExamCategory'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Exam, Contact, Post, DownloadMenu, SubFolder, ExamCategory ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here-change-this-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb+srv://hellomdkaifali_db_user:ht0t1iEmhCkorBqf@backend.zzjdjsk.mongodb.net/?retryWrites=true&w=majority&appName=Backend',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
