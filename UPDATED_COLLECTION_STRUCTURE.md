# TestPrepKart Updated Collection Structure

## Database Structure

Based on your image requirements, here's the complete structure of your collections:

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
```

## Field Mapping from Your Image

### ExamInfo Table Fields (from your image):

- ✅ `id` - Primary key
- ✅ `exam_id` - Relationship to Exam collection
- ✅ `category_id` - Relationship to ExamCategory collection
- ✅ `menu name` - Now called `menuName`
- ✅ `seo title` - Now called `seo_title`
- ✅ `seo description` - Now called `seo_description`
- ✅ `seo keywords` - Now called `seo_keywords`
- ✅ `created_at` - Auto-generated timestamp
- ✅ `updated_at` - Auto-generated timestamp

### ExamSubInfo Table Fields (from your image):

- ✅ `id` - Primary key
- ✅ `menu_id` - Relationship to ExamInfo collection (now called `menuId`)
- ✅ `sub menu name` - Now called `subMenuName`
- ✅ `seo title` - Now called `seo_title`
- ✅ `seo description` - Now called `seo_description`
- ✅ `seo keywords` - Now called `seo_keywords`
- ✅ `created_at` - Auto-generated timestamp
- ✅ `updated_at` - Auto-generated timestamp

## Admin Panel Features

### ExamInfo Collection:

- **List View**: Shows menuName, exam, category, createdAt, updatedAt
- **Search**: By menuName, seo_title, seo_keywords
- **Date Filtering**: By createdAt and updatedAt
- **Relationships**: Easy selection of exam and category

### ExamSubInfo Collection:

- **List View**: Shows subMenuName, menuId, createdAt, updatedAt
- **Search**: By subMenuName, seo_title, seo_keywords
- **Date Filtering**: By createdAt and updatedAt
- **Relationships**: Easy selection of parent ExamInfo

## Example Data Structure

### Sample ExamCategory:

```
ID: 1
categoryName: "Engineering"
createdAt: 2024-01-15
```

### Sample Exam:

```
ID: 1
examName: "JEE Main"
category: 1 (links to Engineering)
createdAt: 2024-01-15
```

### Sample ExamInfo:

```
ID: 1
menuName: "JEE Main Study Guide"
exam: 1 (links to JEE Main)
category: 1 (links to Engineering)
seo_title: "JEE Main Complete Study Guide"
seo_description: "Complete study materials for JEE Main"
seo_keywords: "JEE Main, study guide, preparation"
createdAt: 2024-01-15
```

### Sample ExamSubInfo:

```
ID: 1
subMenuName: "Physics Notes"
menuId: 1 (links to JEE Main Study Guide)
seo_title: "JEE Main Physics Study Notes"
seo_description: "Detailed physics notes for JEE Main"
seo_keywords: "JEE Main physics, study notes"
createdAt: 2024-01-15
```

This structure now matches exactly what you showed in your image! 🎯
