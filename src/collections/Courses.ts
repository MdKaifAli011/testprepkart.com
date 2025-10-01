import type { CollectionConfig } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'course_name',
    defaultColumns: ['course_name', 'category', 'price', 'rating'],
    group: 'Course management',
  },
  fields: [
    {
      name: 'originalId',
      type: 'number',
      unique: true,
      admin: {
        description: 'Original ID from the imported data',
      },
    },
    {
      name: 'category',
      type: 'relationship',

      relationTo: 'exam_categories',
      required: true,
      admin: {
        description: 'The category this course belongs to',
      },
    },
    {
      name: 'course_name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the course',
      },
    },
    {
      name: 'course_short_description',
      type: 'textarea',
      admin: {
        description: 'Short description of the course',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed description of the course',
      },
    },
    {
      name: 'price',
      type: 'number',
      admin: {
        description: 'Price of the course',
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      admin: {
        description: 'Course rating (0-5)',
      },
    },
    {
      name: 'review',
      type: 'number',
      admin: {
        description: 'Number of reviews for the course',
      },
    },
    {
      name: 'start_date',
      type: 'date',
      admin: {
        description: 'Course start date',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'duration',
      type: 'text',
      admin: {
        description: 'Course duration',
      },
    },
    {
      name: 'student_count',
      type: 'number',
      admin: {
        description: 'Number of students enrolled',
      },
    },
    {
      name: 'course_type',
      type: 'select',
      options: [
        {
          label: 'Online',
          value: 'online',
        },
        {
          label: 'Offline',
          value: 'offline',
        },
        {
          label: 'Hybrid',
          value: 'hybrid',
        },
      ],
      admin: {
        description: 'Type of course delivery',
      },
    },
    {
      name: 'course_level',
      type: 'select',
      options: [
        {
          label: 'Beginner',
          value: '1',
        },
        {
          label: 'Intermediate',
          value: '2',
        },
        {
          label: 'Advanced',
          value: '3',
        },
      ],
      admin: {
        description: 'Difficulty level of the course',
      },
    },
    {
      name: 'other_details',
      type: 'richText',
      admin: {
        description: 'Additional course details',
      },
    },
    {
      name: 'faculty_name',
      type: 'text',
      admin: {
        description: 'Name of the faculty/instructor',
      },
    },
    {
      name: 'faculty_image',
      type: 'text',
      admin: {
        description: 'URL to faculty image',
      },
    },
    {
      name: 'course_image',
      type: 'text',
      admin: {
        description: 'URL to course image',
      },
    },
    {
      name: 'course_video',
      type: 'text',
      admin: {
        description: 'URL to course video',
      },
    },
    {
      name: 'seo_title',
      type: 'text',
      admin: {
        description: 'SEO title for the course',
      },
    },
    {
      name: 'seo_description',
      type: 'textarea',
      admin: {
        description: 'SEO description for the course',
      },
    },
    {
      name: 'seo_keywords',
      type: 'text',
      admin: {
        description: 'SEO keywords for the course',
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  timestamps: true,
}
