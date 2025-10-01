# ID Relationship Fix Documentation

## Problem Description

The application was experiencing "document not found" errors because of broken ID relationships between collections. The issue was:

1. **Collections had `originalId` fields commented out** in the schema
2. **Relationships were referencing MongoDB ObjectIds** that didn't match between collections
3. **Data import process** wasn't properly mapping the original IDs to new ObjectIds
4. **API queries** weren't populating relationships correctly

## Root Cause Analysis

Looking at the backup data structure:

- Each document has both `_id` (MongoDB ObjectId) and `originalId` (numeric)
- Relationships were stored as ObjectId strings but didn't match between collections
- The `originalId` fields were disabled in the schema, breaking the mapping

## Solution Implemented

### 1. **Enabled `originalId` Fields**

Enabled the `originalId` field in all collections:

- `Courses.ts`
- `ExamCategories.ts`
- `ExamInfos.ts`
- `ExamSubInfos.ts`
- `Exams.ts`
- `DownloadFolders.ts`
- `DownloadSubFolders.ts`
- `DownloadFiles.ts`

### 2. **Created Relationship Fix Scripts**

- `scripts/fix-id-relationships.js` - Fixes existing relationships
- `scripts/restore-with-fixed-relationships.js` - Restores data with proper relationships

### 3. **Enhanced API Endpoints**

- Added `depth: 1` to populate relationships in API calls
- Created `/api/test-relationships` to verify relationships work
- Enhanced error handling for missing documents

### 4. **Improved Data Import Process**

The restore script now:

1. Clears existing data
2. Imports data in dependency order
3. Creates ID mappings from `originalId` to new ObjectId
4. Fixes relationships using the mappings

## How to Fix Your Database

### Option 1: Restore with Fixed Relationships (Recommended)

```bash
node scripts/restore-with-fixed-relationships.js
```

### Option 2: Fix Existing Relationships

```bash
node scripts/fix-id-relationships.js
```

### Option 3: Manual Fix via Admin Panel

1. Go to `/admin`
2. Check that `originalId` fields are visible
3. Manually fix relationships by selecting correct related documents

## Verification

After running the fix, test the relationships:

1. **API Test**: Visit `/api/test-relationships` to see populated relationships
2. **Admin Panel**: Check that relationships show properly in the admin interface
3. **Frontend**: Verify that courses display with correct categories

## Expected Results

After the fix:

- ✅ Courses will show their correct categories
- ✅ No more "document not found" errors
- ✅ Relationships will be properly populated in API responses
- ✅ Admin panel will show correct relationship data

## Data Structure

The fixed data structure maintains:

- `originalId`: Numeric ID from original system
- `id`: MongoDB ObjectId for Payload CMS
- Proper relationships between collections using ObjectIds

## Troubleshooting

If you still see issues:

1. **Check Database Connection**: Visit `/api/test-db`
2. **Verify Relationships**: Visit `/api/test-relationships`
3. **Check Admin Panel**: Ensure `originalId` fields are visible
4. **Review Logs**: Check console for specific error messages

## Files Modified

- `src/collections/*.ts` - Enabled `originalId` fields
- `src/app/api/courses/route.ts` - Added relationship population
- `src/app/api/course/[id]/route.ts` - Created with proper error handling
- `src/app/api/test-relationships/route.ts` - Created for testing
- `scripts/fix-id-relationships.js` - Created for fixing relationships
- `scripts/restore-with-fixed-relationships.js` - Created for data restore
