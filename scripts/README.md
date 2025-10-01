# Database Management Scripts

## 📦 Backup Only Script

**File:** `backup-only.js`

This script creates a complete backup of your database without making any changes to your existing data.

### What it does:

1. 📦 **Creates a complete backup** of your database
2. 📁 **Saves it to a timestamped folder** in `backup/backup-YYYY-MM-DDTHH-MM-SS/`
3. 📊 **Shows detailed backup summary** with file sizes and document counts

### How to use:

```bash
# Run from project root
node scripts/backup-only.js
```

### Perfect for:

- **Regular backups** before making changes
- **Creating snapshots** of your database
- **Backing up without affecting** your current data
- **Scheduled backups** (you can run this regularly)

---

## 🚀 Complete Database Manager

**File:** `complete-db-manager.js`

This is your **one-stop solution** for all database operations. It handles everything automatically:

### What it does:

1. 📦 **Creates a complete backup** of your database
2. 🗑️ **Clears existing data** (if restoring)
3. 📥 **Restores data** from the backup
4. 🔧 **Fixes all ID relationships** automatically
5. ✅ **Verifies everything** is working correctly

### How to use:

```bash
# Run from project root
node scripts/complete-db-manager.js
```

### What happens:

- Creates a timestamped backup in `backup/backup-YYYY-MM-DDTHH-MM-SS/`
- Clears all existing data
- Restores all data from the backup
- Fixes all relationships using `originalId` mapping
- Verifies that relationships are working

### After running:

1. Restart your development server: `npm run dev`
2. Test your frontend - it should work perfectly!
3. Test your API endpoints - they should work perfectly!
4. Your admin panel should show proper relationships!

## 📁 Backup Structure

Each backup contains:

- `backup-info.json` - Backup metadata
- `exams.json` - All exam documents
- `exam_categories.json` - All exam category documents
- `exam_infos.json` - All exam info documents
- `exam_sub_infos.json` - All exam sub info documents
- `download_folders.json` - All download folder documents
- `download_sub_folders.json` - All download sub folder documents
- `download_files.json` - All download file documents
- `courses.json` - All course documents

## 🔧 Relationship Fixes

The script automatically fixes these relationships:

- ✅ Courses → Exam Categories
- ✅ Exam Infos → Exam Categories
- ✅ Exam Categories → Exams
- ✅ Download Folders → Exam Categories
- ✅ Download Sub Folders → Download Folders
- ✅ Download Files → Download Sub Folders
- ✅ Exam Sub Infos → Exam Infos

## 🎯 Perfect for:

- **Fresh database setup**
- **Data migration**
- **Relationship repair**
- **Complete database reset**
- **Backup and restore operations**

## ⚠️ Important Notes:

- This script will **clear all existing data** before restoring
- Make sure you have a backup before running
- The script uses `originalId` fields to maintain relationships
- All relationships are automatically mapped and fixed

## 🚀 Quick Start:

### For Backup Only:

```bash
# Just run this one command:
node scripts/backup-only.js
```

### For Complete Database Management:

```bash
# Just run this one command:
node scripts/complete-db-manager.js
```

## 🤔 Which Script Should I Use?

### Use `backup-only.js` when:

- ✅ You want to **backup your database** without making any changes
- ✅ You want to **create a snapshot** before making changes
- ✅ You want to **schedule regular backups**
- ✅ You want to **keep your current data intact**

### Use `complete-db-manager.js` when:

- ✅ You want to **completely reset your database**
- ✅ You want to **restore from a backup**
- ✅ You want to **fix all relationships** automatically
- ✅ You want to **start fresh** with clean data

## 📁 Backup Structure

Each backup contains:

- `backup-info.json` - Backup metadata
- `backup-summary.json` - Human-readable summary
- `exams.json` - All exam documents
- `exam_categories.json` - All exam category documents
- `exam_infos.json` - All exam info documents
- `exam_sub_infos.json` - All exam sub info documents
- `download_folders.json` - All download folder documents
- `download_sub_folders.json` - All download sub folder documents
- `download_files.json` - All download file documents
- `courses.json` - All course documents

That's it! Your database will be completely backed up, restored, and fixed! 🎉
