import type { CollectionConfig } from 'payload'
import { autoIdHook } from '../utils/autoId'

export const BlogCommentReply: CollectionConfig = {
  slug: 'blog-comment-replies',
  labels: {
    singular: 'Blog Comment Reply',
    plural: 'Blog Comment Replies',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'reply_author_name',
    defaultColumns: [
      'customId',
      'reply_author_name',
      'reply_author_email',
      'comment',
      'status',
      'reply_date',
      'createdAt',
    ],
    group: 'Blog',
    description: 'Manage replies to blog comments',
    listSearchableFields: ['reply_author_name', 'reply_author_email', 'reply_content'],
    pagination: {
      defaultLimit: 25,
    },
  },
  fields: [
    {
      name: 'customId',
      type: 'number',
      required: true,
      unique: true,
      label: 'Reply ID',
      admin: {
        description: 'Sequential reply ID (auto-generated)',
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'comment',
      type: 'relationship',
      relationTo: 'blog-comments',
      required: true,
      label: 'Comment',
      admin: {
        description: 'Select the comment this reply belongs to',
        position: 'sidebar',
      },
    },
    {
      name: 'reply_content',
      type: 'textarea',
      required: true,
      label: 'Reply Content',
      admin: {
        description: 'The actual content of the reply',
        placeholder: 'Enter your reply...',
      },
    },
    {
      name: 'reply_author_name',
      type: 'text',
      required: true,
      label: 'Reply Author Name',
      admin: {
        description: 'Name of the reply author',
        placeholder: 'Enter author name',
      },
    },
    {
      name: 'reply_author_email',
      type: 'email',
      required: true,
      label: 'Reply Author Email',
      admin: {
        description: 'Email address of the reply author',
        placeholder: 'author@example.com',
      },
    },
    {
      name: 'reply_author_ip',
      type: 'text',
      label: 'Reply Author IP',
      admin: {
        description: 'IP address of the reply author',
        readOnly: true,
      },
    },
    {
      name: 'reply_date',
      type: 'date',
      required: true,
      label: 'Reply Date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: 'Date and time when the reply was posted',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Approved', value: 'approved' },
        { label: 'Unapproved', value: 'unapproved' },
      ],
      defaultValue: 'unapproved',
      label: 'Status',
      admin: {
        description: 'Approval status of the reply',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  // hooks: autoIdHook('blog-comment-replies'), // Temporarily disabled
}
