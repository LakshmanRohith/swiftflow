// path: server/src/api/tasks/tasks.validation.ts
import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    status: z.enum(['todo', 'in_progress', 'done', 'canceled']).optional(),
    priority: z.enum(['none', 'low', 'medium', 'high']).optional(),
    dueDate: z.string().datetime().optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    status: z.enum(['todo', 'in_progress', 'done', 'canceled']).optional(),
    priority: z.enum(['none', 'low', 'medium', 'high']).optional(),
    dueDate: z.string().datetime().optional().nullable(),
    position: z.number().optional(),
  }),
});