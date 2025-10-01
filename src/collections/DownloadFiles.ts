import type { CollectionConfig } from 'payload'

export const DownloadFiles: CollectionConfig = {
  slug: 'download_files',
  admin: {
    useAsTitle: 'fileName',
    defaultColumns: ['fileName', 'fileType', 'downloadSubFolder', 'downloadCount'],
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
      name: 'downloadSubFolder',
      type: 'relationship',

      relationTo: 'download_sub_folders',
      required: true,
      admin: {
        description: 'The sub folder this file belongs to',
      },
    },
    {
      name: 'fileName',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the file',
      },
    },
    {
      name: 'fileUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'URL to download the file',
      },
    },
    {
      name: 'fileType',
      type: 'select',
      options: [
        {
          label: 'PDF',
          value: 'pdf',
        },
        {
          label: 'Word Document',
          value: 'doc',
        },
        {
          label: 'ZIP Archive',
          value: 'zip',
        },
        {
          label: 'Excel',
          value: 'xls',
        },
        {
          label: 'PowerPoint',
          value: 'ppt',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      defaultValue: 'pdf',
      admin: {
        description: 'Type of the file',
      },
    },
    {
      name: 'fileSize',
      type: 'number',
      admin: {
        description: 'Size of the file in bytes',
      },
    },
    {
      name: 'downloadCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of times this file has been downloaded',
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  timestamps: true,
}
