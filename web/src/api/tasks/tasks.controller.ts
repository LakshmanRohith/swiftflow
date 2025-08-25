// // path: server/src/api/tasks/tasks.controller.ts

// import { Request, Response, NextFunction } from 'express';
// import { PrismaClient, Prisma } from '@prisma/client'; // Import Prisma for its error types
// const prisma = new PrismaClient();

// // GET /api/projects/:projectId/tasks
// export const getAllTasksForProject = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { projectId } = req.params;
//         const userId = req.user?.id;
        
//         if (!userId) {
//             return res.status(401).json({ message: 'Not authenticated' });
//         }

//         const project = await prisma.project.findFirst({
//             where: { id: projectId, userId: userId }
//         });

//         if (!project) {
//             return res.status(404).json({ message: 'Project not found or access denied' });
//         }

//         const tasks = await prisma.task.findMany({
//             where: { projectId },
//             orderBy: { position: 'asc' }
//         });
//         res.status(200).json(tasks);
//     } catch (error) {
//         next(error);
//     }
// };

// // POST /api/projects/:projectId/tasks
// export const createTask = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { projectId } = req.params;
//         const userId = req.user?.id;

//         if (!userId) {
//             return res.status(401).json({ message: 'Not authenticated' });
//         }
        
//         const project = await prisma.project.findFirst({
//             where: { id: projectId, userId: userId }
//         });

//         if (!project) {
//             return res.status(404).json({ message: 'Project not found or access denied' });
//         }
        
//         const maxPosition = await prisma.task.aggregate({
//             _max: { position: true },
//             where: { projectId },
//         });
//         const newPosition = (maxPosition._max.position ?? 0) + 1;

//         const task = await prisma.task.create({
//             data: {
//                 ...req.body,
//                 projectId,
//                 position: newPosition
//             }
//         });
//         res.status(201).json(task);
//     } catch (error: unknown) { // FIX: Use 'unknown' instead of 'any'
//         // Check if the error is a known Prisma error for unique constraint violation
//         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
//             return res.status(409).json({ message: 'A task with this title already exists in this project.' });
//         }
//         // Pass other errors to the global error handler
//         next(error);
//     }
// };

// // PUT /api/tasks/:id
// export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const userId = req.user?.id;
//         const { status, position, ...restData } = req.body;

//         if (!userId) {
//             return res.status(401).json({ message: 'Not authenticated' });
//         }

//         const task = await prisma.task.findUnique({
//             where: { id },
//             include: { project: true }
//         });

//         if (!task) {
//             return res.status(404).json({ message: 'Task not found' });
//         }
//         if (task.project.userId !== userId) {
//             return res.status(403).json({ message: 'Forbidden' });
//         }

//         // If only the status is changing (drag-and-drop)
//         if (status && status !== task.status) {
//             const maxPosition = await prisma.task.aggregate({
//                 _max: { position: true },
//                 where: { projectId: task.projectId, status: status },
//             });
//             const newPosition = (maxPosition._max.position ?? 0) + 1;

//             const updatedTask = await prisma.task.update({
//                 where: { id },
//                 data: { ...restData, status, position: newPosition }
//             });
//             return res.status(200).json(updatedTask);
//         }

//         // For all other updates
//         const updatedTask = await prisma.task.update({
//             where: { id },
//             data: req.body
//         });
//         res.status(200).json(updatedTask);
//     } catch (error) {
//         next(error);
//     }
// };

// // DELETE /api/tasks/:id
// export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const userId = req.user?.id;

//         if (!userId) {
//             return res.status(401).json({ message: 'Not authenticated' });
//         }

//         const task = await prisma.task.findUnique({
//             where: { id },
//             include: { project: true }
//         });

//         if (!task) {
//             return res.status(404).json({ message: 'Task not found' });
//         }
//         if (task.project.userId !== userId) {
//             return res.status(403).json({ message: 'Forbidden' });
//         }

//         await prisma.task.delete({ where: { id }});
//         res.status(204).send();
//     } catch (error) {
//         next(error);
//     }
// };
// path: server/src/api/tasks/tasks.controller.ts

// import { Request, Response, NextFunction } from 'express';
// import { PrismaClient, Prisma } from '@prisma/client';

// const prisma = new PrismaClient();

// // GET /api/projects/:projectId/tasks
// export const getAllTasksForProject = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { projectId } = req.params;
//         const userId = req.user?.id;
        
