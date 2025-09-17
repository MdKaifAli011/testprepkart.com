import type { CollectionConfig } from 'payload'
import { autoIdHook } from '../utils/autoId'

export const ExamCategory: CollectionConfig = {
  slug: 'exam-category',
  admin: {
    useAsTitle: 'categoryName',
    group: 'Exams',
    description: 'Manage exam categories',
    defaultColumns: ['customId', 'categoryName', 'createdAt', 'updatedAt'],
    pagination: {
      defaultLimit: 25,
    },
    listSearchableFields: ['categoryName'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'customId',
      type: 'number',
      required: true,
      unique: true,
      label: 'Category ID',
      admin: {
        description: 'Sequential category ID (auto-generated)',
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'categoryName',
      type: 'text',
      required: true,
      label: 'Category Name',
      admin: {
        description: 'Name of the exam category (e.g., Engineering, Medical, Management)',
      },
    },

    {
      name: 'exams',
      type: 'relationship',
      relationTo: 'exam',
      hasMany: true,
      label: 'Exams in this Category',
      admin: {
        position: 'sidebar',
        description: 'Exams that belong to this category (auto-populated)',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
  // hooks: autoIdHook('exam-category'), // Temporarily disabled
}
