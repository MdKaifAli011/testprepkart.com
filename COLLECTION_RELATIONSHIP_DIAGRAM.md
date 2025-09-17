# TestPrepKart Collection Relationship Diagram

## Database Structure

Based on your image requirements, here's how your collections are structured:

### ExamCategory Collection (Parent)

```
┌─────────────────────────────────────┐
│ ExamCategory Table                  │
├─────────────────────────────────────┤
│ id (Primary Key)                    │
│ categoryName (Text)                 │
│ seo_title (Text)                    │
│ seo_keyword (Text)                  │
│ seo_description (Text)              │
│ exams (Relationship to Exam[])      │
│ createdAt (Timestamp)               │
│ updatedAt (Timestamp)               │
└─────────────────────────────────────┘
```

### Exam Collection (Child)

```
┌─────────────────────────────────────┐
│ Exam Table                          │
├─────────────────────────────────────┤
│ id (Primary Key)                    │
│ examName (Text)                     │
│ category (Relationship to ExamCategory) │
│ createdAt (Timestamp)               │
│ updatedAt (Timestamp)               │
└─────────────────────────────────────┘
```

## Relationship Flow

```
ExamCategory (1) ──────── (Many) Exam
     │                           │
     │                           │
     └─── categoryName           └─── examName
         (e.g., "Engineering")       (e.g., "JEE Main")
```

## How It Works

1. **Create ExamCategory first**:

   - Add category name (e.g., "Engineering")
   - Add SEO fields
   - Save

2. **Create Exam**:

   - Add exam name (e.g., "JEE Main")
   - Select the category from dropdown
   - Save

3. **Automatic Relationship**:
   - Exam gets linked to ExamCategory
   - ExamCategory automatically shows all related exams

## Example Data

### ExamCategory Records

```
ID: 1
categoryName: "Engineering"
seo_title: "Engineering Entrance Exams"
seo_keyword: "JEE, GATE, engineering"
createdAt: 2024-01-15
```

### Exam Records

```
ID: 1
examName: "JEE Main"
category: 1 (links to Engineering category)
createdAt: 2024-01-15

ID: 2
examName: "JEE Advanced"
category: 1 (links to Engineering category)
createdAt: 2024-01-15
```

## Admin Panel Usage

### Creating a New Exam

1. Go to **Exams** collection
2. Click **"New"** button
3. Enter exam name (e.g., "NEET")
4. Select category from dropdown (e.g., "Medical")
5. Save

### Viewing Related Data

1. In **ExamCategory** view: See all exams in that category
2. In **Exam** view: See which category the exam belongs to
3. Use filters to find exams by category

## API Usage

### Get all exams in a category

```bash
GET /api/exam?where[category][equals]=1
```

### Get exam with category details

```bash
GET /api/exam?depth=1
```

### Get category with all its exams

```bash
GET /api/exam-category?depth=1
```

This structure matches exactly what you showed in your image - simple, clean, and efficient! 🎯
