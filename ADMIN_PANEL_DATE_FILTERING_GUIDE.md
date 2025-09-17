# Payload CMS Admin Panel - Date Filtering Guide

## Overview

This guide explains how to filter data by date and date ranges in the Payload CMS admin panel for your TestPrepKart application.

## Accessing the Admin Panel

1. **URL**: `http://localhost:3000/admin`
2. **Login**: Use your admin credentials
3. **Navigate**: Select any collection from the sidebar

---

## Built-in Date Filtering Methods

### 1. Using the Search Bar

**Location**: Top of any collection list view

**How to use**:

- Click on the search bar
- Type date-related search terms
- Payload will search through all searchable fields

**Example**:

- Search for `2024-01` to find records from January 2024
- Search for specific dates like `2024-01-15`

### 2. Using Column Sorting

**Location**: Click on column headers in the list view

**Available date columns**:

- `Created At` - When the record was created
- `Updated At` - When the record was last modified
- `Published Date` - When content was published (for posts)

**How to use**:

- Click on `Created At` to sort by creation date
- Click again to reverse the order (newest first/last)
- Use `Updated At` to see recently modified records

### 3. Using the Filter Panel

**Location**: Click the "Filter" button (funnel icon) in the top-right of any collection

**Available filters**:

- **Date Range**: Select start and end dates
- **Created Date**: Filter by creation date
- **Updated Date**: Filter by last update date
- **Custom Fields**: Any date fields in your collections

---

## Step-by-Step Date Filtering Instructions

### Method 1: Basic Date Range Filtering

1. **Navigate to Collection**:

   - Go to `http://localhost:3000/admin`
   - Click on any collection (e.g., "Leads", "Exam Categories", "Posts")

2. **Open Filter Panel**:

   - Click the "Filter" button (🔍 icon) in the top-right corner
   - The filter panel will slide out from the right

3. **Set Date Range**:
   - Look for "Created At" or "Updated At" fields
   - Click on the date field
   - Select "Between" from the dropdown
   - Choose your start date
   - Choose your end date
   - Click "Apply Filter"

### Method 2: Single Date Filtering

1. **Open Filter Panel** (same as above)

2. **Set Single Date**:
   - Click on the date field
   - Select "After" or "Before" from the dropdown
   - Choose your date
   - Click "Apply Filter"

### Method 3: Quick Date Presets

1. **Open Filter Panel**

2. **Use Date Presets**:
   - Look for preset options like:
     - "Today"
     - "Yesterday"
     - "Last 7 days"
     - "Last 30 days"
     - "This month"
     - "Last month"
   - Click on your desired preset
   - Click "Apply Filter"

---

## Collection-Specific Date Filtering

### 1. Leads/Contacts Collection

**Available date filters**:

- `Created At` - When the lead was submitted
- `Updated At` - When the lead was last modified

**Common use cases**:

- Find leads from last week: Filter `Created At` > Last 7 days
- Find recent updates: Filter `Updated At` > Today
- Find leads from specific month: Filter `Created At` between dates

### 2. Posts Collection

**Available date filters**:

- `Created At` - When the post was created
- `Updated At` - When the post was last modified
- `Published Date` - When the post was published

**Common use cases**:

- Find published posts: Filter `Published Date` > specific date
- Find recent posts: Filter `Created At` > Last 7 days
- Find updated content: Filter `Updated At` > Last 30 days

### 3. Exam Categories Collection

**Available date filters**:

- `Created At` - When the category was created
- `Updated At` - When the category was last modified

**Common use cases**:

- Find new categories: Filter `Created At` > Last 30 days
- Find recently updated: Filter `Updated At` > Last 7 days

---

## Advanced Filtering Techniques

### 1. Multiple Date Filters

You can combine multiple date filters:

1. **Open Filter Panel**
2. **Add First Filter**:
   - Select date field
   - Set condition (e.g., "After 2024-01-01")
3. **Add Second Filter**:
   - Click "Add Filter"
   - Select another date field
   - Set condition (e.g., "Before 2024-01-31")
4. **Apply Both Filters**

### 2. Combining Date and Text Filters

1. **Open Filter Panel**
2. **Add Date Filter**:
   - Set your date range
3. **Add Text Filter**:
   - Select a text field (e.g., "Name", "Email")
   - Enter search term
4. **Apply All Filters**

### 3. Using Search with Date Sorting

1. **Use Search Bar**:
   - Type your search term
2. **Sort by Date**:
   - Click on "Created At" or "Updated At" column header
3. **Result**: Search results sorted by date

---

## Quick Reference - Date Filtering Shortcuts

| Action                    | Method                                   | Location                    |
| ------------------------- | ---------------------------------------- | --------------------------- |
| **Filter by date range**  | Filter panel → Date field → Between      | Top-right filter button     |
| **Filter by single date** | Filter panel → Date field → After/Before | Top-right filter button     |
| **Sort by date**          | Click column header                      | Column headers in list view |
| **Search by date**        | Type date in search bar                  | Top search bar              |
| **Quick presets**         | Filter panel → Preset options            | Top-right filter button     |

---

## Troubleshooting Date Filtering

### Common Issues

1. **No date filters visible**:

   - Ensure the collection has `timestamps: true` in its configuration
   - Check if the collection has date fields defined

2. **Filter not working**:

   - Clear all filters and try again
   - Check date format (should be YYYY-MM-DD)
   - Refresh the page

3. **No results found**:
   - Check if the date range is correct
   - Verify the data exists in that date range
   - Try a wider date range

### Best Practices

1. **Use specific date ranges** for better performance
2. **Combine with other filters** for precise results
3. **Save frequently used filters** as bookmarks
4. **Clear filters** when switching between different views

---

## Collection Configuration for Better Date Filtering

To enhance date filtering in your collections, ensure they have:

```typescript
// In your collection config
{
  timestamps: true, // Enables Created At and Updated At
  admin: {
    defaultColumns: ['title', 'createdAt', 'updatedAt'], // Show date columns
    listSearchableFields: ['title', 'description'], // Searchable fields
  }
}
```

---

## Examples for TestPrepKart Collections

### Find Recent Leads

1. Go to "Leads" collection
2. Open filter panel
3. Set "Created At" > "Last 7 days"
4. Apply filter

### Find Posts from This Month

1. Go to "Posts" collection
2. Open filter panel
3. Set "Published Date" > "This month"
4. Apply filter

### Find Updated Exam Categories

1. Go to "Exam Categories" collection
2. Open filter panel
3. Set "Updated At" > "Last 30 days"
4. Apply filter

---

## Additional Tips

1. **Export Filtered Data**: After applying filters, you can export the filtered results
2. **Bookmark Filters**: Save frequently used filter combinations
3. **Bulk Actions**: Perform bulk operations on filtered results
4. **Real-time Updates**: Filters update automatically when new data is added

---

_This guide covers the built-in date filtering capabilities of Payload CMS. For more advanced filtering, consider using the API endpoints with custom date queries._
