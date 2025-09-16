import { CollectionConfig } from 'payload'

export const ExamSubInfo: CollectionConfig = {
  slug: 'exam-sub-info',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parentInfo', 'order', 'createdAt'],
    group: 'ExamInfo',
    description: 'Organize exam information using sub information sections',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Sub Information Name',
      
    },
    {
      name: 'parentInfo',
      type: 'relationship',
      relationTo: 'exam-info',
      required: true,
      label: 'Parent Exam Info',
      admin: {
        description: 'Select which exam information this sub info belongs to',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Sort Order',
      admin: {
        description: 'Display order within the parent exam info (lower numbers appear first)',
        placeholder: '0',
      },
    },
   
  ],
  timestamps: true,
}
