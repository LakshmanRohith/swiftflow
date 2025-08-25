// path: web/src/pages/Dashboard.tsx

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Project, Task } from '@/types';
import { Input } from '@/components/ui/input';

// Combined fetch function for all necessary data
const fetchDashboardData = async (): Promise<{ projects: Project[], tasks: Task[] }> => {
    const { data: projects } = await api.get('/projects');
    const taskPromises = projects.map((p: Project) => api.get(`/projects/${p.id}/tasks`));
    const taskResponses = await Promise.all(taskPromises);
    const tasks = taskResponses.flatMap(res => res.data);
    return { projects, tasks };
};

export default function Dashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboardData'], 
    queryFn: fetchDashboardData
  });

  // Calculate KPIs based on fetched tasks
  const kpis = useMemo(() => {
    if (!data?.tasks) return { open: 0, dueToday: 0, overdue: 0, completedThisWeek: 0 };
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    return {
        open: data.tasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length,
        dueToday: data.tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === today.toDateString()).length,
        overdue: data.tasks.filter(t => t.dueDate && new Date(t.dueDate) < today && t.status !== 'done').length,
        completedThisWeek: 0, // This would require a 'completedAt' field on the task
    };
  }, [data?.tasks]);

  // Filter projects based on the search term
  const filteredProjects = useMemo(() => {
    if (!data?.projects) return [];
    return data.projects.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.projects, searchTerm]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Good afternoon, {user?.name}!</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Ready to tackle your tasks and manage your projects</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card><CardHeader><CardTitle>My Open Tasks</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{isLoading ? '...' : kpis.open}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Due Today</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{isLoading ? '...' : kpis.dueToday}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Overdue</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{isLoading ? '...' : kpis.overdue}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Completed This Week</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{isLoading ? '...' : kpis.completedThisWeek}</p></CardContent></Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Recent Projects</h2>
        <Input 
            placeholder="Search projects..." 
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isLoading && <p>Loading projects...</p>}
      {isError && <p className="text-red-500">Failed to load data: {error.message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.slice(0, 6).map((project) => (
          <Link to={`/projects/${project.id}`} key={project.id}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader><CardTitle>{project.title}</CardTitle></CardHeader>
              <CardContent><p className="text-gray-600 dark:text-gray-400 truncate">{project.description}</p></CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {filteredProjects.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 mt-8">No projects found.</p>
      )}
    </div>
  );
}
