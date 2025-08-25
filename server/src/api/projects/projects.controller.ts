// path: server/src/api/projects/projects.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as projectService from './projects.service';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const projects = await projectService.findProjectsByUser(userId);
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { title, description } = req.body;
    const project = await projectService.createNewProject(title, description, userId);
    res.status(201).json(project);
  } catch (error: any) {
    // Handle unique constraint violation for project title per user
    if (error.code === 'P2002' && error.meta?.target?.includes('userId_title')) {
        return res.status(409).json({ message: 'A project with this title already exists.' });
    }
    next(error);
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const project = await projectService.findProjectById(id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const project = await projectService.findProjectById(id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        
        const updatedProject = await prisma.project.update({
            where: { id },
            data: req.body
        });
        res.status(200).json(updatedProject);

    } catch (error) {
        next(error);
    }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const project = await projectService.findProjectById(id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await prisma.project.delete({ where: { id }});
        res.status(204).send(); // No Content

    } catch (error) {
        next(error);
    }
};