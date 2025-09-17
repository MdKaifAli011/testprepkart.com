# TestPrepKart Admin Panel - Visual Date Filtering Guide

## 🎯 Quick Start - Date Filtering in Admin Panel

### Step 1: Access the Admin Panel

1. **URL**: `http://localhost:3000/admin`
2. **Login** with your admin credentials
3. **Navigate** to any collection (e.g., "Leads", "Posts", "Exam Categories")

### Step 2: Locate the Filter Button

- Look for the **🔍 Filter** button in the top-right corner of any collection list
- It's next to the search bar and pagination controls

### Step 3: Open the Filter Panel

- Click the **Filter** button
- A filter panel will slide out from the right side
- You'll see various filter options including date fields

---

## 📅 Date Filtering Methods

### Method 1: Date Range Filtering

**Visual Steps:**

1. **Click Filter Button** → Filter panel opens
2. **Find "Created At" field** → Click on it
3. **Select "Between"** → From the dropdown
4. **Choose Start Date** → Click calendar icon, select date
5. **Choose End Date** → Click calendar icon, select date
6. **Click "Apply Filter"** → Results update

**Example:**

- Start Date: `2024-01-01`
- End Date: `2024-01-31`
- Result: Shows all records created in January 2024

### Method 2: Single Date Filtering

**Visual Steps:**

1. **Click Filter Button** → Filter panel opens
2. **Find "Created At" field** → Click on it
3. **Select "After" or "Before"** → From dropdown
4. **Choose Date** → Click calendar icon, select date
5. **Click "Apply Filter"** → Results update

**Examples:**

- **"After 2024-01-15"** → Shows records created after Jan 15, 2024
- **"Before 2024-01-31"** → Shows records created before Jan 31, 2024

### Method 3: Quick Date Presets

**Visual Steps:**

1. **Click Filter Button** → Filter panel opens
2. **Look for preset buttons** → Usually at the top of filter panel
3. **Click preset** → e.g., "Last 7 days", "This month"
4. **Results update automatically**

**Available Presets:**

- **Today** → Current day only
- **Yesterday** → Previous day only
- **Last 7 days** → Past week
- **Last 30 days** → Past month
- **This month** → Current month
- **Last month** → Previous month

---

## 🗂️ Collection-Specific Date Filtering

### Leads Collection

**Location**: `Admin Panel → Leads`

**Available Date Fields:**

- **Created At** → When lead was submitted
- **Updated At** → When lead was last modified

**Common Use Cases:**

- **Recent Leads**: Filter "Created At" > "Last 7 days"
- **Today's Leads**: Filter "Created At" > "Today"
- **Monthly Report**: Filter "Created At" between dates

**Visual Interface:**

```
Leads Collection View:
┌─────────────────────────────────────────────────┐
│ [🔍 Search] [📊 Filter] [📤 Export] [➕ New]    │
├─────────────────────────────────────────────────┤
│ Name    | Email           | Mobile    | Created │
│ John    | john@email.com  | 987654321 | Jan 15  │
│ Jane    | jane@email.com  | 987654322 | Jan 14  │
└─────────────────────────────────────────────────┘
```

### Posts Collection

**Location**: `Admin Panel → Posts`

**Available Date Fields:**

- **Created At** → When post was created
- **Updated At** → When post was last modified
- **Published Date** → When post was published

**Common Use Cases:**

- **Published This Month**: Filter "Published Date" > "This month"
- **Recent Updates**: Filter "Updated At" > "Last 7 days"
- **Draft Posts**: Filter "Published Date" is empty

### Exam Categories Collection

**Location**: `Admin Panel → Exam Categories`

**Available Date Fields:**

- **Created At** → When category was created
- **Updated At** → When category was last modified

**Common Use Cases:**

- **New Categories**: Filter "Created At" > "Last 30 days"
- **Recently Updated**: Filter "Updated At" > "Last 7 days"

---

## 🔧 Advanced Filtering Techniques

### Combining Multiple Date Filters

**Visual Steps:**

1. **Open Filter Panel**
2. **Add First Filter**: "Created At" > "After 2024-01-01"
3. **Click "Add Filter"** → New filter row appears
4. **Add Second Filter**: "Updated At" > "After 2024-01-15"
5. **Click "Apply Filter"** → Both filters applied

