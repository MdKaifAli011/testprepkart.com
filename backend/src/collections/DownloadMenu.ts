import { CollectionConfig } from 'payload'

export const DownloadMenu: CollectionConfig = {
  slug: 'download-menus',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'exam', 'createdAt'],
    description: 'Manage download menus for different exam types',
    group: 'DownloadMenus',
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
      label: 'Menu Name',
      admin: {
        description: 'e.g., Study Material, Sample Papers, Answer Keys, Past Year Papers',
        placeholder: 'Enter menu name',
      },
    },
    {
      name: 'exam',
      type: 'select',
      required: true,
      options: [
        { label: 'JEE Main', value: 'JEE Main' },
        { label: 'JEE Advanced', value: 'JEE Advanced' },
        { label: 'NEET', value: 'NEET' },
        { label: 'GATE', value: 'GATE' },
        { label: 'UPSC', value: 'UPSC' },
        { label: 'All Exams', value: 'All Exams' },
      ],
      label: 'Exam Type',
      admin: {
        description: 'Select the exam type this menu is for',
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
        description: 'Add sub folders to organize content within this menu',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
