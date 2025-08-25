// path: server/src/api/tasks/tasks.routes.ts
import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { createTaskSchema, updateTaskSchema } from './tasks.validation';
import { getAllTasksForProject, createTask, updateTask, deleteTask } from './tasks.controller';

// Note: We need mergeParams: true because the projectId is coming from the parent router (projects.routes)
const router = Router({ mergeParams: true });

// These routes are already protected by requireAuth in projects.routes.ts

router.route('/')
    .get(getAllTasksForProject)
    .post(validate(createTaskSchema), createTask);

// These routes need to be separate because they don't depend on projectId in the URL
// We will create a separate top-level router for them in index.ts
// For now, let's define them here and mount them separately
const taskRouter = Router();
taskRouter.put('/:id', validate(updateTaskSchema), updateTask);
taskRouter.delete('/:id', deleteTask);

// We need to export both routers
export { router as projectTaskRoutes, taskRouter };
