// path: web/src/types/index.ts

// These types must match the enums in your server's prisma/schema.prisma

export type Status = 'todo' | 'in_progress' | 'done' | 'canceled';

export type Priority = 'none' | 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  position: number;
  dueDate: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
}
