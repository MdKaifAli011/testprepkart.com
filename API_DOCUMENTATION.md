# TestPrepKart API Documentation

## Overview

This document provides comprehensive API documentation for the TestPrepKart application. The API is built using Next.js 15 with Payload CMS and provides both custom endpoints and Payload's native collection APIs.

## Base URL

```
http://localhost:3000
```

## Authentication

- **Admin Panel**: `http://localhost:3000/admin`
- **API Authentication**: Uses Payload CMS built-in authentication system

---

## Custom API Endpoints

### 1. Leads Management

**Base Path**: `/api/leads`

#### GET /api/leads

Get all leads with filtering and pagination.

**Query Parameters:**

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 50)
- `search` (string, optional): Search in name, email, or mobile
- `class` (string, optional): Filter by class
- `startDate` (string, optional): Filter by start date (ISO format: YYYY-MM-DD)
- `endDate` (string, optional): Filter by end date (ISO format: YYYY-MM-DD)
- `dateRange` (string, optional): Predefined date ranges - 'today', 'yesterday', 'last7days', 'last30days', 'thisMonth', 'lastMonth', 'thisYear', 'lastYear'
- `format` (string, optional): Response format - 'json' or 'csv' (default: 'json')

**Example Requests:**

**Basic filtering:**

```bash
GET /api/leads?page=1&limit=10&search=rahul&class=12&format=json
```

**Date range filtering:**

```bash
GET /api/leads?startDate=2024-01-01&endDate=2024-01-31&format=json
```

**Predefined date range:**

```bash
GET /api/leads?dateRange=last7days&format=json
```

**Combined filtering:**

```bash
GET /api/leads?class=12&startDate=2024-01-15&endDate=2024-01-20&search=sharma&format=csv
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "68c946079df748eeb03c8523",
      "name": "Rahul Sharma",
      "email": "rahul.sharma@example.com",
      "mobile": "9876543210",
      "class": "12",
      "country": "India",
      "message": "Interested in JEE Main preparation materials",
      "submissionDetails": {
        "ipAddress": "192.168.1.1",
        "referrerUrl": "https://google.com",
        "currentUrl": "https://testprepkart.com/jee-main",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "source": "contact-form"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalDocs": 25,
  "totalPages": 3,
  "page": 1,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

#### POST /api/leads

Create a new lead/contact.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "mobile": "9876543210",
  "class": "12",
  "country": "India",
  "countryCode": "+91",
  "message": "Interested in study materials",
  "currentUrl": "https://testprepkart.com/jee-main",
  "source": "contact-form"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "68c946079df748eeb03c8524",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "mobile": "9876543210",
    "class": "12",
    "country": "India",
    "message": "Interested in study materials",
    "submissionDetails": {
      "ipAddress": "192.168.1.5",
      "referrerUrl": "https://google.com",
      "currentUrl": "https://testprepkart.com/jee-main",
      "timestamp": "2024-01-15T11:00:00.000Z",
      "source": "contact-form"
    },
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### 2. Statistics

**Base Path**: `/api/stats`

#### GET /api/stats

Get comprehensive application statistics.

**Query Parameters:**

- `startDate` (string, optional): Filter statistics from this date (ISO format: YYYY-MM-DD)
- `endDate` (string, optional): Filter statistics to this date (ISO format: YYYY-MM-DD)
- `dateRange` (string, optional): Predefined date ranges - 'today', 'yesterday', 'last7days', 'last30days', 'thisMonth', 'lastMonth', 'thisYear', 'lastYear'

**Example Requests:**

**Date range filtering:**

```bash
GET /api/stats?startDate=2024-01-01&endDate=2024-01-31
```

**Predefined date range:**

```bash
GET /api/stats?dateRange=last30days
```

**Current month statistics:**

```bash
GET /api/stats?dateRange=thisMonth
```

**Response:**

```json
{
  "success": true,
  "data": {
    "counts": {
      "leads": 25,
      "exams": 4,
      "posts": 8,
      "downloadMenus": 12,
      "subFolders": 15,
      "media": 45
    },
    "leadsByClass": {
      "10": 5,
      "11": 8,
      "12": 12
    },
    "recentActivity": {
      "leads": [
        {
          "id": "68c946079df748eeb03c8523",
          "name": "Rahul Sharma",
          "email": "rahul.sharma@example.com",
          "createdAt": "2024-01-15T10:30:00.000Z"
        }
      ],
      "posts": [
        {
          "id": "68c946079df748eeb03c8525",
          "title": "JEE Main Preparation Strategy 2024",
          "author": "TestPrepKart Team",
          "publishedDate": "2024-01-15T09:00:00.000Z"
        }
      ]
    },
    "dateRange": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    }
  }
}
```

---

### 3. Database Seeding

**Base Path**: `/api/seed`

#### POST /api/seed

Seed the database with sample data for all collections.

**Request Body:** None required

**Response:**

```json
{
  "message": "🎉 Data seeding completed successfully!",
  "data": {
    "examCategories": 3,
    "exams": 4,
    "examInfo": 2,
    "downloadMenus": 3,
    "subFolders": 3,
    "posts": 2,
    "contacts": 3,
    "examSubInfo": 2
  }
}
```

---

## Payload CMS Native API Endpoints

All collection operations are handled through Payload's native API at `/api/{collection-slug}`.

**Note**: All Payload collections support comprehensive date filtering including:

- Date range filtering (`startDate`, `endDate`)
- Predefined date ranges (`dateRange`)
- Creation/update date filtering (`createdAfter`, `createdBefore`, `updatedAfter`, `updatedBefore`)
- MongoDB-style date queries (`where[field][operator]=value`)

### Available Collections

#### 1. Users

**Base Path**: `/api/users`

**Operations:**

- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user by ID
- `PATCH /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

