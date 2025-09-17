# TestPrepKart Complete Collection Structure

## Database Structure

Based on your image requirements, here's the complete structure of all your collections:

### ExamCategory Collection (Parent)

```
┌─────────────────────────────────────┐
│ ExamCategory Table                  │
├─────────────────────────────────────┤
│ id (Primary Key)                    │
│ categoryName (Text)                 │
│ exams (Relationship to Exam[])      │
│ createdAt (Timestamp)               │
│ updatedAt (Timestamp)               │
└─────────────────────────────────────┘
```

### Exam Collection (Child)

```
┌─────────────────────────────────────┐
│ Exam Table                          │
├─────────────────────────────────────┤
│ id (Primary Key)                    │
│ examName (Text)                     │
│ category (Relationship to ExamCategory) │
│ createdAt (Timestamp)               │
│ updatedAt (Timestamp)               │
└─────────────────────────────────────┘
```

### ExamInfo Collection (Menu Level)

```
┌─────────────────────────────────────┐
│ ExamInfo Table                      │
├─────────────────────────────────────┤
│ id (Primary Key)                    │
│ menuName (Text)                     │
│ exam (Relationship to Exam)         │
│ category (Relationship to ExamCategory) │
│ seo_title (Text)                    │
│ seo_description (Text)              │
│ seo_keywords (Text)                 │
│ createdAt (Timestamp)               │
│ updatedAt (Timestamp)               │
└─────────────────────────────────────┘
```

### ExamSubInfo Collection (Sub Menu Level)

```
┌─────────────────────────────────────┐
│ ExamSubInfo Table                   │
├─────────────────────────────────────┤
│ id (Primary Key)                    │
│ subMenuName (Text)                  │
│ menuId (Relationship to ExamInfo)   │
│ seo_title (Text)                    │
│ seo_description (Text)              │
│ seo_keywords (Text)                 │
│ createdAt (Timestamp)               │
│ updatedAt (Timestamp)               │
└─────────────────────────────────────┘
```

### DownloadMenu Collection (Download Folder Level)

```
┌─────────────────────────────────────┐
│ DownloadMenu Table                  │
├─────────────────────────────────────┤
│ id (Primary Key)                    │
│ menuName (Text)                     │
│ exam (Relationship to Exam)         │
│ category (Relationship to ExamCategory) │
│ seo_title (Text)                    │
│ seo_description (Text)              │
│ seo_keywords (Text)                 │
│ sortOrder (Number)                  │
│ subFolders (Relationship to SubFolder[]) │
│ createdAt (Timestamp)               │
│ updatedAt (Timestamp)               │
└─────────────────────────────────────┘
```

### SubFolder Collection (Download Sub-Folder Level)

```
┌─────────────────────────────────────┐
│ SubFolder Table                     │
├─────────────────────────────────────┤
│ id (Primary Key)                    │
│ subMenuName (Text)                  │
│ menuId (Relationship to DownloadMenu) │
│ order (Number)                      │
│ files (Array of File Objects)       │
│ createdAt (Timestamp)               │
│ updatedAt (Timestamp)               │
└─────────────────────────────────────┘
```

## Complete Relationship Flow

```
ExamCategory (1) ──────── (Many) Exam
     │                           │
     │                           │
     └─── categoryName           └─── examName
         (e.g., "Engineering")       (e.g., "JEE Main")
                                        │
                                        │
                                        ▼
                                   ExamInfo (1) ──────── (Many) ExamSubInfo
                                        │                           │
                                        │                           │
                                        └─── menuName               └─── subMenuName
                                            (e.g., "Study Guide")      (e.g., "Physics Notes")
                                        │
                                        │
                                        ▼
                                   DownloadMenu (1) ──────── (Many) SubFolder
                                        │                           │
                                        │                           │
                                        └─── menuName               └─── subMenuName
                                            (e.g., "Download Folder")   (e.g., "PDF Files")
```

## Field Mapping from Your Image

### DownloadMenu Table Fields (from your image):

- ✅ `id` - Primary key
- ✅ `exam_id` - Relationship to Exam collection
- ✅ `category_id` - Relationship to ExamCategory collection
- ✅ `menu name` - Now called `menuName`
- ✅ `seo title` - Now called `seo_title`
- ✅ `seo description` - Now called `seo_description`
- ✅ `seo keywords` - Now called `seo_keywords`
- ✅ `created_at` - Auto-generated timestamp
- ✅ `updated_at` - Auto-generated timestamp

### SubFolder Table Fields (from your image):

- ✅ `id` - Primary key
- ✅ `menu id` - Relationship to DownloadMenu collection (now called `menuId`)
- ✅ `sub menu name` - Now called `subMenuName`
- ✅ `created_at` - Auto-generated timestamp
- ✅ `updated_at` - Auto-generated timestamp

## Admin Panel Features

### DownloadMenu Collection:

- **List View**: Shows menuName, exam, category, createdAt, updatedAt
- **Search**: By menuName, seo_title, seo_keywords
- **Date Filtering**: By createdAt and updatedAt
- **Relationships**: Easy selection of exam and category

### SubFolder Collection:

- **List View**: Shows subMenuName, menuId, createdAt, updatedAt
- **Search**: By subMenuName
- **Date Filtering**: By createdAt and updatedAt
- **Relationships**: Easy selection of parent DownloadMenu
- **File Management**: Array of downloadable files with metadata

## Example Data Structure

### Sample DownloadMenu:

```
ID: 1
menuName: "JEE Main Study Materials"
exam: 1 (links to JEE Main)
category: 1 (links to Engineering)
seo_title: "JEE Main Complete Study Materials"
seo_description: "Download complete study materials for JEE Main"
seo_keywords: "JEE Main, study materials, download"
sortOrder: 1
createdAt: 2024-01-15
```

### Sample SubFolder:

```
ID: 1
subMenuName: "Physics Sample Papers"
menuId: 1 (links to JEE Main Study Materials)
order: 1
files: [
  {
    title: "Physics Sample Paper 1",
    url: "https://example.com/physics-paper-1.pdf",
    fileType: "PDF File",
    locked: true,
    order: 1
  }
]
createdAt: 2024-01-15
```

This structure now matches exactly what you showed in your image for all collections! 🎯
