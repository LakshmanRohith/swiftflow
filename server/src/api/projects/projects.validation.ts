// path: server/src/api/projects/projects.validation.ts
import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid project ID'),
  }),
});