//         if (!userId) {
//             return res.status(401).json({ message: 'Not authenticated' });
//         }

//         const project = await prisma.project.findFirst({
//             where: { id: projectId, userId: userId }
//         });

//         if (!project) {
//             return res.status(404).json({ message: 'Project not found or access denied' });
//         }

//         const tasks = await prisma.task.findMany({
//             where: { projectId },
//             orderBy: { position: 'asc' }
//         });
//         res.status(200).json(tasks);
//     } catch (error) {
//         next(error);
//     }
// };

// // POST /api/projects/:projectId/tasks
// export const createTask = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { projectId } = req.params;
//         const userId = req.user?.id;

//         if (!userId) {
//             return res.status(401).json({ message: 'Not authenticated' });
//         }
        
//         const project = await prisma.project.findFirst({
//             where: { id: projectId, userId: userId }
//         });

//         if (!project) {
//             return res.status(404).json({ message: 'Project not found or access denied' });
//         }
        
//         const maxPosition = await prisma.task.aggregate({
//             _max: { position: true },
//             where: { projectId },
//         });
//         const newPosition = (maxPosition._max.position ?? 0) + 1;

//         const task = await prisma.task.create({
//             data: {
//                 ...req.body,
//                 projectId,
//                 position: newPosition
//             }
//         });
//         res.status(201).json(task);
//     } catch (error: unknown) {
//         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
//             return res.status(409).json({ message: 'A task with this title already exists in this project.' });
//         }
//         next(error);
//     }
// };

// // PUT /api/tasks/:id
// export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const userId = req.user?.id;
//         const { status, position, ...restData } = req.body;

//         if (!userId) {
//             return res.status(401).json({ message: 'Not authenticated' });
//         }

//         const task = await prisma.task.findUnique({
//             where: { id },
//             include: { project: true }
//         });

//         if (!task) {
//             return res.status(404).json({ message: 'Task not found' });
//         }
//         if (task.project.userId !== userId) {
//             return res.status(403).json({ message: 'Forbidden' });
//         }

//         // If only the status is changing (drag-and-drop)
//         if (status && status !== task.status) {
//             const maxPosition = await prisma.task.aggregate({
//                 _max: { position: true },
//                 where: { projectId: task.projectId, status: status },
//             });
//             const newPosition = (maxPosition._max.position ?? 0) + 1;

//             const updatedTask = await prisma.task.update({
//                 where: { id },
//                 data: { ...restData, status, position: newPosition }
//             });
//             return res.status(200).json(updatedTask);
//         }

//         // For all other updates
//         const updatedTask = await prisma.task.update({
//             where: { id },
//             data: req.body
//         });
//         res.status(200).json(updatedTask);
//     } catch (error) {
//         next(error);
//     }
// };

// // DELETE /api/tasks/:id
// export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const userId = req.user?.id;

//         if (!userId) {
//             return res.status(401).json({ message: 'Not authenticated' });
//         }

//         const task = await prisma.task.findUnique({
//             where: { id },
//             include: { project: true }
//         });

//         if (!task) {
//             return res.status(404).json({ message: 'Task not found' });
//         }
//         if (task.project.userId !== userId) {
//             return res.status(403).json({ message: 'Forbidden' });
//         }

//         await prisma.task.delete({ where: { id }});
//         res.status(204).send();
//     } catch (error) {
//         next(error);
//     }
// };
// path: server/src/api/tasks/tasks.controller.ts

import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

// GET /api/projects/:projectId/tasks
export const getAllTasksForProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

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
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        
        const project = await prisma.project.findFirst({
            where: { id: projectId, userId: userId }
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found or access denied' });
        }
        
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
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ message: 'A task with this title already exists in this project.' });
        }
        next(error);
    }
};

// PUT /api/tasks/:id
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        // FIX: Removed unused 'position' variable from destructuring
        const { status, ...restData } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

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

        if (status && status !== task.status) {
            const maxPosition = await prisma.task.aggregate({
                _max: { position: true },
                where: { projectId: task.projectId, status: status },
            });
            const newPosition = (maxPosition._max.position ?? 0) + 1;

            const updatedTask = await prisma.task.update({
                where: { id },
                data: { ...restData, status, position: newPosition }
            });
            return res.status(200).json(updatedTask);
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
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

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

