import type { CollectionConfig } from 'payload'

export const ExamCategory: CollectionConfig = {
  slug: 'exam-category',
  admin: {
    useAsTitle: 'categoryName',
    group: 'Exams',
    description: 'Manage exam categories',
  },
  access: {
    read: () => true,
  },
  fields: [

    {
      name: 'categoryName',
      type: 'text',
      required: true,
      admin: {
        description: 'Category name for the exam',
      },
    },
    {
      name: 'seo_title',
      type: 'text',
      admin: {
        description: 'SEO title for search engines',
      },
    },
    {
      name: 'seo_keyword',
      type: 'text',
      admin: {
        description: 'SEO keywords for search engines',
      },
    },
    {
      name: 'seo_description',
      type: 'textarea',
      admin: {
        description: 'SEO description for search engines',
      },
    },
    {
      name: 'exams',
      type: 'relationship',
      relationTo: 'exam',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Select exams for this category',
      },
    },
  ],
  timestamps: true,
}
