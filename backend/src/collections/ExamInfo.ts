import { CollectionConfig } from 'payload'

export const ExamInfo: CollectionConfig = {
  slug: 'exam-info',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'exam', 'createdAt'],
    description: 'Manage exam information and study materials',
    group: 'ExamInfo',
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
      label: 'Exam Info Name',
      admin: {
        description: 'e.g., JEE Main Study Guide, NEET Preparation Materials, SAT Practice Tests',
        placeholder: 'Enter exam information name',
      },
    },
    {
      name: 'exam',
      type: 'relationship',
      relationTo: 'exam',
      required: true,
      label: 'Exam',
      admin: {
        description: 'Select the exam this information is for',
      },
    },
  
   
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      admin: {
        description: 'Order in which this information appears (lower numbers first)',
        placeholder: '0',
      },
    },
    {
      name: 'files',
      type: 'array',
      label: 'Exam Info Files',
      admin: {
        description: 'Add multiple files for this sub folder',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'File Title',
          admin: {
            description: 'e.g., Physics Test 9, Chemistry Test 1 Solutions',
            placeholder: 'Enter file title',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'File URL',
          admin: {
            description: 'Enter the URL of the file',
            placeholder: 'https://example.com/file.pdf',
          },
        },
        {
          name: 'fileType',
          type: 'select',
          required: true,
          options: [
            { label: 'PDF File', value: 'PDF File' },
            { label: 'Word Document', value: 'Word Document' },
            { label: 'Excel Sheet', value: 'Excel Sheet' },
            { label: 'Image', value: 'Image' },
            { label: 'Video', value: 'Video' },
            { label: 'Other', value: 'Other' },
          ],
          label: 'File Type',
          admin: {
            description: 'Select the type of file',
          },
        },
     
        {
          name: 'order',
          type: 'number',
          label: 'File Order',
          admin: {
            description: 'Display order within sub folder (lower numbers first)',
            placeholder: '0',
          },
        },
      ],
    },
   
   
  ],
  timestamps: true,
}
