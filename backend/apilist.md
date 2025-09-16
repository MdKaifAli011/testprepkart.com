# API Endpoints Documentation

## Base URL

```
http://localhost:3000/api
```

## Available Endpoints

### Individual Resource Endpoints

For operations on specific resources, use the resource ID in the URL:

- **GET** `/api/{collection}/{id}` - Get specific resource
- **PUT** `/api/{collection}/{id}` - Update specific resource
- **DELETE** `/api/{collection}/{id}` - Delete specific resource

**Example:**

- `GET /api/leads/64f1a2b3c4d5e6f7g8h9i0j1` - Get specific lead
- `PUT /api/leads/64f1a2b3c4d5e6f7g8h9i0j1` - Update specific lead
- `DELETE /api/leads/64f1a2b3c4d5e6f7g8h9i0j1` - Delete specific lead

### 1. Leads (Contact) API

**Endpoint:** `/api/leads`

- **GET** - Retrieve leads with filtering, search, and pagination
- **POST** - Create new lead
- **PUT** - Update existing lead
- **DELETE** - Delete lead


### 2. Exams API

**Endpoint:** `/api/exams`

- **GET** - Retrieve exams with filtering and pagination
- **POST** - Create new exam
- **PUT** - Update existing exam
- **DELETE** - Delete exam


### 3. Posts API

**Endpoint:** `/api/posts`

- **GET** - Retrieve posts with filtering and pagination
- **POST** - Create new post
- **PUT** - Update existing post
- **DELETE** - Delete post


### 4. Download Menus API

**Endpoint:** `/api/download-menus`

- **GET** - Retrieve download menus with filtering and pagination
- **POST** - Create new download menu
- **PUT** - Update existing download menu
- **DELETE** - Delete download menu


### 5. Sub Folders API

**Endpoint:** `/api/sub-folders`

- **GET** - Retrieve sub folders with filtering and pagination
- **POST** - Create new sub folder
- **PUT** - Update existing sub folder
- **DELETE** - Delete sub folder


### 6. Media API

**Endpoint:** `/api/media`

- **GET** - Retrieve media files with filtering and pagination
- **POST** - Upload new media file
- **PUT** - Update existing media file
- **DELETE** - Delete media file


### 7. Statistics API

**Endpoint:** `/api/stats`

- **GET** - Get comprehensive statistics and analytics
- **POST** - Not available (read-only)
- **PUT** - Not available (read-only)
- **DELETE** - Not available (read-only)





## Authentication

All API endpoints require authentication. Include the following headers:

```
Content-Type: application/json
Authorization: Bearer <your-token>
```

## Response Format

All endpoints return JSON responses in the following format:

### Success Response

```json
{
  "success": true,
  "data": {
    "docs": [...],
    "totalDocs": 100,
    "limit": 10,
    "page": 1,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "message": "Success"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "message": "Operation failed"
}
```

## Rate Limiting

- **Rate Limit:** 100 requests per minute per IP
- **Burst Limit:** 20 requests per second

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Examples

### Get Leads with Filters

```bash
curl -X GET "http://localhost:3000/api/leads?search=john&class=10th&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token"
```

### Create New Lead

```bash
curl -X POST "http://localhost:3000/api/leads" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "1234567890",
    "class": "10th",
    "message": "Interested in course"
  }'
```

### Update Lead

```bash
curl -X PUT "http://localhost:3000/api/leads/LEAD_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "mobile": "1234567890",
    "class": "12th",
    "message": "Updated interest"
  }'
```

### Delete Lead

```bash
curl -X DELETE "http://localhost:3000/api/leads/LEAD_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token"
```

### Create New Exam

```bash
curl -X POST "http://localhost:3000/api/exams" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "title": "Mathematics Test",
    "description": "Algebra and Geometry test",
    "subject": "Mathematics",
    "duration": 120,
    "maxMarks": 100
  }'
```

### Update Exam

```bash
curl -X PUT "http://localhost:3000/api/exams/EXAM_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "title": "Advanced Mathematics Test",
    "description": "Updated test description",
    "subject": "Mathematics",
    "duration": 150,
    "maxMarks": 120
  }'
```

### Delete Exam

```bash
curl -X DELETE "http://localhost:3000/api/exams/EXAM_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token"
```

### Get Statistics

```bash
curl -X GET "http://localhost:3000/api/stats?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token"
```

## Admin Panel

Access the admin panel at: `http://localhost:3000/admin`

Features:

- Create, read, update, delete all collections
- Advanced filtering and search
- Date range filtering for leads
- Bulk operations
- Export functionality
- User management
