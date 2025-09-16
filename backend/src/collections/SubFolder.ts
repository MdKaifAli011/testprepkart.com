import { CollectionConfig } from 'payload'

export const SubFolder: CollectionConfig = {
  slug: 'sub-folders',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'mainFolder', 'order', 'createdAt'],
    group: 'DownloadMenus',
    description: 'Organize content within download menus using sub folders',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Sub Folder Name',
      admin: {
        description: 'e.g., Physics Sample Paper, Chemistry Sample Papers',
      },
    },
    {
      name: 'mainFolder',
      type: 'relationship',
      relationTo: 'download-menus',
      required: true,
      label: 'Parent Menu',
      admin: {
        description: 'Select which download menu this sub folder belongs to',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Sort Order',
      admin: {
        description: 'Display order within the parent menu (lower numbers appear first)',
        placeholder: '0',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Optional description for this sub folder',
        placeholder: 'Enter a description for this sub folder',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        description: 'Whether this sub folder is currently active and visible',
      },
    },
    {
      name: 'files',
      type: 'array',
      label: 'Download Items',
      admin: {
        description: 'Add multiple files for this sub folder',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'File Title',
          admin: {
            description: 'e.g., Physics Test 9, Chemistry Test 1 Solutions',
            placeholder: 'Enter file title',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'File URL',
          admin: {
            description: 'Enter the URL of the file',
            placeholder: 'https://example.com/file.pdf',
          },
        },
        {
          name: 'fileType',
          type: 'select',
          required: true,
          options: [
            { label: 'PDF File', value: 'PDF File' },
            { label: 'Word Document', value: 'Word Document' },
            { label: 'Excel Sheet', value: 'Excel Sheet' },
            { label: 'Image', value: 'Image' },
            { label: 'Video', value: 'Video' },
            { label: 'Other', value: 'Other' },
          ],
          label: 'File Type',
          admin: {
            description: 'Select the type of file',
          },
        },
        {
          name: 'locked',
          type: 'checkbox',
          defaultValue: true,
          label: 'Locked (Requires Contact Form)',
          admin: {
            description: 'Whether this file requires contact form submission to download',
          },
        },
        {
          name: 'order',
          type: 'number',
          label: 'File Order',
          admin: {
            description: 'Display order within sub folder (lower numbers first)',
            placeholder: '0',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
