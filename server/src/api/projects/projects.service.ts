// path: server/src/api/projects/projects.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const findProjectsByUser = (userId: string) => {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const createNewProject = (title: string, description: string | undefined, userId: string) => {
  return prisma.project.create({
    data: { title, description, userId },
  });
};

export const findProjectById = (id: string) => {
    return prisma.project.findUnique({ where: { id } });
}