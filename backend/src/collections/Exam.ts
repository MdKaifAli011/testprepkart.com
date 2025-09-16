import type { CollectionConfig } from 'payload'

export const Exam: CollectionConfig = {
  slug: 'exam',
  admin: {
    useAsTitle: 'examName',
    group: 'Exams',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'examName',
      type: 'text',
      required: true,
    },

    {
      name: 'category',
      type: 'relationship',
      relationTo: 'exam-category',
      hasMany: false,
      admin: {
        position: 'sidebar',
        description: 'Select or create exam category',
      },
    },
  ],
  timestamps: true,
}
