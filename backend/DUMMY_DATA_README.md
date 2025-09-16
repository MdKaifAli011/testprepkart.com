# Dummy Data Insertion for TestPrepKart

This directory contains scripts to populate your database with sample data for testing and development.

## 📁 Files Created

### 1. `insert-dummy-data.js` (Recommended)

- **Purpose:** Main script using Payload API
- **Usage:** `npm run seed`
- **Features:**
  - Uses Payload's built-in API
  - Handles relationships automatically
  - Error handling included
  - Progress logging

### 2. `mongodb-dummy-data.js`

- **Purpose:** Direct MongoDB queries
- **Usage:** Copy and paste queries into MongoDB Compass or MongoDB Shell
- **Features:**
  - Raw MongoDB queries
  - Manual ID replacement required
  - Good for understanding data structure

### 3. `dummy-data.js`

- **Purpose:** Advanced script with comprehensive data
- **Usage:** `node dummy-data.js`
- **Features:**
  - More comprehensive data
  - Advanced error handling
  - Detailed logging

## 🚀 How to Use

### Method 1: Using Payload API (Recommended)

```bash
# Make sure your server is running
npm run dev

# In another terminal, run the seed script
npm run seed
```

### Method 2: Using MongoDB Directly

1. Open MongoDB Compass or MongoDB Shell
2. Connect to your database
3. Copy queries from `mongodb-dummy-data.js`
4. Replace placeholder IDs with actual IDs
5. Execute queries one by one

### Method 3: Using Advanced Script

```bash
# Make sure your server is running
npm run dev

# In another terminal, run the advanced script
node dummy-data.js
```

## 📊 Data Created

The scripts will create the following sample data:

### Exam Categories (4)

- Engineering Entrance
- Medical Entrance
- International Exams
- Board Exams

### Exams (5)

- JEE Main 2024
- JEE Advanced 2024
- NEET 2024
- SAT 2024
- CBSE Class 12 Physics

### Leads (3)

- John Doe (JEE preparation)
- Sarah Wilson (NEET coaching)
- Michael Brown (CBSE board exams)

### Posts (2)

- JEE Main 2024 Preparation Strategy
- NEET 2024 Important Topics

### Download Menus (2)

- JEE Study Materials
- NEET Question Papers

### Sub Folders (3)

- Mathematics (under JEE menu)
- Physics (under JEE menu)
- Biology (under NEET menu)

### Media Files (2)

- JEE Main Syllabus PDF
- NEET Sample Paper JPG

## 🔗 Relationships

The scripts automatically create and link relationships:

- **Exam ↔ ExamCategory:** Bidirectional relationship
- **DownloadMenu ↔ SubFolder:** Parent-child relationship
- **All collections:** Proper timestamps and IDs

## ⚠️ Important Notes

1. **Database Connection:** Ensure your MongoDB connection is working
2. **Server Running:** Keep your development server running
3. **Environment Variables:** Make sure `DATABASE_URI` is set correctly
4. **Permissions:** Ensure you have write permissions to the database
5. **Duplicate Data:** Running the script multiple times will create duplicate data

## 🧹 Cleaning Up

To remove all dummy data:

```bash
# Connect to MongoDB and run:
db.getCollection('exam-category').deleteMany({})
db.getCollection('exam').deleteMany({})
db.getCollection('leads').deleteMany({})
db.getCollection('posts').deleteMany({})
db.getCollection('download-menus').deleteMany({})
db.getCollection('sub-folders').deleteMany({})
db.getCollection('media').deleteMany({})
```

## 🎯 Next Steps

After running the dummy data script:

1. **Check Admin Panel:** Visit `http://localhost:3000/admin`
2. **Verify Data:** Browse through all collections
3. **Test Relationships:** Check that relationships are working
4. **Test APIs:** Use the API endpoints to fetch data
5. **Customize:** Modify the data as needed for your use case

## 🐛 Troubleshooting

### Common Issues:

1. **Connection Error:** Check your MongoDB connection string
2. **Permission Denied:** Ensure database write permissions
3. **Duplicate Key:** Clear existing data before running
4. **Type Errors:** Regenerate types with `npm run generate:types`

### Getting Help:

- Check the console output for detailed error messages
- Verify your database connection
- Ensure all required fields are provided
- Check Payload logs for additional information
