import type { CollectionConfig } from 'payload'

export const Exams: CollectionConfig = {
  slug: 'exams',
  admin: {
    useAsTitle: 'examName',
    defaultColumns: ['examName', 'createdAt', 'updatedAt'],
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
      name: 'examName',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the exam',
      },
    },
    // {
    //   name: 'categories',
    //   type: 'relationship',

    //   relationTo: 'exam_categories',
    //   hasMany: true,
    //   admin: {
    //     description: 'Categories associated with this exam',
    //   },
    // },
    // {
    //   name: 'createdAt',
    //   type: 'date',
    //   admin: {
    //     date: {
    //       pickerAppearance: 'dayAndTime',
    //     },
    //   },
    // },
    // {
    //   name: 'updatedAt',
    //   type: 'date',
    //   admin: {
    //     date: {
    //       pickerAppearance: 'dayAndTime',
    //     },
    //   },
    // },
  ],
  timestamps: true,
}
