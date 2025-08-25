// path: web/src/components/projects/KanbanBoard.tsx

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { DndContext, closestCorners, DragEndEvent } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import { Status, Task } from '@/types';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const fetchTasks = async (projectId: string): Promise<Task[]> => {
  const { data } = await api.get(`/projects/${projectId}/tasks`);
  return data;
};

const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
});
type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

export default function KanbanBoard({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Status | 'all'>('all');

  const { data: fetchedTasks, isLoading } = useQuery<Task[], Error>({
    queryKey: ['tasks', projectId],
    queryFn: () => fetchTasks(projectId),
  });

  useEffect(() => {
    if (fetchedTasks) {
      const sortedTasks = [...fetchedTasks].sort((a, b) => a.position - b.position);
      setTasks(sortedTasks);
    }
  }, [fetchedTasks]);

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, changes }: { taskId: string; changes: Partial<Task> }) =>
      api.put(`/tasks/${taskId}`, changes),
    onError: (error: AxiosError) => {
        console.error("Failed to update task", error);
        toast.error("Failed to move task. Reverting.");
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: (newTask: CreateTaskFormValues) => api.post(`/projects/${projectId}/tasks`, newTask),
    onSuccess: () => {
        toast.success('Task created successfully!');
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
        setIsDialogOpen(false);
        form.reset();
    },
    onError: (error: AxiosError<{ message: string }>) => {
        toast.error(error.response?.data?.message || 'Failed to create task.');
    }
  });

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: '', description: '' },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find(t => t.id === active.id);
    const overContainer = over.id as Status;

    if (activeTask && activeTask.status !== overContainer) {
        const newTasks = tasks.map(t => 
            t.id === active.id ? { ...t, status: overContainer } : t
        );
        setTasks(newTasks);

        updateTaskMutation.mutate({
            taskId: active.id as string,
            changes: { status: overContainer },
        });
    }
  };

  const onSubmit = (data: CreateTaskFormValues) => {
    createTaskMutation.mutate(data);
  };

  if (isLoading) return <div>Loading tasks...</div>;

  const allColumns: Status[] = ['todo', 'in_progress', 'done', 'canceled'];
  const filteredColumns = activeFilter === 'all' ? allColumns : [activeFilter];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
            <Button variant={activeFilter === 'all' ? 'secondary' : 'ghost'} onClick={() => setActiveFilter('all')}>All</Button>
            <Button variant={activeFilter === 'todo' ? 'secondary' : 'ghost'} onClick={() => setActiveFilter('todo')}>To Do</Button>
            <Button variant={activeFilter === 'in_progress' ? 'secondary' : 'ghost'} onClick={() => setActiveFilter('in_progress')}>In Progress</Button>
            <Button variant={activeFilter === 'done' ? 'secondary' : 'ghost'} onClick={() => setActiveFilter('done')}>Done</Button>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-2" />New Task</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new task</DialogTitle>
                    <DialogDescription>
                        Fill in the details for your new task.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <Button type="submit" disabled={createTaskMutation.isPending}>
                            {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
      </div>
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <div className={`grid gap-6 ${activeFilter === 'all' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredColumns.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasks.filter((task) => task.status === status)}
              // FIX: Pass the projectId prop down to the KanbanColumn
              projectId={projectId}
            />
          ))}
        </div>
      </DndContext>
    </>
  );
}
