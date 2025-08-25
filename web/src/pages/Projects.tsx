// path: web/src/pages/Projects.tsx

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom'; // Import Link

// Define the type for a project
interface Project {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
}

const fetchProjects = async (): Promise<Project[]> => {
    const { data } = await api.get('/projects');
    return data;
};

const createProjectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
});
type CreateProjectFormValues = z.infer<typeof createProjectSchema>;


export default function Projects() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: projects, isLoading, isError, error } = useQuery<Project[], Error>({
    queryKey: ['projects'], 
    queryFn: fetchProjects
  });

  const mutation = useMutation({
    mutationFn: (newProject: CreateProjectFormValues) => api.post('/projects', newProject),
    onSuccess: () => {
      toast.success('Project created successfully!');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: AxiosError<{ message: string }>) => {
        const errorMessage = error.response?.data?.message || "Failed to create project.";
        toast.error(errorMessage);
    }
  });

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { title: '', description: '' },
  });

  const onSubmit = (data: CreateProjectFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new project</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new project.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl><Input placeholder="e.g. Website Redesign" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl><Input placeholder="e.g. A project to overhaul the company website" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Creating...' : 'Create Project'}
                    </Button>
                </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <p>Loading projects...</p>}
      {isError && <p className="text-red-500">Failed to load projects: {error.message}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Link to={`/projects/${project.id}`} key={project.id}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{new Date(project.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