#### 2. Media

**Base Path**: `/api/media`

**Operations:**

- `GET /api/media` - List media files
- `POST /api/media` - Upload media file
- `GET /api/media/{id}` - Get media by ID
- `PATCH /api/media/{id}` - Update media
- `DELETE /api/media/{id}` - Delete media

#### 3. Exam Categories

**Base Path**: `/api/exam-category`

**Operations:**

- `GET /api/exam-category` - List exam categories
- `POST /api/exam-category` - Create exam category
- `GET /api/exam-category/{id}` - Get exam category by ID
- `PATCH /api/exam-category/{id}` - Update exam category
- `DELETE /api/exam-category/{id}` - Delete exam category

**Date Filtering Support:**

- `startDate` / `endDate` - Filter by creation date range
- `dateRange` - Predefined date ranges
- `createdAfter` / `createdBefore` - Filter by creation date
- `updatedAfter` / `updatedBefore` - Filter by update date

**Example Requests:**

```bash
# Basic listing
GET /api/exam-category?limit=10&sort=-createdAt

# Date range filtering
GET /api/exam-category?startDate=2024-01-01&endDate=2024-01-31

# Predefined date range
GET /api/exam-category?dateRange=last30days

# Combined filtering
GET /api/exam-category?where[categoryName][contains]=JEE&startDate=2024-01-01&sort=-createdAt
```

#### 4. Exams

**Base Path**: `/api/exam`

**Operations:**

- `GET /api/exam` - List exams
- `POST /api/exam` - Create exam
- `GET /api/exam/{id}` - Get exam by ID
- `PATCH /api/exam/{id}` - Update exam
- `DELETE /api/exam/{id}` - Delete exam

**Date Filtering Support:**

- `startDate` / `endDate` - Filter by creation date range
- `dateRange` - Predefined date ranges
- `createdAfter` / `createdBefore` - Filter by creation date
- `updatedAfter` / `updatedBefore` - Filter by update date

**Example Requests:**

```bash
# Basic listing
GET /api/exam?limit=10&sort=-createdAt

# Date range filtering
GET /api/exam?startDate=2024-01-01&endDate=2024-01-31

# Search with date filter
GET /api/exam?where[examName][contains]=JEE&dateRange=last7days
```

#### 5. Exam Information

**Base Path**: `/api/exam-info`

**Operations:**

- `GET /api/exam-info` - List exam information
- `POST /api/exam-info` - Create exam information
- `GET /api/exam-info/{id}` - Get exam information by ID
- `PATCH /api/exam-info/{id}` - Update exam information
- `DELETE /api/exam-info/{id}` - Delete exam information

#### 6. Exam Sub Information

**Base Path**: `/api/exam-sub-info`

**Operations:**

- `GET /api/exam-sub-info` - List exam sub information
- `POST /api/exam-sub-info` - Create exam sub information
- `GET /api/exam-sub-info/{id}` - Get exam sub information by ID
- `PATCH /api/exam-sub-info/{id}` - Update exam sub information
- `DELETE /api/exam-sub-info/{id}` - Delete exam sub information

