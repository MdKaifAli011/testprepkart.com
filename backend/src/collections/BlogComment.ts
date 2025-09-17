import type { CollectionConfig } from 'payload'
import { autoIdHook } from '../utils/autoId'

export const BlogComment: CollectionConfig = {
  slug: 'blog-comments',
  labels: {
    singular: 'Blog Comment',
    plural: 'Blog Comments',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'author_name',
    defaultColumns: [
      'customId',
      'author_name',
      'author_email',
      'blog',
      'status',
      'comment_date',
      'createdAt',
    ],
    group: 'Blog',
    description: 'Manage blog comments',
    listSearchableFields: ['author_name', 'author_email', 'content'],
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
      label: 'Comment ID',
      admin: {
        description: 'Sequential comment ID (auto-generated)',
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'blog',
      type: 'relationship',
      relationTo: 'post',
      required: true,
      label: 'Blog Post',
      admin: {
        description: 'Select the blog post this comment belongs to',
        position: 'sidebar',
      },
    },
    {
      name: 'author_name',
      type: 'text',
      required: true,
      label: 'Author Name',
      admin: {
        description: 'Name of the comment author',
        placeholder: 'Enter author name',
      },
    },
    {
      name: 'author_email',
      type: 'email',
      required: true,
      label: 'Author Email',
      admin: {
        description: 'Email address of the comment author',
        placeholder: 'author@example.com',
      },
    },
    {
      name: 'comment_author_ip',
      type: 'text',
      label: 'Comment Author IP',
      admin: {
        description: 'IP address of the comment author',
        readOnly: true,
      },
    },
    {
      name: 'comment_date',
      type: 'date',
      required: true,
      label: 'Comment Date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: 'Date and time when the comment was posted',
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Comment Content',
      admin: {
        description: 'The actual content of the comment',
        placeholder: 'Enter your comment...',
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
        description: 'Approval status of the comment',
        position: 'sidebar',
      },
    },
    {
      name: 'replies',
      type: 'relationship',
      relationTo: 'blog-comment-replies',
      hasMany: true,
      label: 'Replies',
      admin: {
        description: 'Replies to this comment (auto-populated)',
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
  // hooks: autoIdHook('blog-comments'), // Temporarily disabled
}
