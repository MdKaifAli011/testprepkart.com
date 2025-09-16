# TestPrepKart Complete API Endpoints Documentation

## Base URL

```
http://localhost:3000/api
```

## Complete API Endpoints List

### Individual Resource Endpoints

For operations on specific resources, use the resource ID in the URL:

- **GET** `http://localhost:3000/api/{collection}/{id}` - Get specific resource
- **PUT** `http://localhost:3000/api/{collection}/{id}` - Update specific resource
- **DELETE** `http://localhost:3000/api/{collection}/{id}` - Delete specific resource

**Examples:**

- `GET http://localhost:3000/api/leads/64f1a2b3c4d5e6f7g8h9i0j1` - Get specific lead
- `PUT http://localhost:3000/api/leads/64f1a2b3c4d5e6f7g8h9i0j1` - Update specific lead
- `DELETE http://localhost:3000/api/leads/64f1a2b3c4d5e6f7g8h9i0j1` - Delete specific lead

---

## Collection APIs

### 1. Exam Categories API

**Full Path:** `http://localhost:3000/api/exam-category`

- **GET** `http://localhost:3000/api/exam-category` - Retrieve exam categories with filtering and pagination
- **POST** `http://localhost:3000/api/exam-category` - Create new exam category
- **PUT** `http://localhost:3000/api/exam-category/{id}` - Update existing exam category
- **DELETE** `http://localhost:3000/api/exam-category/{id}` - Delete exam category

### 2. Exams API

**Full Path:** `http://localhost:3000/api/exam`

- **GET** `http://localhost:3000/api/exam` - Retrieve exams with filtering and pagination
- **POST** `http://localhost:3000/api/exam` - Create new exam
- **PUT** `http://localhost:3000/api/exam/{id}` - Update existing exam
- **DELETE** `http://localhost:3000/api/exam/{id}` - Delete exam

### 3. Leads (Contact) API

**Full Path:** `http://localhost:3000/api/leads`

- **GET** `http://localhost:3000/api/leads` - Retrieve leads with filtering, search, and pagination
- **POST** `http://localhost:3000/api/leads` - Create new lead
- **PUT** `http://localhost:3000/api/leads/{id}` - Update existing lead
- **DELETE** `http://localhost:3000/api/leads/{id}` - Delete lead

### 4. Posts API

**Full Path:** `http://localhost:3000/api/posts`

- **GET** `http://localhost:3000/api/posts` - Retrieve posts with filtering and pagination
- **POST** `http://localhost:3000/api/posts` - Create new post
- **PUT** `http://localhost:3000/api/posts/{id}` - Update existing post
- **DELETE** `http://localhost:3000/api/posts/{id}` - Delete post

### 5. Download Menus API

**Full Path:** `http://localhost:3000/api/download-menus`

- **GET** `http://localhost:3000/api/download-menus` - Retrieve download menus with filtering and pagination
- **POST** `http://localhost:3000/api/download-menus` - Create new download menu
- **PUT** `http://localhost:3000/api/download-menus/{id}` - Update existing download menu
- **DELETE** `http://localhost:3000/api/download-menus/{id}` - Delete download menu

### 6. Sub Folders API

**Full Path:** `http://localhost:3000/api/sub-folders`

- **GET** `http://localhost:3000/api/sub-folders` - Retrieve sub folders with filtering and pagination
- **POST** `http://localhost:3000/api/sub-folders` - Create new sub folder
- **PUT** `http://localhost:3000/api/sub-folders/{id}` - Update existing sub folder
- **DELETE** `http://localhost:3000/api/sub-folders/{id}` - Delete sub folder

### 7. Media API

**Full Path:** `http://localhost:3000/api/media`

- **GET** `http://localhost:3000/api/media` - Retrieve media files with filtering and pagination
- **POST** `http://localhost:3000/api/media` - Upload new media file
- **PUT** `http://localhost:3000/api/media/{id}` - Update existing media file
- **DELETE** `http://localhost:3000/api/media/{id}` - Delete media file

### 8. Statistics API

**Full Path:** `http://localhost:3000/api/stats`

- **GET** `http://localhost:3000/api/stats` - Get comprehensive statistics and analytics
- **POST** - Not available (read-only)
- **PUT** - Not available (read-only)
- **DELETE** - Not available (read-only)

### 9. Exam Info API

**Full Path:** `http://localhost:3000/api/exam-info`

