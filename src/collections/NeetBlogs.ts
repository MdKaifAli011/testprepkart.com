import type { CollectionConfig } from 'payload'

export const NeetBlogs: CollectionConfig = {
  slug: 'Neetblogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'exam', 'status', 'views', 'createdAt'],
    description: 'NEET and Medical entrance exam related blog posts',
    group: 'medical-blogs',
  },
  access: {
    read: () => true, // Everyone can read blogs
    create: () => true,
    update: () => true,
    delete: () => true,
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
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Blog title',
      },
    },
    {
      name: 'description',
      type: 'text', // Changed from richText to text
      required: true,
      admin: {
        description: 'Blog content in text format',
      },
    },
    {
      name: 'descriptionHtml',
      type: 'textarea',
      admin: {
        description: 'Original HTML content as backup (from SQL import)',
        readOnly: true,
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Short description for blog previews',
      },
    },
    {
      name: 'exam',
      type: 'relationship',
      relationTo: 'exams',
      required: true,
      admin: {
        description: 'Related exam (e.g., Medical Entrance Exams)',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'published',
      admin: {
        description: 'Blog publication status',
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'text',
      defaultValue: '5',
      required: true,
      admin: {
        description: 'Blog author name',
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image for the blog',
      },
    },
    {
      name: 'readTime',
      type: 'number',
      admin: {
        description: 'Estimated reading time in minutes',
      },
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of views',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'metaTitle',
      type: 'text',
      admin: {
        description: 'SEO meta title (auto-generated from title if empty)',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      maxLength: 160,
      admin: {
        description: 'SEO meta description (auto-generated from excerpt if empty)',
      },
    },
    {
      name: 'keywords',
      type: 'text', // Changed from array to text
      admin: {
        description: 'SEO keywords (comma-separated, auto-extracted from content)',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        description: 'Publication date (from SQL import)',
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  timestamps: true,
}
