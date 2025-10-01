import type { CollectionConfig } from 'payload'

export const IdBlogs: CollectionConfig = {
  slug: 'idblogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'exam', 'status', 'commentCount', 'publishedAt'],
    description: 'International Baccalaureate (IB) related blog posts',
    group: 'international-blogs',

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
        position: 'sidebar',
        readOnly: true,
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly slug for the blog (from SQL name field)',
        position: 'sidebar',
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
        description: 'Related exam (e.g., International Entrance Exams)',
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
      defaultValue: '10',
      required: true,
      admin: {
        description: 'Blog author ID (from SQL author field)',
        position: 'sidebar',
      },
    },
    {
      name: 'commentStatus',
      type: 'select',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
      ],
      defaultValue: 'open',
      admin: {
        description: 'Comment status (from SQL commentStatus field)',
        position: 'sidebar',
      },
    },
    {
      name: 'commentCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of comments (from SQL commentCount field)',
        position: 'sidebar',
        readOnly: true,
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
        description: 'Publication date (from SQL createAt field)',
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeValidate: [
      ({ data, operation: _operation }) => {
        if (!data) return data

        // Auto-generate meta title if empty
        if (data.title && !data.metaTitle) {
          data.metaTitle = data.title
        }

        // Auto-generate meta description if empty
        if (data.excerpt && !data.metaDescription) {
          data.metaDescription = data.excerpt.substring(0, 160)
        }

        // Auto-generate slug if empty
        if (data.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
        }

        return data
      },
    ],
  },
}