### Combining Date and Text Filters

**Visual Steps:**

1. **Open Filter Panel**
2. **Add Date Filter**: "Created At" > "Last 7 days"
3. **Add Text Filter**: "Name" contains "John"
4. **Click "Apply Filter"** → Combined results

### Using Search with Date Sorting

**Visual Steps:**

1. **Type in Search Bar**: "JEE" or "NEET"
2. **Click "Created At" Column Header** → Sorts by date
3. **Click Again** → Reverses sort order
4. **Results**: Search results sorted by date

---

## 📊 Visual Interface Elements

### Filter Panel Layout

```
Filter Panel (Right Side):
┌─────────────────────────────┐
│ [✕] Filters                 │
├─────────────────────────────┤
│ Quick Presets:              │
│ [Today] [Yesterday] [7d]    │
│ [30d] [This Month] [Last M] │
├─────────────────────────────┤
│ Created At:                 │
│ [Between ▼] [📅] [📅]      │
│ Updated At:                 │
│ [After ▼] [📅]              │
├─────────────────────────────┤
│ [Clear All] [Apply Filter]  │
└─────────────────────────────┘
```

### Collection List View

```
Collection List:
┌─────────────────────────────────────────────────┐
│ [🔍 Search...] [📊 Filter] [📤 Export] [➕ New] │
├─────────────────────────────────────────────────┤
│ Title/Name | Author | Created At | Updated At   │
│ Post 1     | Admin  | Jan 15     | Jan 16       │
│ Post 2     | User   | Jan 14     | Jan 15       │
└─────────────────────────────────────────────────┘
```

### Column Headers (Clickable for Sorting)

```
Clickable Headers:
┌─────────────────────────────────────────────────┐
│ Title/Name ↑ | Author | Created At ↓ | Updated  │
│ (Click to sort)    │ (Click to sort) │ (Click)  │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Quick Actions

### Export Filtered Data

1. **Apply your date filters**
2. **Click "Export" button** (📤 icon)
3. **Choose format**: CSV, JSON, or Excel
4. **Download** filtered results

### Save Filter Combinations

1. **Apply your filters**
2. **Bookmark the URL** in your browser
3. **Access later** by clicking the bookmark

### Clear All Filters

1. **Click "Clear All"** in filter panel
2. **Or refresh the page**
3. **All filters reset**

---

## 🎯 Pro Tips

### 1. Use Keyboard Shortcuts

- **Ctrl+F** → Focus search bar
- **Escape** → Close filter panel
- **Enter** → Apply filters

### 2. Bookmark Common Filters

- **Recent Leads**: `?where[createdAt][greater_than]=2024-01-01`
- **This Month**: `?where[createdAt][greater_than]=2024-01-01&where[createdAt][less_than]=2024-01-31`

### 3. Use Column Sorting

- **Click column headers** for quick sorting
- **Double-click** to reverse order
- **Combine with filters** for precise results

### 4. Monitor Real-time Updates

- **Filters update automatically** when new data is added
- **Refresh periodically** to see latest data
- **Use "Updated At"** to find recent changes

---

## 🔍 Troubleshooting

### Common Issues and Solutions

**Issue**: "No filters visible"

- **Solution**: Ensure collection has `timestamps: true` in configuration

**Issue**: "Filter not working"

- **Solution**:
  1. Clear all filters
  2. Check date format (YYYY-MM-DD)
  3. Refresh the page

**Issue**: "No results found"

- **Solution**:
  1. Check date range is correct
  2. Verify data exists in that range
  3. Try wider date range

**Issue**: "Filter panel won't close"

- **Solution**: Click the "X" button or press Escape key

---

## 📱 Mobile-Friendly Filtering

The admin panel is responsive and works on mobile devices:

1. **Touch the filter button** (📊 icon)
2. **Swipe the filter panel** to open/close
3. **Tap date fields** to open date picker
4. **Use touch gestures** for scrolling and selection

---

_This visual guide provides step-by-step instructions for date filtering in your TestPrepKart admin panel. For more advanced filtering, use the API endpoints with custom date queries._
