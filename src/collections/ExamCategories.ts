import type { CollectionConfig } from 'payload'

export const ExamCategories: CollectionConfig = {
  slug: 'exam_categories',
  admin: {
    useAsTitle: 'categoryName',
    defaultColumns: ['categoryName', 'exam', 'createdAt'],
    group: 'Exam management',
  },
  fields: [
    {
      name: 'originalId',
      type: 'number',
      unique: true,
      admin: {
        description: 'Original ID from the imported data',
      },
    },
    {
      name: 'exam',
      type: 'relationship',
      relationTo: 'exams',
      required: true,
      admin: {
        description: 'The exam this category belongs to',
      },
    },
    {
      name: 'categoryName',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the exam category',
      },
    },
  ],
  timestamps: true,
}