#### 7. Download Menus

**Base Path**: `/api/download-menus`

**Operations:**

- `GET /api/download-menus` - List download menus
- `POST /api/download-menus` - Create download menu
- `GET /api/download-menus/{id}` - Get download menu by ID
- `PATCH /api/download-menus/{id}` - Update download menu
- `DELETE /api/download-menus/{id}` - Delete download menu

#### 8. Sub Folders

**Base Path**: `/api/sub-folders`

**Operations:**

- `GET /api/sub-folders` - List sub folders
- `POST /api/sub-folders` - Create sub folder
- `GET /api/sub-folders/{id}` - Get sub folder by ID
- `PATCH /api/sub-folders/{id}` - Update sub folder
- `DELETE /api/sub-folders/{id}` - Delete sub folder

#### 9. Posts

**Base Path**: `/api/post`

**Operations:**

- `GET /api/post` - List posts
- `POST /api/post` - Create post
- `GET /api/post/{id}` - Get post by ID
- `PATCH /api/post/{id}` - Update post
- `DELETE /api/post/{id}` - Delete post

**Date Filtering Support:**

- `startDate` / `endDate` - Filter by creation date range
- `dateRange` - Predefined date ranges
- `createdAfter` / `createdBefore` - Filter by creation date
- `updatedAfter` / `updatedBefore` - Filter by update date
- `publishedAfter` / `publishedBefore` - Filter by published date

**Example Requests:**

```bash
# Basic listing
GET /api/post?limit=10&sort=-publishedDate

# Date range filtering
GET /api/post?startDate=2024-01-01&endDate=2024-01-31

# Published this month
GET /api/post?dateRange=thisMonth&sort=-publishedDate

# Recent posts
GET /api/post?dateRange=last7days&sort=-createdAt
```

#### 10. Contact/Leads

**Base Path**: `/api/leads`

**Note**: This collection is also available through Payload's native API, but the custom `/api/leads` endpoint provides additional functionality like CSV export and enhanced filtering.

---

## Common Query Parameters (Payload Collections)

All Payload collection endpoints support these common query parameters:

### Pagination

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

### Sorting

- `sort` (string): Sort field (prefix with `-` for descending)
- `order` (string): Sort order (`asc` or `desc`)

### Filtering

- `where` (object): MongoDB-style where clause
- `search` (string): Search term (collection-specific)

### Date Filtering

- `startDate` (string): Filter from this date (ISO format: YYYY-MM-DD)
- `endDate` (string): Filter to this date (ISO format: YYYY-MM-DD)
- `dateRange` (string): Predefined date ranges - 'today', 'yesterday', 'last7days', 'last30days', 'thisMonth', 'lastMonth', 'thisYear', 'lastYear'
- `createdAfter` (string): Filter records created after this date
- `createdBefore` (string): Filter records created before this date
- `updatedAfter` (string): Filter records updated after this date
- `updatedBefore` (string): Filter records updated before this date

### Population

- `depth` (number): Population depth for relationships
- `fallback-locale` (string): Fallback locale for i18n

### Example Requests

**Get exam categories with pagination:**

```bash
GET /api/exam-category?page=1&limit=5&sort=-createdAt
```

**Search exams by name:**

```bash
GET /api/exam?where[examName][contains]=JEE
```

**Get exam with populated category:**

```bash
GET /api/exam?depth=1&where[category][equals]=68c946079df748eeb03c8523
```

**Date filtering examples:**

**Filter by date range:**

```bash
GET /api/exam-category?startDate=2024-01-01&endDate=2024-01-31
```

**Filter by predefined date range:**

```bash
GET /api/exam?dateRange=last7days
```

**Filter by creation date:**

```bash
GET /api/post?createdAfter=2024-01-15&createdBefore=2024-01-20
```

**Filter by update date:**

```bash
GET /api/media?updatedAfter=2024-01-01&sort=-updatedAt
```

**Combined filtering with dates:**

```bash
GET /api/exam-info?where[exam][contains]=JEE&startDate=2024-01-01&endDate=2024-01-31&sort=-createdAt
```

**MongoDB-style date filtering:**

```bash
GET /api/post?where[createdAt][greater_than_equal]=2024-01-01T00:00:00.000Z&where[createdAt][less_than_equal]=2024-01-31T23:59:59.999Z
```

