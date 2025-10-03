// Core Collections
export { Users } from './Users'
export { Media } from './Media'

// Exam Collections
export { Exams } from './Exams'
export { ExamCategories } from './ExamCategories'
export { ExamInfos } from './ExamInfos'
export { ExamSubInfos } from './ExamSubInfos'

// Download Collections
export { DownloadFolders } from './DownloadFolders'
export { DownloadSubFolders } from './DownloadSubFolders'
export { DownloadFiles } from './DownloadFiles'

// Course Collections
export { Courses } from './Courses'

// Blog Collections
export { JeeBlogs } from './JeeBlogs'
export { NeetBlogs } from './NeetBlogs'
export { SchoolBlogs } from './SchoolBlogs'
export { SatBlogs } from './SatBlogs'
export { IdBlogs } from './IdBlogs'
export { ApBlogs } from './ApBlogs'

// Import collections for grouping (re-import for internal use)
import { Users } from './Users'
import { Media } from './Media'
import { Exams } from './Exams'
import { ExamCategories } from './ExamCategories'
import { ExamInfos } from './ExamInfos'
import { ExamSubInfos } from './ExamSubInfos'
import { DownloadFolders } from './DownloadFolders'
import { DownloadSubFolders } from './DownloadSubFolders'
import { DownloadFiles } from './DownloadFiles'
import { Courses } from './Courses'
import { JeeBlogs } from './JeeBlogs'
import { NeetBlogs } from './NeetBlogs'
import { SchoolBlogs } from './SchoolBlogs'
import { SatBlogs } from './SatBlogs'
import { IdBlogs } from './IdBlogs'
import { ApBlogs } from './ApBlogs'

// Collection Groups for easy importing
export const coreCollections = [Users, Media]

export const examCollections = [Exams, ExamCategories, ExamInfos, ExamSubInfos]

export const downloadCollections = [DownloadFolders, DownloadSubFolders, DownloadFiles]

export const courseCollections = [Courses]

export const blogCollections = [JeeBlogs, NeetBlogs, SchoolBlogs, SatBlogs, IdBlogs, ApBlogs]

// All collections combined
export const allCollections = [
  ...coreCollections,
  ...examCollections,
  ...downloadCollections,
  ...courseCollections,
  ...blogCollections,
]
