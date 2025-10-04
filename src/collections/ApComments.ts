import type { CollectionConfig } from 'payload'

export const ApComments: CollectionConfig = {
  slug: 'ap_comments',
  admin: {
    useAsTitle: 'comment_author',
    defaultColumns: ['comment_author', 'comment_post_ID', 'comment_date', 'status', 'createdAt'],
    description: 'Comments on AP blog posts',
    group: 'comments section',
  },

  access: {
    read: () => true, // Everyone can read comments
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  fields: [
    {
      name: 'originalId',
      type: 'number',
      unique: true,
      admin: {
        description: 'Original comment ID from the imported data',
      },
    },
    {
      name: 'comment_post_ID',
      type: 'number',
      required: true,
      admin: {
        description: 'Original post ID from SQL (will be mapped to blog originalId)',
      },
    },
    {
      name: 'blog',
      type: 'relationship',
      relationTo: 'apblogs',
      admin: {
        description: 'Related AP blog (mapped from comment_post_ID)',
      },
    },
    {
      name: 'comment_author',
      type: 'text',
      required: true,
      admin: {
        description: 'Comment author name',
      },
    },
    {
      name: 'comment_author_email',
      type: 'email',
      admin: {
        description: 'Comment author email',
      },
    },
    {
      name: 'comment_content',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Comment content',
      },
    },
    {
      name: 'comment_date',
      type: 'date',
      required: true,
      admin: {
        description: 'Original comment date from SQL',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Spam', value: 'spam' },
        { label: 'Trash', value: 'trash' },
      ],
      defaultValue: 'approved',
      admin: {
        description: 'Comment moderation status',
        position: 'sidebar',
      },
    },
    {
      name: 'isSpam',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as spam (auto-detected)',
        position: 'sidebar',
      },
    },
    {
      name: 'isReply',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Is this a reply to another comment',
        position: 'sidebar',
      },
    },
    {
      name: 'parentComment',
      type: 'relationship',
      relationTo: 'ap_comments',
      admin: {
        description: 'Parent comment if this is a reply',
      },
    },
    {
      name: 'likes',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of likes',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'dislikes',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of dislikes',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'IP address of commenter (if available)',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'User agent string (if available)',
      },
    },
  ],

  timestamps: true,
}
