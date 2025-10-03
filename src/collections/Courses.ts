import type { CollectionConfig } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'course_name',
    defaultColumns: ['course_name', 'category', 'price', 'rating'],
    group: 'Course management',
  },
  fields: [
    // {
    //   name: 'originalId',
    //   type: 'number',
    //   unique: true,
    //   admin: {
    //     description: 'Original ID from the imported data',
    //   },
    // },
    {
      name: 'category',
      type: 'relationship',

      relationTo: 'exam_categories',
      required: true,
      admin: {
        description: 'The category this course belongs to',
      },
    },
    {
      name: 'course_name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the course',
      },
    },
    {
      name: 'course_short_description',
      type: 'textarea',
      admin: {
        description: 'Short description of the course',
      },
    },
    {
      name: 'description',
      type: 'blocks',
      blocks: [
        // ✅ RichText block
        {
          slug: 'richText',
          labels: {
            singular: 'Rich Text',
            plural: 'Rich Texts',
          },
          fields: [
            {
              name: 'content',
              type: 'richText',
              required: true,
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
          ],
        },

        // ✅ YouTube embed block
        {
          slug: 'youtube',
          labels: {
            singular: 'YouTube Video',
            plural: 'YouTube Videos',
          },
          fields: [
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'YouTube Video URL',
            },
          ],
        },

        // ✅ Table block
        {
          slug: 'table',
          labels: {
            singular: 'Table',
            plural: 'Tables',
          },
          fields: [
            {
              name: 'rows',
              type: 'array',
              label: 'Table Rows',
              fields: [
                {
                  name: 'columns',
                  type: 'array',
                  label: 'Table Columns',
                  fields: [
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ✅ List block
        {
          slug: 'list',
          labels: {
            singular: 'List',
            plural: 'Lists',
          },
          fields: [
            {
              name: 'items',
              type: 'array',
              label: 'List Items',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'ordered',
              type: 'checkbox',
              label: 'Ordered List?',
              defaultValue: false,
            },
          ],
        },

        // ✅ Custom HTML block
        {
          slug: 'html',
          labels: {
            singular: 'Custom HTML',
            plural: 'Custom HTML Blocks',
          },
          fields: [
            {
              name: 'code',
              type: 'code',
              required: true,
              label: 'HTML Code',
              admin: {
                language: 'html',
              },
            },
          ],
        },

        // ✅ Image block
        {
          slug: 'image',
          labels: {
            singular: 'Image',
            plural: 'Images',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
            },
          ],
        },

        // ✅ Quote block
        {
          slug: 'quote',
          labels: {
            singular: 'Quote',
            plural: 'Quotes',
          },
          fields: [
            {
              name: 'text',
              type: 'textarea',
              required: true,
            },
            {
              name: 'author',
              type: 'text',
            },
          ],
        },
      ],
      admin: {
        description: 'Flexible content blocks for detailed course description',
      },
    },
    {
      name: 'price',
      type: 'number',
 
      admin: {
        description: 'Price of the course',
      },
    },
    {
      name: 'rating',
      type: 'number',
      admin: {
        description: 'Course rating',
      },
    },
    {
      name: 'review',
      type: 'number',
 
      admin: {
        description: 'Number of reviews for the course',
      },
    },
    {
      name: 'start_date',
      type: 'date',
      admin: {
        description: 'Course start date',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'duration',
      type: 'text',
      admin: {
        description: 'Course duration',
      },
    },
    {
      name: 'student_count',
      type: 'number',
      
      admin: {
        description: 'Number of students enrolled',
      },
    },
    {
      name: 'course_type',
      type: 'select',
      options: [
        {
          label: 'Online',
          value: 'online',
        },
        // {
        //   label: 'Offline',
        //   value: 'offline',
        // },
        // {
        //   label: 'Hybrid',
        //   value: 'hybrid',
        // },
      ],
      admin: {
        description: 'Type of course delivery',
      },
    },
    {
      name: 'course_level',
      type: 'text',
    
      admin: {
        description: 'Difficulty level of the course',
      },
    },
    {
      name: 'other_details',
      type: 'blocks',
      blocks: [
        // ✅ RichText block
        {
          slug: 'richText',
          labels: {
            singular: 'Rich Text',
            plural: 'Rich Texts',
          },
          fields: [
            {
              name: 'content',
              type: 'richText',
              required: true,
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
          ],
        },

        // ✅ List block for features/details
        {
          slug: 'list',
          labels: {
            singular: 'List',
            plural: 'Lists',
          },
          fields: [
            {
              name: 'items',
              type: 'array',
              label: 'List Items',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'ordered',
              type: 'checkbox',
              label: 'Ordered List?',
              defaultValue: false,
            },
          ],
        },

        // ✅ Table block for structured data
        {
          slug: 'table',
          labels: {
            singular: 'Table',
            plural: 'Tables',
          },
          fields: [
            {
              name: 'rows',
              type: 'array',
              label: 'Table Rows',
              fields: [
                {
                  name: 'columns',
                  type: 'array',
                  label: 'Table Columns',
                  fields: [
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ✅ Custom HTML block
        {
          slug: 'html',
          labels: {
            singular: 'Custom HTML',
            plural: 'Custom HTML Blocks',
          },
          fields: [
            {
              name: 'code',
              type: 'code',
              required: true,
              label: 'HTML Code',
              admin: {
                language: 'html',
              },
            },
          ],
        },
      ],
      admin: {
        description: 'Additional course details and information',
      },
    },
    {
      name: 'faculty_name',
      type: 'text',
      admin: {
        description: 'Name of the faculty/instructor',
      },
    },
    {
      name: 'faculty_image',
      type: 'text',
      admin: {
        description: 'URL to faculty image',
      },
    },
    {
      name: 'course_image',
      type: 'text',
      admin: {
        description: 'URL to course image',
      },
    },
    {
      name: 'course_video',
      type: 'text',
      admin: {
        description: 'URL to course video',
      },
    },
    {
      name: 'seo_title',
      type: 'text',
      admin: {
        description: 'SEO title for the course',
      },
    },
    {
      name: 'seo_description',
      type: 'textarea',
      admin: {
        description: 'SEO description for the course',
      },
    },
    {
      name: 'seo_keywords',
      type: 'text',
      admin: {
        description: 'SEO keywords for the course',
      },
    },
  ],
  timestamps: true,
}
