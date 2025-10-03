import type { CollectionConfig } from 'payload'

export const ExamInfos: CollectionConfig = {
  slug: 'exam_infos',
  admin: {
    useAsTitle: 'menuName',
    defaultColumns: ['menuName', 'category', 'createdAt'],
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
      name: 'category',
      type: 'relationship',

      relationTo: 'exam_categories',
      required: true,
      admin: {
        description: 'The category this exam info belongs to',
      },
    },
    {
      name: 'menuName',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the exam info menu item',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Description of the exam info',
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
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'SEO title for the exam info',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO description for the exam info',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'SEO keywords for the exam info',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
