// path: web/src/components/tasks/TaskListItem.tsx

import { useState } from 'react';
import { Task } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const editTaskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    status: z.enum(['todo', 'in_progress', 'done', 'canceled']),
});
type EditTaskFormValues = z.infer<typeof editTaskSchema>;

// Extend the Task type to include the project object, which our API function provides
interface TaskWithProject extends Task {
    project: {
        id: string;
        title: string;
    };
}

const priorityColors: Record<Task['priority'], string> = {
    none: 'bg-gray-400 hover:bg-gray-400',
    low: 'bg-blue-500 hover:bg-blue-500',
    medium: 'bg-yellow-500 hover:bg-yellow-500',
    high: 'bg-red-500 hover:bg-red-500',
}

export default function TaskListItem({ task }: { task: TaskWithProject }) {
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<EditTaskFormValues>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
        title: task.title,
        description: task.description || '',
        status: task.status,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedTask: EditTaskFormValues) => api.put(`/tasks/${task.id}`, updatedTask),
    onSuccess: () => {
        toast.success("Task updated successfully!");
        queryClient.invalidateQueries({ queryKey: ['allTasks'] });
        setIsEditDialogOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
        toast.error(error.response?.data?.message || 'Failed to update task.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/tasks/${task.id}`),
    onSuccess: () => {
        toast.success("Task deleted successfully!");
        // FIX: Invalidate the correct query key for the "My Tasks" page
        queryClient.invalidateQueries({ queryKey: ['allTasks'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
        toast.error(error.response?.data?.message || 'Failed to delete task.');
    }
  });

  const onSubmit = (data: EditTaskFormValues) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{task.title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{task.project.title}</p>
      </div>
      <div className="flex items-center space-x-4 ml-4">
        <Badge className={`${priorityColors[task.priority]}`}>{task.priority}</Badge>
        {task.dueDate && (
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                {new Date(task.dueDate).toLocaleDateString()}
            </p>
        )}
        {/* FIX: Make the Edit and Delete buttons always visible */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Form content is the same as in TaskCard */}
                        <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="status" render={({ field }) => ( <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="todo">To Do</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="done">Done</SelectItem><SelectItem value="canceled">Canceled</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                        <Button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                <AlertDialogDescription>This action cannot be undone. This will permanently delete the task.</AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? 'Deleting...' : 'Delete'}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
