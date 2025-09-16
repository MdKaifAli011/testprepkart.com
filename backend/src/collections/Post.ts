import type { CollectionConfig } from 'payload'

export const Post: CollectionConfig = {
  slug: 'post',
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'class', 'publishedDate'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      defaultValue: 'Anonymous',
    },
    {
      name: 'publishedDate',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
    },
  /*   {
      name: 'class',
      type: 'select',
      hasMany: true,
      required: false,
      options: [
        { label: 'All', value: 'all' },
        { label: '8', value: '8' },
        { label: '9', value: '9' },
        { label: '10', value: '10' },
        { label: '11', value: '11' },
        { label: '12', value: '12' },
      ],
    }, */
    {
      name: 'layout',
      type: 'blocks',
      label: 'Content Blocks',
      required: false,
      blocks: [
        {
          slug: 'hero',
          labels: { singular: 'Hero', plural: 'Heros' },
          fields: [
            { name: 'headline', type: 'text' },
            { name: 'subheadline', type: 'text' },
            {
              name: 'background',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          slug: 'richText',
          labels: { singular: 'Rich Text', plural: 'Rich Texts' },
          fields: [
            {
              name: 'body',
              type: 'richText',
              label: 'Content',
            },
          ],
        },
        {
          slug: 'list',
          labels: { singular: 'List', plural: 'Lists' },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'List Title',
            },
            {
              name: 'listType',
              type: 'select',
              label: 'List Type',
              options: [
                { label: 'Bulleted List', value: 'bullet' },
                { label: 'Numbered List', value: 'number' },
                { label: 'Checklist', value: 'checklist' },
              ],
              defaultValue: 'bullet',
            },
            {
              name: 'items',
              type: 'array',
              label: 'List Items',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Item Text',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Item Description',
                },
                {
                  name: 'checked',
                  type: 'checkbox',
                  label: 'Checked (for checklists)',
                  admin: {
                    condition: (_data, siblingData, { user: _user }) => {
                      return siblingData?.listType === 'checklist'
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          slug: 'image',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
            { name: 'alt', type: 'text' },
            { name: 'caption', type: 'text' },
            {
              name: 'imageType',
              type: 'select',
              label: 'Image Type',
              options: [
                { label: 'Full Width', value: 'fullWidth' },
                { label: 'Book Preview', value: 'bookPreview' },
                { label: 'Regular', value: 'regular' },
              ],
              defaultValue: 'regular',
            },
            {
              name: 'bookDetails',
              type: 'group',
              label: 'Book Details (for Book Preview type)',
              admin: {
                condition: (_data, siblingData, { user: _user }) => {
                  return siblingData?.imageType === 'bookPreview'
                },
              },
              fields: [
                { name: 'bookTitle', type: 'text', label: 'Book Title' },
                { name: 'author', type: 'text', label: 'Author' },
                { name: 'publisher', type: 'text', label: 'Publisher' },
                { name: 'isbn', type: 'text', label: 'ISBN' },
                { name: 'pages', type: 'number', label: 'Number of Pages' },
                { name: 'price', type: 'text', label: 'Price' },
                { name: 'description', type: 'textarea', label: 'Book Description' },
                { name: 'downloadLink', type: 'text', label: 'Download Link' },
                { name: 'previewPages', type: 'number', label: 'Preview Pages', defaultValue: 3 },
              ],
            },
            {
              name: 'fullWidth',
              type: 'checkbox',
              admin: {
                condition: (_data, siblingData, { user: _user }) =>
                  siblingData?.imageType === 'fullWidth',
              },
            },
          ],
        },
        {
          slug: 'youtube',
          fields: [
            { name: 'url', type: 'text', required: false },
            { name: 'title', type: 'text' },
            { name: 'start', type: 'number' },
          ],
        },
        {
          slug: 'buttonRow',
          fields: [
            {
              name: 'buttons',
              type: 'array',
              fields: [
                { name: 'text', type: 'text', required: false },
                { name: 'url', type: 'text', required: false },
                {
                  name: 'variant',
                  type: 'select',
                  options: [
                    { label: 'Primary', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                  ],
                  defaultValue: 'primary',
                },
              ],
            },
          ],
        },
        {
          slug: 'htmlEmbed',
          fields: [{ name: 'html', type: 'code', required: false }],
        },
        {
          slug: 'table',
          fields: [
            { name: 'title', type: 'text' },
            {
              name: 'columns',
              type: 'array',
              required: false,
              fields: [{ name: 'name', type: 'text', required: false }],
            },
            {
              name: 'rows',
              type: 'array',
              required: false,
              fields: [
                {
                  name: 'cells',
                  type: 'array',
                  required: false,
                  fields: [{ name: 'value', type: 'text', required: false }],
                },
              ],
            },
          ],
        },
        {
          slug: 'pdf',
          fields: [
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Upload a PDF file to preview inline',
              },
            },
            { name: 'title', type: 'text' },
            { name: 'height', type: 'number', defaultValue: 600 },
          ],
        },
        {
          slug: 'book',
          labels: { singular: 'Book', plural: 'Books' },
          fields: [
            { name: 'title', type: 'text', required: true, label: 'Book Title' },
            { name: 'author', type: 'text', required: true, label: 'Author' },
            { name: 'publisher', type: 'text', label: 'Publisher' },
            { name: 'isbn', type: 'text', label: 'ISBN' },
            { name: 'pages', type: 'number', label: 'Number of Pages' },
            { name: 'price', type: 'text', label: 'Price' },
            { name: 'description', type: 'textarea', label: 'Book Description' },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Cover Image',
              required: false,
            },
            {
              name: 'previewImages',
              type: 'array',
              label: 'Preview Pages',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                { name: 'pageNumber', type: 'number', label: 'Page Number' },
                { name: 'caption', type: 'text', label: 'Caption' },
              ],
            },
            { name: 'downloadLink', type: 'text', label: 'Download Link' },
            { name: 'buyLink', type: 'text', label: 'Buy Link' },
            { name: 'rating', type: 'number', label: 'Rating (1-5)', min: 1, max: 5 },
            { name: 'featured', type: 'checkbox', label: 'Featured Book', defaultValue: false },
            {
              name: 'categories',
              type: 'select',
              hasMany: true,
              label: 'Book Categories',
              options: [
                { label: 'JEE Preparation', value: 'jee' },
                { label: 'NEET Preparation', value: 'neet' },
                { label: 'SAT Preparation', value: 'sat' },
                { label: 'Study Material', value: 'study' },
                { label: 'Practice Tests', value: 'practice' },
                { label: 'Reference Books', value: 'reference' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
