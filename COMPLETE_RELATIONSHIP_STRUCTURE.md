# TestPrepKart Complete Collection Relationship Structure

## 🏗️ Complete Database Architecture

This document shows the complete relationship structure of all collections in your TestPrepKart application.

## 📊 Collection Overview

### Core Collections:

1. **Users** - User management
2. **Media** - File uploads and media management
3. **Contact** - Lead management and inquiries

### Exam System Collections:

4. **ExamCategory** - Exam categories (Engineering, Medical, etc.)
5. **Exam** - Individual exams (JEE Main, NEET, etc.)
6. **ExamInfo** - Exam information and study materials
7. **ExamSubInfo** - Sub-information sections for exams

### Download System Collections:

8. **DownloadMenu** - Download folders for exams
9. **SubFolder** - Sub-folders within download menus

### Blog System Collections:

10. **Post** - Blog posts and articles
11. **BlogComment** - Comments on blog posts
12. **BlogCommentReply** - Replies to blog comments

## 🔗 Complete Relationship Diagram

```
                    ┌─────────────────┐
                    │     Users       │
                    │   (Admin)       │
                    └─────────┬───────┘
                              │
                              │ (created_by, updated_by)
                              │
                    ┌─────────▼───────┐
                    │     Media       │
                    │   (Files)       │
                    └─────────┬───────┘
                              │
                              │ (blog_image, files)
                              │
                    ┌─────────▼───────┐
                    │   Contact       │
                    │   (Leads)       │
                    └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              EXAM SYSTEM                                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  ExamCategory   │◄───┤      Exam       │◄───┤    ExamInfo     │◄───┤   ExamSubInfo   │
│   (1)           │    │   (Many)        │    │   (Many)        │    │   (Many)        │
│                 │    │                 │    │                 │    │                 │
│ • categoryName  │    │ • examName      │    │ • menuName      │    │ • subMenuName   │
│ • exams[]       │    │ • category      │    │ • exam          │    │ • menuId        │
│                 │    │                 │    │ • category      │    │ • seo_title     │
│                 │    │                 │    │ • seo_title     │    │ • seo_description│
│                 │    │                 │    │ • seo_description│   │ • seo_keywords  │
│                 │    │                 │    │ • seo_keywords  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │                       │
         │                       │                       │                       │
         └───────────────────────┼───────────────────────┼───────────────────────┘
                                 │                       │
                                 │                       │
                    ┌────────────▼────────────┐          │
                    │     DownloadMenu        │          │
                    │      (Many)             │          │
                    │                         │          │
                    │ • menuName              │          │
                    │ • exam                  │          │
                    │ • category              │          │
                    │ • seo_title             │          │
                    │ • seo_description       │          │
                    │ • seo_keywords          │          │
                    │ • subFolders[]          │          │
                    └────────────┬────────────┘          │
                                 │                       │
                                 │                       │
                    ┌────────────▼────────────┐          │
                    │      SubFolder          │          │
                    │      (Many)             │          │
                    │                         │          │
                    │ • subMenuName           │          │
                    │ • menuId                │          │
                    │ • order                 │          │
                    │ • files[]               │          │
                    └─────────────────────────┘          │
                                                         │
                    ┌─────────────────────────────────────▼─────────────┐
                    │                    BLOG SYSTEM                    │
                    └─────────────────────────────────────────────────┘
                                                         │
                    ┌─────────────────────────────────────▼─────────────┐
                    │                    Post                           │
                    │                  (Blog)                          │
                    │                                                 │
                    │ • title                                         │
                    │ • slug                                          │
                    │ • description                                   │
                    │ • exam (relationship)                           │
                    │ • category (relationship)                       │
                    │ • seo_title                                     │
                    │ • seo_description                               │
                    │ • seo_keywords                                  │
                    │ • created_by (relationship)                     │
                    │ • updated_by (relationship)                     │
                    │ • blog_image (relationship)                     │
                    │ • status                                        │
                    │ • publishedDate                                 │
                    └─────────────────────┬───────────────────────────┘
                                          │
                                          │ (blog)
                                          │
                    ┌─────────────────────▼───────────────────────────┐
                    │                BlogComment                      │
                    │                  (Many)                         │
                    │                                                 │
                    │ • blog (relationship)                          │
                    │ • author_name                                   │
                    │ • author_email                                  │
                    │ • comment_author_ip                             │
                    │ • comment_date                                  │
                    │ • content                                       │
                    │ • status                                        │
                    │ • replies[] (relationship)                     │
                    └─────────────────────┬───────────────────────────┘
                                          │
                                          │ (comment)
                                          │
                    ┌─────────────────────▼───────────────────────────┐
                    │              BlogCommentReply                   │
                    │                  (Many)                         │
                    │                                                 │
                    │ • comment (relationship)                       │
                    │ • reply_content                                 │
                    │ • reply_author_name                             │
                    │ • reply_author_email                            │
                    │ • reply_author_ip                               │
                    │ • reply_date                                    │
                    │ • status                                        │
                    └─────────────────────────────────────────────────┘
```

## 🔄 Detailed Relationship Flow

### 1. **Exam System Hierarchy**

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

### 2. **Download System Hierarchy**

```
Exam (1) ──────── (Many) DownloadMenu
  │                        │
  │                        │
  └─── examName            └─── menuName
      (e.g., "JEE Main")       (e.g., "Study Material")
                                │
                                │
                                ▼
                           SubFolder (Many)
                                │
                                └─── subMenuName
                                    (e.g., "Physics PDFs")
```

