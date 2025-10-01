# How to Fix ID Relationships

## Quick Fix Commands

### 1. Test Database Connection First

```bash
node test-db-connection.js
```

### 2. Fix ID Relationships

```bash
node fix-relationships.js
```

## What These Scripts Do

### `test-db-connection.js`

- Tests MongoDB connection
- Shows sample data from courses and exam_categories
- Tests relationships using MongoDB aggregation
- Helps verify the database is accessible

### `fix-relationships.js`

- Connects directly to MongoDB (no Payload dependency)
- Creates ID mappings between originalId and ObjectId
- Fixes broken relationships in:
  - courses → exam_categories
  - exam_infos → exam_categories
  - exam_categories → exams
- Tests the relationships after fixing

## Database Connection

The scripts will use:

1. `DATABASE_URI` environment variable if set
2. Default: `mongodb://127.0.0.1:27017/Demo_testprepkart_backend`

## Expected Output

After running the fix script, you should see:

```
✅ Database connection successful!
Building ID mapping for exams...
Mapped X documents for exams
Building ID mapping for exam_categories...
Mapped X documents for exam_categories
...
Fixing course relationships...
Fixed course [Course Name] category relationship
...
✅ ID relationship fix completed successfully!
```

## Troubleshooting

If you get connection errors:

1. Make sure MongoDB is running
2. Check your DATABASE_URI environment variable
3. Verify the database name is correct
4. Check MongoDB Atlas IP whitelisting if using Atlas

## After Running the Fix

1. Test your API endpoints:
   - `/api/courses` - Should show courses with populated categories
   - `/api/test-relationships` - Should show working relationships

2. Check your admin panel at `/admin` to verify relationships are working

3. Your frontend should now display courses with correct categories
