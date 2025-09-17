import type { CollectionConfig } from 'payload'
import { autoIdHook } from '../utils/autoId'

export const Exam: CollectionConfig = {
  slug: 'exam',
  admin: {
    useAsTitle: 'examName',
    group: 'Exams',
    description: 'Manage individual exams',
    defaultColumns: ['customId', 'examName', 'category', 'createdAt', 'updatedAt'],
    listSearchableFields: ['examName'],
    pagination: {
      defaultLimit: 25,
    },
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
      label: 'Exam ID',
      admin: {
        description: 'Sequential exam ID (auto-generated)',
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'examName',
      type: 'text',
      required: true,
      label: 'Exam Name',
      admin: {
        description: 'Name of the exam (e.g., JEE Main, NEET, GATE)',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'exam-category',
      hasMany: false,
      required: true,
      label: 'Exam Category',
      admin: {
        position: 'sidebar',
        description: 'Select the category this exam belongs to',
      },
    },
  ],
  timestamps: true,
  // hooks: autoIdHook('exam'), // Temporarily disabled
}
