# How to Fix ID Relationships - Step by Step

## Prerequisites

Make sure you're in the project root directory:

```bash
cd "G:\demo\demo - Copy\demo"
```

## Step 1: Test Database Connection

```bash
node fix-relationships.js
```

## Step 2: If Database is Empty, Restore Data

```bash
node scripts/restore-with-fixed-relationships.js
```

## Step 3: If Database Has Data, Fix Relationships

```bash
node scripts/fix-id-relationships.js
```

## Step 4: Test the Fix

Visit these URLs in your browser:

- `/api/test-relationships` - Test if relationships work
- `/api/courses` - Check if courses load with categories
- `/courses` - Check the frontend

## Alternative: Manual Fix via Admin Panel

1. Go to `/admin` in your browser
2. Check that `originalId` fields are visible in all collections
3. Manually fix relationships by:
   - Going to Courses collection
   - Editing each course
   - Selecting the correct category from the dropdown
   - Saving the changes

## What the Scripts Do

### `fix-relationships.js`

- Tests database connection
- Builds ID mappings from originalId to ObjectId
- Fixes course -> category relationships
- Tests the results

### `scripts/restore-with-fixed-relationships.js`

- Clears existing data
- Imports data from backup files
- Creates proper ID mappings
- Fixes all relationships automatically

### `scripts/fix-id-relationships.js`

- Works with existing data
- Builds ID mappings
- Fixes broken relationships
- Preserves existing data

## Expected Results

After running the fix:

- ✅ Courses will show their correct categories
- ✅ No more "document not found" errors
- ✅ Relationships will be properly populated
- ✅ Admin panel will show correct relationship data

## Troubleshooting

If you get module errors:

1. Make sure you're in the project root directory
2. Run `npm install` to ensure all dependencies are installed
3. Check that your MongoDB connection is working

If you get database connection errors:

1. Check your `DATABASE_URI` environment variable
2. Verify MongoDB Atlas IP whitelisting
3. Test connection at `/api/test-db`