---

## Date Filtering Guide

### Supported Date Formats

- **ISO Date**: `YYYY-MM-DD` (e.g., `2024-01-15`)
- **ISO DateTime**: `YYYY-MM-DDTHH:mm:ss.sssZ` (e.g., `2024-01-15T10:30:00.000Z`)
- **Unix Timestamp**: `1705312200000` (milliseconds since epoch)

### Predefined Date Ranges

| Range        | Description    | Example                      |
| ------------ | -------------- | ---------------------------- |
| `today`      | Current day    | `2024-01-15`                 |
| `yesterday`  | Previous day   | `2024-01-14`                 |
| `last7days`  | Last 7 days    | `2024-01-08` to `2024-01-15` |
| `last30days` | Last 30 days   | `2023-12-16` to `2024-01-15` |
| `thisMonth`  | Current month  | `2024-01-01` to `2024-01-31` |
| `lastMonth`  | Previous month | `2023-12-01` to `2023-12-31` |
| `thisYear`   | Current year   | `2024-01-01` to `2024-12-31` |
| `lastYear`   | Previous year  | `2023-01-01` to `2023-12-31` |

### Date Filtering Examples

**Get leads from last week:**

```bash
GET /api/leads?dateRange=last7days
```

**Get posts created between specific dates:**

```bash
GET /api/post?startDate=2024-01-01&endDate=2024-01-31
```

**Get media updated in the last 30 days:**

```bash
GET /api/media?updatedAfter=2024-01-01&sort=-updatedAt
```

**Get exam categories created this month:**

```bash
GET /api/exam-category?dateRange=thisMonth
```

**Advanced MongoDB date filtering:**

```bash
GET /api/post?where[createdAt][greater_than]=2024-01-01T00:00:00.000Z&where[createdAt][less_than]=2024-01-31T23:59:59.999Z
```

### Timezone Considerations

- All dates are stored in UTC
- Date filters are applied in UTC timezone
- Use ISO format with timezone information for precise filtering
- Example: `2024-01-15T10:30:00.000Z` (UTC) or `2024-01-15T16:00:00.000+05:30` (IST)

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `400` - Bad Request (invalid data)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Rate Limiting

- **Custom APIs**: No rate limiting currently implemented
- **Payload APIs**: Subject to Payload CMS default limits

---

## CORS Configuration

The API supports CORS for cross-origin requests. Configure allowed origins in your Next.js configuration.

---

## Development

### Starting the Development Server

```bash
npm run dev
```

### Environment Variables

Required environment variables:

- `DATABASE_URI` - MongoDB connection string
- `PAYLOAD_SECRET` - Secret key for Payload CMS
- `NODE_OPTIONS` - Node.js options

### Testing APIs

You can test the APIs using:

- **Admin Panel**: `http://localhost:3000/admin`
- **API Testing Tools**: Postman, Insomnia, or curl
- **Browser**: Direct GET requests for public endpoints

---

## Support

For API support and questions, please refer to:

- **Payload CMS Documentation**: https://payloadcms.com/docs
- **Next.js API Documentation**: https://nextjs.org/docs/api-routes/introduction
- **MongoDB Documentation**: https://docs.mongodb.com/

---

## Quick Reference

### Date Filtering Quick Reference

| Parameter       | Description         | Example                  |
| --------------- | ------------------- | ------------------------ |
| `startDate`     | Filter from date    | `2024-01-01`             |
| `endDate`       | Filter to date      | `2024-01-31`             |
| `dateRange`     | Predefined range    | `last7days`, `thisMonth` |
| `createdAfter`  | Created after date  | `2024-01-15`             |
| `createdBefore` | Created before date | `2024-01-20`             |
| `updatedAfter`  | Updated after date  | `2024-01-01`             |
| `updatedBefore` | Updated before date | `2024-01-31`             |

### Common Date Filtering Patterns

```bash
# Last 7 days
GET /api/{collection}?dateRange=last7days

# This month
GET /api/{collection}?dateRange=thisMonth

# Custom date range
GET /api/{collection}?startDate=2024-01-01&endDate=2024-01-31

# Recent updates
GET /api/{collection}?updatedAfter=2024-01-01&sort=-updatedAt

# MongoDB style
GET /api/{collection}?where[createdAt][greater_than_equal]=2024-01-01T00:00:00.000Z
```

---

_Last Updated: January 2024_
_API Version: 1.0.0_