### 3. **Blog System Hierarchy**

```
Post (1) ──────── (Many) BlogComment
  │                        │
  │                        │
  └─── title               └─── author_name
      (e.g., "JEE Tips")       (e.g., "John Doe")
                                │
                                │
                                ▼
                           BlogCommentReply (Many)
                                │
                                └─── reply_author_name
                                    (e.g., "Jane Smith")
```

## 📋 Collection Details

### **Core Collections**

#### Users Collection

- **Purpose**: Admin user management
- **Key Fields**: email, password, role
- **Relationships**: Referenced by created_by, updated_by in other collections

#### Media Collection

- **Purpose**: File uploads and media management
- **Key Fields**: filename, alt, url, mimeType
- **Relationships**: Referenced by blog_image, files in other collections

#### Contact Collection

- **Purpose**: Lead management and inquiries
- **Key Fields**: name, email, mobile, class, message
- **Relationships**: Standalone collection

### **Exam System Collections**

#### ExamCategory Collection

- **Purpose**: Categorize exams (Engineering, Medical, Management)
- **Key Fields**: categoryName
- **Relationships**:
  - One-to-Many with Exam
  - Referenced by category in ExamInfo, DownloadMenu, Post

#### Exam Collection

- **Purpose**: Individual exams (JEE Main, NEET, GATE)
- **Key Fields**: examName, category
- **Relationships**:
  - Many-to-One with ExamCategory
  - One-to-Many with ExamInfo, DownloadMenu, Post

#### ExamInfo Collection

- **Purpose**: Exam information and study materials
- **Key Fields**: menuName, exam, category, seo_title, seo_description, seo_keywords
- **Relationships**:
  - Many-to-One with Exam
  - Many-to-One with ExamCategory
  - One-to-Many with ExamSubInfo

#### ExamSubInfo Collection

- **Purpose**: Sub-information sections for exams
- **Key Fields**: subMenuName, menuId, seo_title, seo_description, seo_keywords
- **Relationships**:
  - Many-to-One with ExamInfo

### **Download System Collections**

#### DownloadMenu Collection

- **Purpose**: Download folders for different exam types
- **Key Fields**: menuName, exam, category, seo_title, seo_description, seo_keywords
- **Relationships**:
  - Many-to-One with Exam
  - Many-to-One with ExamCategory
  - One-to-Many with SubFolder

#### SubFolder Collection

- **Purpose**: Sub-folders within download menus
- **Key Fields**: subMenuName, menuId, order, files
- **Relationships**:
  - Many-to-One with DownloadMenu

### **Blog System Collections**

#### Post Collection

- **Purpose**: Blog posts and articles
- **Key Fields**: title, slug, description, exam, category, seo_title, seo_description, seo_keywords, created_by, updated_by, blog_image, status, publishedDate
- **Relationships**:
  - Many-to-One with Exam
  - Many-to-One with ExamCategory
  - Many-to-One with Users (created_by, updated_by)
  - Many-to-One with Media (blog_image)
  - One-to-Many with BlogComment

#### BlogComment Collection

- **Purpose**: Comments on blog posts
- **Key Fields**: blog, author_name, author_email, comment_author_ip, comment_date, content, status
- **Relationships**:
  - Many-to-One with Post
  - One-to-Many with BlogCommentReply

#### BlogCommentReply Collection

- **Purpose**: Replies to blog comments
- **Key Fields**: comment, reply_content, reply_author_name, reply_author_email, reply_author_ip, reply_date, status
- **Relationships**:
  - Many-to-One with BlogComment

## 🎯 Key Relationship Patterns

### **One-to-Many Relationships**

- ExamCategory → Exam
- Exam → ExamInfo
- ExamInfo → ExamSubInfo
- Exam → DownloadMenu
- DownloadMenu → SubFolder
- Post → BlogComment
- BlogComment → BlogCommentReply

### **Many-to-One Relationships**

- Exam → ExamCategory
- ExamInfo → Exam
- ExamInfo → ExamCategory
- ExamSubInfo → ExamInfo
- DownloadMenu → Exam
- DownloadMenu → ExamCategory
- SubFolder → DownloadMenu
- Post → Exam
- Post → ExamCategory
- BlogComment → Post
- BlogCommentReply → BlogComment

### **Cross-System Relationships**

- Post → Exam (Blog posts related to specific exams)
- Post → ExamCategory (Blog posts categorized by exam type)
- All collections → Users (created_by, updated_by tracking)
- All collections → Media (file uploads and images)

## 🚀 Admin Panel Organization

### **Grouped Collections**

- **Exams**: ExamCategory, Exam, ExamInfo, ExamSubInfo
- **DownloadMenus**: DownloadMenu, SubFolder
- **Blog**: Post, BlogComment, BlogCommentReply
- **Content**: Media
- **Contacts**: Contact
- **Users**: Users

### **Search and Filtering**

- **Date Filtering**: All collections support createdAt, updatedAt filtering
- **Text Search**: Title, name, and content fields are searchable
- **Status Filtering**: Collections with status fields support approval filtering
- **Relationship Filtering**: Easy selection through dropdown relationships

This complete structure provides a robust, scalable foundation for your TestPrepKart application! 🎉
