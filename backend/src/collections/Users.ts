import type { CollectionConfig } from 'payload'
import { autoIdHook } from '../utils/autoId'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['customId', 'email', 'role', 'createdAt'],
    group: 'Users',
    description: 'Manage admin users and editors',
    listSearchableFields: ['email', 'role'],
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
  auth: true,
  fields: [
    {
      name: 'customId',
      type: 'number',
      required: false,
      unique: false,
      label: 'User ID',
      admin: {
        description: 'Sequential user ID (auto-generated)',
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      label: 'Role',
      admin: {
        description: 'User role and permissions',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  // hooks: autoIdHook('users'), // Temporarily disabled for testing
}
