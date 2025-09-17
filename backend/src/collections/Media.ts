import type { CollectionConfig } from 'payload'
import { autoIdHook } from '../utils/autoId'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['customId', 'filename', 'alt', 'mimeType', 'createdAt'],
    group: 'Content',
    description: 'Manage uploaded files and media',
    listSearchableFields: ['filename', 'alt'],
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
      label: 'Media ID',
      admin: {
        description: 'Sequential media ID (auto-generated)',
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
      admin: {
        description: 'Alternative text for accessibility',
      },
    },
  ],
  upload: true,
  timestamps: true,
  // hooks: autoIdHook('media'), // Temporarily disabled
}
