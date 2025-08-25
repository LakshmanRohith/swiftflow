// // path: web/src/pages/ProjectDetail.tsx

// import { useParams } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import api from '@/lib/api';
// import KanbanBoard from '@/components/projects/KanbanBoard';

// // Define types
// interface Project {
//   id: string;
//   title: string;
//   description: string | null;
// }

// const fetchProjectDetails = async (projectId: string): Promise<Project> => {
//   const { data } = await api.get(`/projects/${projectId}`);
//   return data;
// };


// export default function ProjectDetail() {
//   const { projectId } = useParams<{ projectId: string }>();

//   if (!projectId) {
//     return <div>Invalid Project ID</div>;
//   }

//   const { data: project, isLoading, isError, error } = useQuery<Project, Error>({
//     queryKey: ['project', projectId],
//     queryFn: () => fetchProjectDetails(projectId),
//   });

//   if (isLoading) return <div>Loading project...</div>;
//   if (isError) return <div>Error loading project: {error.message}</div>;

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-2">{project?.title}</h1>
//       <p className="text-gray-500 dark:text-gray-400 mb-8">{project?.description}</p>
      
//       {/* We will render the Kanban board here */}
//       <KanbanBoard projectId={projectId} />
//     </div>
//   );
// }





// path: web/src/pages/ProjectDetail.tsx

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import KanbanBoard from '@/components/projects/KanbanBoard';

// Define types
interface Project {
  id: string;
  title: string;
  description: string | null;
}

const fetchProjectDetails = async (projectId: string): Promise<Project> => {
  const { data } = await api.get(`/projects/${projectId}`);
  return data;
};

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery<Project, Error>({
    queryKey: ['project', projectId],
    queryFn: () => fetchProjectDetails(projectId!),
    enabled: !!projectId, // ✅ Only fetch if projectId exists
  });

  if (!projectId) {
    return <div>Invalid Project ID</div>;
  }

  if (isLoading) return <div>Loading project...</div>;
  if (isError) return <div>Error loading project: {error.message}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{project?.title}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">{project?.description}</p>

      {/* Kanban board */}
      <KanbanBoard projectId={projectId} />
    </div>
  );
}
