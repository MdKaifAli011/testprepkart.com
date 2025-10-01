import type { CollectionConfig } from 'payload'

export const DownloadFolders: CollectionConfig = {
  slug: 'download_folders',
  admin: {
    useAsTitle: 'menuName',
    defaultColumns: ['menuName', 'category', 'createdAt'],
    group: 'Download management',
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
        description: 'The category this download folder belongs to',
      },
    },
    {
      name: 'menuName',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the download folder',
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
            description: 'SEO title for the download folder',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO description for the download folder',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'SEO keywords for the download folder',
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