- **GET** `http://localhost:3000/api/exam-info` - Retrieve exam information with filtering and pagination
- **POST** `http://localhost:3000/api/exam-info` - Create new exam information
- **PUT** `http://localhost:3000/api/exam-info/{id}` - Update existing exam information
- **DELETE** `http://localhost:3000/api/exam-info/{id}` - Delete exam information

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in title, description, seo fields
- `exam` - Filter by exam ID
- `infoType` - Filter by information type (study-guide, practice-tests, etc.)
- `difficulty` - Filter by difficulty (easy, medium, hard, mixed)
- `isActive` - Filter by active status
- `startDate` - Filter by start date (ISO format)
- `endDate` - Filter by end date (ISO format)
- `sort` - Sort field (default: createdAt)
- `order` - Sort order: asc/desc (default: desc)

**Example:**

```bash
GET http://localhost:3000/api/exam-info?exam=EXAM_ID&infoType=study-guide&difficulty=medium
```

### 10. Exam Sub Info API

**Full Path:** `http://localhost:3000/api/exam-sub-info`

- **GET** `http://localhost:3000/api/exam-sub-info` - Retrieve exam sub information with filtering and pagination
- **POST** `http://localhost:3000/api/exam-sub-info` - Create new exam sub information
- **PUT** `http://localhost:3000/api/exam-sub-info/{id}` - Update existing exam sub information
- **DELETE** `http://localhost:3000/api/exam-sub-info/{id}` - Delete exam sub information

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in title, description
- `parentInfo` - Filter by parent exam info ID
- `isActive` - Filter by active status
- `startDate` - Filter by start date (ISO format)
- `endDate` - Filter by end date (ISO format)
- `sort` - Sort field (default: createdAt)
- `order` - Sort order: asc/desc (default: desc)

**Example:**

```bash
GET http://localhost:3000/api/exam-sub-info?parentInfo=EXAM_INFO_ID&isActive=true
```

## Special Endpoints

### Users API (Admin Only)

**Full Path:** `http://localhost:3000/api/users`

- **GET** `http://localhost:3000/api/users` - Get all users (admin only)
- **POST** `http://localhost:3000/api/users` - Create new user
- **PUT** `http://localhost:3000/api/users/{id}` - Update user
- **DELETE** `http://localhost:3000/api/users/{id}` - Delete user

### Authentication Endpoints

- **POST** `http://localhost:3000/api/users/login` - User login
- **POST** `http://localhost:3000/api/users/logout` - User logout
- **GET** `http://localhost:3000/api/users/me` - Get current user

---

## Quick Reference

| Collection      | Endpoint              | Methods                | Description                 | Status    |
| --------------- | --------------------- | ---------------------- | --------------------------- | --------- |
| Exam Categories | `/api/exam-category`  | GET, POST, PUT, DELETE | Manage exam categories      | ✅ Active |
| Exams           | `/api/exam`           | GET, POST, PUT, DELETE | Manage exams                | ✅ Active |
| Leads           | `/api/leads`          | GET, POST, PUT, DELETE | Manage contact leads        | ✅ Active |
| Posts           | `/api/posts`          | GET, POST, PUT, DELETE | Manage blog posts           | ✅ Active |
| Download Menus  | `/api/download-menus` | GET, POST, PUT, DELETE | Manage download menus       | ✅ Active |
| Sub Folders     | `/api/sub-folders`    | GET, POST, PUT, DELETE | Manage sub folders          | ✅ Active |
| Media           | `/api/media`          | GET, POST, PUT, DELETE | Manage media files          | ✅ Active |
| Statistics      | `/api/stats`          | GET                    | Get analytics data          | ✅ Active |
| Exam Info       | `/api/exam-info`      | GET, POST, PUT, DELETE | Manage exam information     | ✅ Active |
| Exam Sub Info   | `/api/exam-sub-info`  | GET, POST, PUT, DELETE | Manage exam sub information | ✅ Active |
| Users           | `/api/users`          | GET, POST, PUT, DELETE | Manage users (admin)        | ✅ Active |

## Database Status

| Collection      | API Status | Admin Panel  | Description   |
| --------------- | ---------- | ------------ | ------------- |
| Exam Categories | ✅ Working | ✅ Available | Ready for use |
| Exams           | ✅ Working | ✅ Available | Ready for use |
| Leads           | ✅ Working | ✅ Available | Ready for use |
| Posts           | ✅ Working | ✅ Available | Ready for use |
| Download Menus  | ✅ Working | ✅ Available | Ready for use |
| Sub Folders     | ✅ Working | ✅ Available | Ready for use |
| Exam Info       | ✅ Working | ✅ Available | Ready for use |
| Exam Sub Info   | ✅ Working | ✅ Available | Ready for use |
| Media           | ✅ Working | ✅ Available | Ready for use |
| Users           | ✅ Working | ✅ Available | Ready for use |
