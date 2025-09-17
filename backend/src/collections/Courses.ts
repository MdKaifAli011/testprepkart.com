import { CollectionConfig } from 'payload'
import { autoIdHook } from '../utils/autoId'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'course_name',
    defaultColumns: [
      'customId',
      'course_name',
      'category',
      'price',
      'rating',
      'course_type',
      'course_level',
      'createdAt',
    ],
    group: 'Courses',
    description: 'Manage courses and educational content',
    listSearchableFields: [
      'course_name',
      'course_short_description',
      'faculty_name',
      'seo_title',
      'seo_keywords',
    ],
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
      label: 'Course ID',
      admin: {
        description: 'Sequential course ID (auto-generated)',
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'exam-category',
      required: true,
      label: 'Category',
      admin: {
        description: 'Select the exam category this course belongs to',
        position: 'sidebar',
      },
    },
    {
      name: 'course_name',
      type: 'text',
      required: true,
      label: 'Course Name',
      admin: {
        description: 'Name of the course',
        placeholder: 'Enter course name',
      },
    },
    {
      name: 'course_short_description',
      type: 'textarea',
      required: true,
      label: 'Course Short Description',
      admin: {
        description: 'Brief description of the course',
        placeholder: 'Enter short description',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Full Description',
      admin: {
        description: 'Detailed description of the course content',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Price',
      admin: {
        description: 'Course price in your currency',
        placeholder: '0',
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      label: 'Rating',
      admin: {
        description: 'Course rating (0-5 stars)',
        placeholder: '0',
      },
    },
    {
      name: 'review',
      type: 'textarea',
      label: 'Review',
      admin: {
        description: 'Course review or feedback',
      },
    },
    {
      name: 'start_date',
      type: 'date',
      required: true,
      label: 'Start Date',
      admin: {
        description: 'Course start date',
        position: 'sidebar',
      },
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
      label: 'Duration (in minutes)',
      admin: {
        description: 'Course duration in minutes',
        placeholder: '0',
      },
    },
    {
      name: 'student_count',
      type: 'number',
      label: 'Number of Students',
      admin: {
        description: 'Current number of enrolled students',
        placeholder: '0',
      },
    },
    {
      name: 'course_type',
      type: 'select',
      required: true,
      options: [
        { label: 'Online', value: 'online' },
        { label: 'Offline', value: 'offline' },
      ],
      defaultValue: 'online',
      label: 'Course Type',
      admin: {
        description: 'Whether the course is online or offline',
        position: 'sidebar',
      },
    },
    {
      name: 'course_level',
      type: 'select',
      required: true,
      options: [
        { label: 'Going to 9th', value: 'going_to_9th' },
        { label: 'Going to 10th', value: 'going_to_10th' },
        { label: 'Going to 11th', value: 'going_to_11th' },
        { label: 'Going to 12th', value: 'going_to_12th' },
        { label: '12th Pass', value: '12th_pass' },
        { label: 'Graduate', value: 'graduate' },
        { label: 'Post Graduate', value: 'post_graduate' },
      ],
      label: 'Course Level',
      admin: {
        description: 'Academic level the course is designed for',
        position: 'sidebar',
      },
    },
    {
      name: 'other_details',
      type: 'textarea',
      label: 'Other Details',
      admin: {
        description: 'Any additional relevant information about the course',
      },
    },
    {
      name: 'faculty_name',
      type: 'text',
      required: true,
      label: 'Faculty Name',
      admin: {
        description: 'Name of the faculty teaching the course',
        placeholder: 'Enter faculty name',
      },
    },
    {
      name: 'faculty_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Faculty Image',
      admin: {
        description: 'Image of the faculty member',
        position: 'sidebar',
      },
    },
    {
      name: 'course_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Course Image',
      admin: {
        description: 'Main image for the course',
        position: 'sidebar',
      },
    },
    {
      name: 'course_video',
      type: 'upload',
      relationTo: 'media',
      label: 'Course Video',
      admin: {
        description: 'Introductory or promotional video for the course',
        position: 'sidebar',
      },
    },
    {
      name: 'seo_title',
      type: 'text',
      label: 'SEO Title',
      admin: {
        description: 'SEO-optimized title for search engines',
      },
    },
    {
      name: 'seo_description',
      type: 'textarea',
      label: 'SEO Description',
      admin: {
        description: 'SEO-optimized description for search engines',
      },
    },
    {
      name: 'seo_keywords',
      type: 'text',
      label: 'SEO Keywords',
      admin: {
        description: 'Keywords for search engine optimization',
      },
    },
  ],
  timestamps: true,
  // hooks: autoIdHook('courses'), // Temporarily disabled
}
