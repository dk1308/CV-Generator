import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cv = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/cv' }),
  schema: z.object({
    // Identity & contact
    name: z.string(),
    function: z.string(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    location: z.string().optional(),

    // Legacy fields (kept for backward compat, not rendered in new layout)
    date_of_birth: z.string().optional(),
    nationality: z.string().optional(),
    languages: z.array(z.string()).default([]),
    experience_since: z.number().optional(),
    highest_education: z.string().optional(),
    hobbies: z.array(z.string()).default([]),

    // Objective / Summary
    summary: z.string().default(''),

    // Education
    education: z
      .array(
        z.object({
          institution: z.string(),
          period: z.string(),
          degree: z.string(),
          gpa: z.string().optional(),
        })
      )
      .default([]),

    // Skills (simple list for MyCv2 layout)
    skills: z
      .array(
        z.union([
          z.object({ name: z.string(), level: z.number().int().min(1).max(3) }),
          z.string(),
        ])
      )
      .default([]),

    // Experience (detailed project blocks)
    recent_projects: z
      .array(
        z.object({
          period: z.string(),
          customer: z.string(),
          function: z.string(),
          description: z.string().optional(),
          activities: z.array(z.string()).default([]),
          technologies: z.array(z.string()).default([]),
        })
      )
      .default([]),

    // Additional projects (compact)
    additional_projects: z
      .array(
        z.object({
          period: z.string(),
          customer: z.string(),
          function: z.string(),
          description: z.string().optional(),
          technologies: z.array(z.string()).default([]),
        })
      )
      .default([]),

    // Certificates
    certificates: z
      .array(
        z.object({
          name: z.string(),
          period: z.string().optional(),
        })
      )
      .default([]),

    // Courses (legacy)
    courses: z
      .array(
        z.object({
          year: z.union([z.string(), z.number()]),
          name: z.string(),
        })
      )
      .default([]),
  }),
});

export const collections = { cv };
