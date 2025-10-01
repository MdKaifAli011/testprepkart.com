import type { CollectionConfig } from 'payload'

export const DownloadSubFolders: CollectionConfig = {
  slug: 'download_sub_folders',
  admin: {
    useAsTitle: 'subMenuName',
    defaultColumns: ['subMenuName', 'downloadFolder', 'createdAt'],
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
      name: 'downloadFolder',
      type: 'relationship',

      relationTo: 'download_folders',
      required: true,
      admin: {
        description: 'The download folder this sub folder belongs to',
      },
    },
    {
      name: 'subMenuName',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the sub folder',
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
            description: 'SEO title for the sub folder',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO description for the sub folder',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'SEO keywords for the sub folder',
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
