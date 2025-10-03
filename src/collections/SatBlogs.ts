import type { CollectionConfig } from 'payload'

export const SatBlogs: CollectionConfig = {
  slug: 'satblogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'exam', 'status', 'views', 'publishedAt'],
    description: 'SAT entrance exam related blog posts',
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
        description: 'URL-friendly slug for the blog',
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
      type: 'richText',
      admin: {
        description: 'Original HTML content as backup (from SQL import)',
        readOnly: true,
      },
      defaultValue: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'text',
                  format: 0,
                  style: '',
                  text: '',
                  version: 1,
                  mode: 'normal'
                }
              ],
              direction: 'ltr'
            }
          ],
          direction: 'ltr'
        }
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
        description: 'Related exam (e.g., SAT Entrance Exams)',
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
        description: 'Blog author ID (from SQL createdBy field)',
        position: 'sidebar',
      },
    },
    {
      name: 'updatedBy',
      type: 'text',
      admin: {
        description: 'Last updated by user ID (from SQL updatedBy field)',
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      type: 'text',
      admin: {
        description: 'Featured image URL (from SQL blogImage field)',
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
