import { CollectionConfig } from 'payload'
import { autoIdHook } from '../utils/autoId'

export const ExamInfo: CollectionConfig = {
  slug: 'exam-info',
  admin: {
    useAsTitle: 'menuName',
    defaultColumns: ['customId', 'menuName', 'exam', 'category', 'createdAt', 'updatedAt'],
    description: 'Manage exam information and study materials',
    group: 'ExamInfo',
    listSearchableFields: ['menuName', 'seo_title', 'seo_keywords'],
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
      label: 'Exam Info ID',
      admin: {
        description: 'Sequential exam info ID (auto-generated)',
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'menuName',
      type: 'text',
      required: true,
      label: 'Menu Name',
      admin: {
        description:
          'Name of the menu item (e.g., JEE Main Study Guide, NEET Preparation Materials)',
        placeholder: 'Enter menu name',
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
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'exam-category',
      required: true,
      label: 'Category',
      admin: {
        description: 'Select the category this information belongs to',
        position: 'sidebar',
      },
    },
    {
      name: 'seo_title',
      type: 'text',
      label: 'SEO Title',
      admin: {
        description: 'SEO title for search engines',
      },
    },
    {
      name: 'seo_description',
      type: 'textarea',
      label: 'SEO Description',
      admin: {
        description: 'SEO description for search engines',
      },
    },
    {
      name: 'seo_keywords',
      type: 'text',
      label: 'SEO Keywords',
      admin: {
        description: 'SEO keywords for search engines',
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
  // hooks: autoIdHook('exam-info'), // Temporarily disabled
}
