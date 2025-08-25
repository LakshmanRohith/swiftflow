// path: server/src/api/tasks/tasks.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET /api/projects/:projectId/tasks
export const getAllTasksForProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.params;
        const userId = req.user!.id;
        
        // Verify user has access to this project
        const project = await prisma.project.findFirst({
            where: { id: projectId, userId: userId }
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found or access denied' });
        }

        const tasks = await prisma.task.findMany({
            where: { projectId },
            orderBy: { position: 'asc' }
        });
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

// POST /api/projects/:projectId/tasks
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.params;
        const userId = req.user!.id;
        
        const project = await prisma.project.findFirst({
            where: { id: projectId, userId: userId }
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found or access denied' });
        }
        
        // Get the highest position for the new task
        const maxPosition = await prisma.task.aggregate({
            _max: { position: true },
            where: { projectId },
        });
        const newPosition = (maxPosition._max.position ?? 0) + 1;

        const task = await prisma.task.create({
            data: {
                ...req.body,
                projectId,
                position: newPosition
            }
        });
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

// PUT /api/tasks/:id
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const task = await prisma.task.findUnique({
            where: { id },
            include: { project: true }
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.project.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: req.body
        });
        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const task = await prisma.task.findUnique({
            where: { id },
            include: { project: true }
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.project.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await prisma.task.delete({ where: { id }});
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};