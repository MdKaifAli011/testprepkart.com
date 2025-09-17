import { CollectionConfig } from 'payload'
import { autoIdHook } from '../utils/autoId'

export const SubFolder: CollectionConfig = {
  slug: 'sub-folders',
  admin: {
    useAsTitle: 'subMenuName',
    defaultColumns: ['customId', 'subMenuName', 'menuId', 'createdAt', 'updatedAt'],
    group: 'DownloadMenus',
    description: 'Organize content within download menus using sub folders',
    listSearchableFields: ['subMenuName'],
    pagination: {
      defaultLimit: 25,
    },
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'customId',
      type: 'number',
      required: true,
      unique: true,
      label: 'Sub Folder ID',
      admin: {
        description: 'Sequential sub folder ID (auto-generated)',
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'subMenuName',
      type: 'text',
      required: true,
      label: 'Sub Menu Name',
      admin: {
        description: 'Name of the sub folder/menu (e.g., Physics Sample Papers, Chemistry Notes)',
        placeholder: 'Enter sub menu name',
      },
    },
    {
      name: 'menuId',
      type: 'relationship',
      relationTo: 'download-menus',
      required: true,
      label: 'Menu ID (Parent Download Folder)',
      admin: {
        description: 'Select which download folder this sub folder belongs to',
        position: 'sidebar',
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
  // hooks: autoIdHook('sub-folders'), // Temporarily disabled
}
