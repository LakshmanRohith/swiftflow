// path: web/src/pages/MyTasks.tsx

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, XCircle, CircleDashed } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define the types for our data
interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done' | 'canceled';
  priority: 'none' | 'low' | 'medium' | 'high';
  dueDate: string | null;
  project: {
    id: string;
    title: string;
  };
}

interface ProjectWithTasks {
    id: string;
    title: string;
    tasks: Task[];
}


// API function to fetch all projects and their tasks
const fetchAllTasks = async (): Promise<Task[]> => {
    // First, get all projects for the user
    const { data: projects } = await api.get<ProjectWithTasks[]>('/projects');
    
    // Then, fetch tasks for each project
    const allTasksPromises = projects.map(project => 
        api.get<Task[]>(`/projects/${project.id}/tasks`)
    );
    
    const tasksPerProject = await Promise.all(allTasksPromises);

    // Flatten the array of arrays into a single array of tasks
    // and add project title to each task
    const allTasks = tasksPerProject.flatMap((response, index) => 
        response.data.map(task => ({
            ...task,
            project: {
                id: projects[index].id,
                title: projects[index].title
            }
        }))
    );
    
    return allTasks;
};

const statusIcons = {
    todo: <Circle className="h-4 w-4 text-gray-500" />,
    in_progress: <CircleDashed className="h-4 w-4 text-yellow-500" />,
    done: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    canceled: <XCircle className="h-4 w-4 text-red-500" />,
};

const priorityColors = {
    none: 'bg-gray-500',
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
}

export default function MyTasks() {
  const { data: tasks, isLoading, isError, error } = useQuery<Task[], Error>({
    queryKey: ['allTasks'],
    queryFn: fetchAllTasks,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Tasks</h1>
      </div>

      <Card>
  <CardHeader>
    <CardTitle>My Tasks</CardTitle>
  </CardHeader>
  <CardContent className="p-0">
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {isLoading && <p className="p-4">Loading tasks...</p>}
      {isError && <p className="p-4 text-red-500">Failed to load tasks: {error.message}</p>}
      {tasks?.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div className="flex items-center space-x-4">
            {statusIcons[task.status]}
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{task.project.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className={`${priorityColors[task.priority]}`}>{task.priority}</Badge>
            {task.dueDate && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      ))}
      {tasks?.length === 0 && (
        <p className="p-4 text-center text-gray-500">No tasks found.</p>
      )}
    </div>
  </CardContent>
</Card>

    </div>
  );
}
