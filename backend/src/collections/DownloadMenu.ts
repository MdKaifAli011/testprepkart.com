import { CollectionConfig } from 'payload'
import { autoIdHook } from '../utils/autoId'

export const DownloadMenu: CollectionConfig = {
  slug: 'download-menus',
  admin: {
    useAsTitle: 'menuName',
    defaultColumns: ['customId', 'menuName', 'exam', 'category', 'createdAt', 'updatedAt'],
    description: 'Manage download folders for different exam types',
    group: 'DownloadMenus',
    listSearchableFields: ['menuName', 'seo_title', 'seo_keywords'],
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
      label: 'Download Menu ID',
      admin: {
        description: 'Sequential download menu ID (auto-generated)',
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'menuName',
      type: 'text',
      required: true,
      label: 'Menu Name',
      admin: {
        description: 'Name of the download folder/menu (e.g., Study Material, Sample Papers)',
        placeholder: 'Enter menu name',
      },
    },
    {
      name: 'exam',
      type: 'relationship',
      relationTo: 'exam',
      required: true,
      label: 'Exam',
      admin: {
        description: 'Select the exam this download folder is for',
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'exam-category',
      required: true,
      label: 'Category',
      admin: {
        description: 'Select the category this download folder belongs to',
        position: 'sidebar',
      },
    },
    {
      name: 'seo_title',
      type: 'text',
      label: 'SEO Title',
      admin: {
        description: 'SEO title for search engines',
      },
    },
    {
      name: 'seo_description',
      type: 'textarea',
      label: 'SEO Description',
      admin: {
        description: 'SEO description for search engines',
      },
    },
    {
      name: 'seo_keywords',
      type: 'text',
      label: 'SEO Keywords',
      admin: {
        description: 'SEO keywords for search engines',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      admin: {
        description: 'Order in which this menu appears (lower numbers first)',
        placeholder: '0',
      },
    },
    {
      name: 'subFolders',
      type: 'relationship',
      relationTo: 'sub-folders',
      hasMany: true,
      label: 'Sub Folders',
      admin: {
        description: 'Sub folders that belong to this download folder (auto-populated)',
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
  // hooks: autoIdHook('download-menus'), // Temporarily disabled
}
