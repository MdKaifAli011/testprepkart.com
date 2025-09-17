# TestPrepKart Blog Collection Structure

## Database Structure

Based on your image requirements, here's the complete blog structure:

### Post Collection (Blog Table)

```
┌─────────────────────────────────────┐
│ Post Table (Blog)                   │
├─────────────────────────────────────┤
│ id (Primary Key)                    │
│ title (Text)                        │
│ slug (Text, Unique)                 │
│ description (RichText)              │
│ exam (Relationship to Exam)         │
│ category (Relationship to ExamCategory) │
│ seo_title (Text)                    │
│ seo_description (Text)              │
│ seo_keywords (Text)                 │
│ created_by (Relationship to Users)  │
│ updated_by (Relationship to Users)  │
│ blog_image (Relationship to Media)  │
│ status (Select: published/unpublished/approved/unapproved) │
│ publishedDate (Date)                │
│ createdAt (Timestamp)               │
│ updatedAt (Timestamp)               │
└─────────────────────────────────────┘
```

### BlogComment Collection (Blog Comment Table)

```
┌─────────────────────────────────────┐
│ BlogComment Table                   │
├─────────────────────────────────────┤
│ id (Primary Key)                    │
│ blog (Relationship to Post)         │
│ author_name (Text)                  │
│ author_email (Email)                │
│ comment_author_ip (Text)            │
│ comment_date (Date)                 │
│ content (Textarea)                  │
│ status (Select: approved/unapproved) │
│ replies (Relationship to BlogCommentReply[]) │
│ createdAt (Timestamp)               │
│ updatedAt (Timestamp)               │
└─────────────────────────────────────┘
```

### BlogCommentReply Collection (Blog Comment Reply Table)

```
┌─────────────────────────────────────┐
│ BlogCommentReply Table              │
├─────────────────────────────────────┤
│ id (Primary Key)                    │
│ comment (Relationship to BlogComment) │
│ reply_content (Textarea)            │
│ reply_author_name (Text)            │
│ reply_author_email (Email)          │
│ reply_author_ip (Text)              │
│ reply_date (Date)                   │
│ status (Select: approved/unapproved) │
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
                                   Post (1) ──────── (Many) BlogComment
                                        │                           │
                                        │                           │
                                        └─── title                  └─── author_name
                                            (e.g., "JEE Tips")         (e.g., "John Doe")
                                                                        │
                                                                        │
                                                                        ▼
                                                                   BlogCommentReply
                                                                        │
                                                                        └─── reply_author_name
                                                                            (e.g., "Jane Smith")
```

## Field Mapping from Your Image

### Post Table Fields (from your image):

- ✅ `id` - Primary key
- ✅ `exam_id` - Relationship to Exam collection
- ✅ `category_id` - Relationship to ExamCategory collection
- ✅ `title` - Blog post title
- ✅ `slug` - URL-friendly slug
- ✅ `description` - Main content
- ✅ `seo title` - SEO title
- ✅ `seo description` - SEO description
- ✅ `seo keywords` - SEO keywords
- ✅ `created_by` - User who created the post
- ✅ `updated_by` - User who last updated the post
- ✅ `created_at` - Auto-generated timestamp
- ✅ `updated_at` - Auto-generated timestamp
- ✅ `blog_image` - Main blog image
- ✅ `status` - Publication and approval status

### BlogComment Table Fields (from your image):

- ✅ `id` - Primary key
- ✅ `blog_id` - Relationship to Post collection
- ✅ `author name` - Comment author name
- ✅ `author email` - Comment author email
- ✅ `comment author ip` - Comment author IP
- ✅ `comment date` - Comment date
- ✅ `content` - Comment content
- ✅ `status` - Approval status

### BlogCommentReply Table Fields (from your image):

- ✅ `id` - Primary key
- ✅ `comment id` - Relationship to BlogComment collection
- ✅ `reply content` - Reply content
- ✅ `reply author name` - Reply author name
- ✅ `reply author email` - Reply author email
- ✅ `reply author ip` - Reply author IP
- ✅ `reply Date` - Reply date
- ✅ `status` - Approval status

## Admin Panel Features

### Post Collection (Blog):

- **List View**: Shows title, exam, category, status, createdAt, updatedAt
- **Search**: By title, slug, seo_title, seo_keywords
- **Date Filtering**: By createdAt, updatedAt, publishedDate
- **Status Filtering**: Published, Unpublished, Approved, Unapproved
- **Relationships**: Easy selection of exam, category, created_by, updated_by

### BlogComment Collection:

- **List View**: Shows author_name, author_email, blog, status, comment_date, createdAt
- **Search**: By author_name, author_email, content
- **Date Filtering**: By comment_date, createdAt
- **Status Filtering**: Approved, Unapproved
- **Relationships**: Easy selection of parent blog post

### BlogCommentReply Collection:

- **List View**: Shows reply_author_name, reply_author_email, comment, status, reply_date, createdAt
- **Search**: By reply_author_name, reply_author_email, reply_content
- **Date Filtering**: By reply_date, createdAt
- **Status Filtering**: Approved, Unapproved
- **Relationships**: Easy selection of parent comment

## Example Data Structure

### Sample Blog Post:

```
ID: 1
title: "JEE Main Preparation Tips 2024"
slug: "jee-main-preparation-tips-2024"
description: "Complete guide for JEE Main preparation..."
exam: 1 (links to JEE Main)
category: 1 (links to Engineering)
seo_title: "JEE Main Preparation Tips 2024 - Complete Guide"
seo_description: "Get the best JEE Main preparation tips for 2024"
seo_keywords: "JEE Main, preparation, tips, 2024"
created_by: 1 (links to user)
updated_by: 1 (links to user)
blog_image: 1 (links to media)
status: "published"
publishedDate: "2024-01-15"
```

### Sample Blog Comment:

```
ID: 1
blog: 1 (links to JEE Main Preparation Tips)
author_name: "Rahul Sharma"
author_email: "rahul@example.com"
comment_author_ip: "192.168.1.1"
comment_date: "2024-01-16"
content: "Great tips! Very helpful for my preparation."
status: "approved"
```

### Sample Blog Comment Reply:

```
ID: 1
comment: 1 (links to the comment above)
reply_content: "I agree! These tips really helped me too."
reply_author_name: "Priya Patel"
reply_author_email: "priya@example.com"
reply_author_ip: "192.168.1.2"
reply_date: "2024-01-16"
status: "approved"
```

## API Endpoints

### Blog Posts:

- `GET /api/post` - List all blog posts
- `POST /api/post` - Create new blog post
- `GET /api/post/{id}` - Get specific blog post
- `PATCH /api/post/{id}` - Update blog post
- `DELETE /api/post/{id}` - Delete blog post

### Blog Comments:

- `GET /api/blog-comments` - List all comments
- `POST /api/blog-comments` - Create new comment
- `GET /api/blog-comments/{id}` - Get specific comment
- `PATCH /api/blog-comments/{id}` - Update comment
- `DELETE /api/blog-comments/{id}` - Delete comment

### Blog Comment Replies:

- `GET /api/blog-comment-replies` - List all replies
- `POST /api/blog-comment-replies` - Create new reply
- `GET /api/blog-comment-replies/{id}` - Get specific reply
- `PATCH /api/blog-comment-replies/{id}` - Update reply
- `DELETE /api/blog-comment-replies/{id}` - Delete reply

This structure now matches exactly what you showed in your image for the blog section! 🎯
