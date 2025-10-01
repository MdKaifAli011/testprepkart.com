import type { CollectionConfig } from 'payload'

export const JeeBlogs: CollectionConfig = {
  slug: 'Jeeblogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'exam', 'status', 'views', 'createdAt'],
    description: 'Engineering and JEE entrance exam related blog posts',
    group: 'engineering-blogs',
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
    // {
    //   name: 'slug',
    //   type: 'text',
    //   required: true,
    //   unique: true,
    //   admin: {
    //     description: 'URL-friendly version of the title',
    //   },
    //   hooks: {
    //     beforeValidate: [
    //       ({ data, operation }) => {
    //         if (operation === 'create' && data?.title && !data?.slug) {
    //           data.slug = data.title
    //             .toLowerCase()
    //             .replace(/[^a-z0-9]+/g, '-')
    //             .replace(/(^-|-$)/g, '')
    //         }
    //       },
    //     ],
    //   },
    // },
    {
      name: 'description',
      type: 'text',
      required: true,
      admin: {
        description: 'Blog content in Lexical format',
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
        description: 'Related exam (e.g., Engineering Entrance Exams)',
      },
    },
  
    // {
    //   name: 'tags',
    //   type: 'array',
    //   fields: [
    //     {
    //       name: 'tag',
    //       type: 'text',
    //       required: true,
    //     },
    //   ],
    //   admin: {
    //     description: 'Blog tags for categorization',
    //   },
    // },
    // {
    //   name: 'featured',
    //   type: 'checkbox',
    //   defaultValue: false,
    //   admin: {
    //     description: 'Mark as featured blog (first 5 blogs are automatically featured)',
    //     position: 'sidebar',
    //   },
    // },
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
      defaultValue: 'TestPrepKart',
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
      type: 'text',
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
