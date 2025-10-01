# Payload CMS Collections

This directory contains all the Payload CMS collections that match the database structure from the MongoDB import script.

## Collection Structure

### Core Collections

1. **Users** (`users`)
   - User authentication and management
   - Fields: name, role, email (auth)

2. **Media** (`media`)
   - File uploads and media management
   - Fields: filename, alt, caption

### Exam-Related Collections

3. **Exams** (`exams`)
   - Main exam categories (International, Engineering, Medical, School)
   - Fields: originalId, examName, categories (relationship), createdAt, updatedAt

4. **ExamCategories** (`exam-categories`)
   - Specific exam types within each main exam category
   - Fields: originalId, exam (relationship), categoryName, seo, examInfos, downloadFolders, courses

5. **ExamInfos** (`exam-infos`)
   - Information sections within exam categories
   - Fields: originalId, category (relationship), menuName, description, seo, subInfos

6. **ExamSubInfos** (`exam-sub-infos`)
   - Sub-information items within exam infos
   - Fields: originalId, examInfo (relationship), subMenuName, description, seo

### Download-Related Collections

7. **DownloadFolders** (`download-folders`)
   - Main download folders organized by category
   - Fields: originalId, category (relationship), menuName, seo, subFolders

8. **DownloadSubFolders** (`download-sub-folders`)
   - Sub-folders within download folders
   - Fields: originalId, downloadFolder (relationship), subMenuName, seo, files

9. **DownloadFiles** (`download-files`)
   - Individual downloadable files
   - Fields: originalId, downloadSubFolder (relationship), fileName, fileUrl, fileType, fileSize, downloadCount

### Course Collections

10. **Courses** (`courses`)
    - Course information and details
    - Fields: originalId, category (relationship), course_name, description, price, rating, duration, faculty info, SEO

## Relationships

```
Exams (1) → (many) ExamCategories (1) → (many) ExamInfos (1) → (many) ExamSubInfos
Exams (1) → (many) ExamCategories (1) → (many) DownloadFolders (1) → (many) DownloadSubFolders (1) → (many) DownloadFiles
Exams (1) → (many) ExamCategories (1) → (many) Courses
```

## Features

- **SEO Support**: All collections include SEO fields (title, description, keywords)
- **Rich Text**: Descriptions use rich text editor for formatted content
- **File Management**: Download files with type detection and size tracking
- **Relationships**: Proper foreign key relationships between collections
- **Timestamps**: Automatic createdAt and updatedAt fields
- **Original ID Tracking**: Maintains original IDs from imported data for reference

## Usage

After running the MongoDB import script, these collections will be populated with data that can be managed through the Payload CMS admin interface at `/admin`.

The collections are designed to maintain the same structure as the original database while providing a modern CMS interface for content management.
