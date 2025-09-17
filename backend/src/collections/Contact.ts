import type { CollectionConfig } from 'payload'
import { autoIdHook } from '../utils/autoId'

export const Contact: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['customId', 'name', 'email', 'mobile', 'class', 'createdAt'],
    pagination: {
      defaultLimit: 50,
    },
    listSearchableFields: ['name', 'email', 'mobile', 'class'],
    group: 'Contacts',
    description: 'Manage contact leads and inquiries',
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
      label: 'Lead ID',
      admin: {
        description: 'Sequential lead ID (auto-generated)',
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email Address',
    },
    {
      name: 'country',
      type: 'text',
      required: true,
      label: 'Country',
    },
    {
      name: 'countryCode',
      type: 'text',
      required: true,
      label: 'Country Code',
    },
    {
      name: 'mobile',
      type: 'text',
      required: true,
      label: 'Mobile Number',
    },
    {
      name: 'class',
      type: 'select',
      required: true,
      label: 'Class',
      options: [
        { label: '6', value: '6' },
        { label: '7', value: '7' },
        { label: '8', value: '8' },
        { label: '9', value: '9' },
        { label: '10', value: '10' },
        { label: '11', value: '11' },
        { label: '12', value: '12' },
        { label: '12+', value: '12+' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message (Optional)',
    },

    // Automatic tracking fields
    {
      name: 'submissionDetails',
      type: 'group',
      label: 'Submission Details',
      fields: [
        {
          name: 'ipAddress',
          type: 'text',
          label: 'IP Address',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'referrerUrl',
          type: 'text',
          label: 'Previous URL (Referrer)',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'currentUrl',
          type: 'text',
          label: 'Current URL',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'timestamp',
          type: 'text',
          label: 'Submission Time',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'source',
          type: 'text',
          label: 'Form-name',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
  timestamps: true,
  // hooks: autoIdHook('leads'), // Temporarily disabled
}
