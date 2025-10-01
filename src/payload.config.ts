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
import { Exams } from './collections/Exams'
import { ExamCategories } from './collections/ExamCategories'
import { ExamInfos } from './collections/ExamInfos'
import { ExamSubInfos } from './collections/ExamSubInfos'
import { DownloadFolders } from './collections/DownloadFolders'
import { DownloadSubFolders } from './collections/DownloadSubFolders'
import { DownloadFiles } from './collections/DownloadFiles'
import { Courses } from './collections/Courses'
import { JeeBlogs } from './collections/JeeBlogs'
import { NeetBlogs } from './collections/NeetBlogs'
import { SchoolBlogs } from './collections/SchoolBlogs'
import { SatBlogs } from './collections/SatBlogs'
import { IdBlogs } from './collections/IdBlogs'
import { ApBlogs } from './collections/ApBlogs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Exams,
    ExamCategories,
    ExamInfos,
    ExamSubInfos,
    DownloadFolders,
    DownloadSubFolders,
    DownloadFiles,
    Courses,
    JeeBlogs,
    NeetBlogs,
    SchoolBlogs,
    SatBlogs,
    IdBlogs,
    ApBlogs,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
