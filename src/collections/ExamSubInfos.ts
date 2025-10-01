import type { CollectionConfig } from 'payload'

export const ExamSubInfos: CollectionConfig = {
  slug: 'exam_sub_infos',
  admin: {
    useAsTitle: 'subMenuName',
    defaultColumns: ['subMenuName', 'examInfo', 'createdAt'],
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
      name: 'examInfo',
      type: 'relationship',

      relationTo: 'exam_infos',
      required: true,
      admin: {
        description: 'The exam info this sub info belongs to',
      },
    },
    {
      name: 'subMenuName',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the sub menu item',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Description of the sub info',
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
            description: 'SEO title for the sub info',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO description for the sub info',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'SEO keywords for the sub info',
          },
        },
      ],
    },
    // {
    //   name: 'createdAt',
    //   type: 'date',
    //   admin: {
    //     date: {
    //       pickerAppearance: 'dayAndTime',
    //     },
    //   },
    // },
    // {
    //   name: 'updatedAt',
    //   type: 'date',
    //   admin: {
    //     date: {
    //       pickerAppearance: 'dayAndTime',
    //     },
    //   },
    // },
  ],
  timestamps: true,
}
