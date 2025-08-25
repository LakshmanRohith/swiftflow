
// path: server/src/api/projects/projects.routes.ts
import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import { createProjectSchema, updateProjectSchema } from './projects.validation';
import { getAllProjects, createProject, getProjectById, updateProject, deleteProject } from './projects.controller';
// --- FIX: Use a named import for projectTaskRoutes ---
import { projectTaskRoutes } from '../tasks/tasks.routes';

const router = Router();

// All project routes are protected
router.use(requireAuth);

router.route('/')
    .get(getAllProjects)
    .post(validate(createProjectSchema), createProject);

router.route('/:id')
    .get(getProjectById)
    .put(validate(updateProjectSchema), updateProject)
    .delete(deleteProject);

// Nest task routes under projects
// This will make our task routes look like /api/projects/:projectId/tasks
// --- FIX: Use the imported named route ---
router.use('/:projectId/tasks', projectTaskRoutes);

export default router;
