// // path: web/src/components/projects/TaskCard.tsx

// import { useState } from 'react';
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { Card, CardContent } from '@/components/ui/card';
// import { Task } from '@/types'; // Corrected import: Removed unused 'Status'
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
// import { Button } from '@/components/ui/button';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import api from '@/lib/api';
// import { toast } from 'sonner';
// import { AxiosError } from 'axios';
// import { Trash2 } from 'lucide-react';

// const editTaskSchema = z.object({
//     title: z.string().min(1, 'Title is required'),
//     description: z.string().optional(),
//     status: z.enum(['todo', 'in_progress', 'done', 'canceled']),
// });
// type EditTaskFormValues = z.infer<typeof editTaskSchema>;

// export default function TaskCard({ task }: { task: Task }) {
//   const queryClient = useQueryClient();
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: task.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//   };

//   const form = useForm<EditTaskFormValues>({
//     resolver: zodResolver(editTaskSchema),
//     defaultValues: {
//         title: task.title,
//         description: task.description || '',
//         status: task.status,
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: (updatedTask: EditTaskFormValues) => api.put(`/tasks/${task.id}`, updatedTask),
//     onSuccess: () => {
//         toast.success("Task updated successfully!");
//         queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Invalidate all task queries
//         setIsEditDialogOpen(false);
//     },
//     onError: (error: AxiosError<{ message: string }>) => {
//         toast.error(error.response?.data?.message || 'Failed to update task.');
//     }
//   });

//   const deleteMutation = useMutation({
//     mutationFn: () => api.delete(`/tasks/${task.id}`),
//     onSuccess: () => {
//         toast.success("Task deleted successfully!");
//         queryClient.invalidateQueries({ queryKey: ['tasks'] });
//     },
//     onError: (error: AxiosError<{ message: string }>) => {
//         toast.error(error.response?.data?.message || 'Failed to delete task.');
//     }
//   });

//   const onSubmit = (data: EditTaskFormValues) => {
//     updateMutation.mutate(data);
//   };

//   return (
//     <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogTrigger asChild>
//             <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//             <Card className="hover:shadow-md cursor-grab active:cursor-grabbing bg-white dark:bg-gray-900">
//                 <CardContent className="p-4">
//                 <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.title}</p>
//                 </CardContent>
//             </Card>
//             </div>
//         </DialogTrigger>
//         <DialogContent>
//             <DialogHeader>
//                 <DialogTitle>Edit Task</DialogTitle>
//             </DialogHeader>
//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                     <FormField control={form.control} name="title" render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Title</FormLabel>
//                             <FormControl><Input {...field} /></FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )} />
//                     <FormField control={form.control} name="description" render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Description</FormLabel>
//                             <FormControl><Textarea {...field} /></FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )} />
//                     <FormField control={form.control} name="status" render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Status</FormLabel>
//                             <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                 <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                                 <SelectContent>
//                                     <SelectItem value="todo">To Do</SelectItem>
//                                     <SelectItem value="in_progress">In Progress</SelectItem>
//                                     <SelectItem value="done">Done</SelectItem>
//                                     <SelectItem value="canceled">Canceled</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                             <FormMessage />
//                         </FormItem>
//                     )} />
//                     <div className="flex justify-between items-center">
//                         <Button type="submit" disabled={updateMutation.isPending}>
//                             {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
//                         </Button>
//                         <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                                 <Button variant="destructive" size="icon" type="button">
//                                     <Trash2 className="h-4 w-4" />
//                                 </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                                 <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
//                                 <AlertDialogDescription>
//                                     This action cannot be undone. This will permanently delete the task.
//                                 </AlertDialogDescription>
//                                 <AlertDialogFooter>
//                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                     <AlertDialogAction onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
//                                         {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
//                                     </AlertDialogAction>
//                                 </AlertDialogFooter>
//                             </AlertDialogContent>
//                         </AlertDialog>
//                     </div>
//                 </form>
//             </Form>
//         </DialogContent>
//     </Dialog>
//   );
// }


// path: web/src/components/projects/TaskCard.tsx

// path: web/src/components/projects/TaskCard.tsx
// path: web/src/components/projects/TaskCard.tsx

// path: web/src/components/projects/TaskCard.tsx

// path: web/src/components/projects/TaskCard.tsx

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Task } from '@/types';
// FIX: Import DialogTrigger
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
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
// FIX: Removed unused AxiosError import
import { Trash2, GripVertical } from 'lucide-react';

const editTaskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    status: z.enum(['todo', 'in_progress', 'done', 'canceled']),
});
type EditTaskFormValues = z.infer<typeof editTaskSchema>;

export default function TaskCard({ task, projectId }: { task: Task, projectId: string }) {
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const form = useForm<EditTaskFormValues>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
        title: task.title,
        description: task.description || '',
        status: task.status,
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/tasks/${task.id}`),
    onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks', projectId]);
        queryClient.setQueryData<Task[]>(['tasks', projectId], (old) => old?.filter((t) => t.id !== task.id));
        return { previousTasks };
    },
    // FIX: Prefix unused variables with an underscore
    onError: (_err, _variables, context) => {
        toast.error('Failed to delete task. Reverting.');
        if (context?.previousTasks) {
            queryClient.setQueryData(['tasks', projectId], context.previousTasks);
        }
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedTask: EditTaskFormValues) => api.put(`/tasks/${task.id}`, updatedTask),
    onSuccess: () => {
        toast.success("Task updated successfully!");
        setIsEditDialogOpen(false);
    },
    onMutate: async (updatedTask) => {
        await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks', projectId]);
        queryClient.setQueryData<Task[]>(['tasks', projectId], (old) =>
            old?.map((t) => (t.id === task.id ? { ...t, ...updatedTask } : t))
        );
        return { previousTasks };
    },
    // FIX: Prefix unused variables with an underscore
    onError: (_err, _variables, context) => {
        toast.error('Failed to update task. Reverting.');
        if (context?.previousTasks) {
            queryClient.setQueryData(['tasks', projectId], context.previousTasks);
        }
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  const onSubmit = (data: EditTaskFormValues) => {
    updateMutation.mutate(data);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
          <CardContent className="p-3 flex items-center justify-between">
            <DialogTrigger asChild>
                <div className="flex-grow cursor-pointer pr-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.title}</p>
                </div>
            </DialogTrigger>
            <div className="flex items-center space-x-1">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogDescription>This action is permanent and cannot be undone.</AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate()}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <div {...listeners} className="cursor-grab p-1">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                </div>
            </div>
          </CardContent>
        </Card>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>
                    Make changes to your task. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="status" render={({ field }) => ( <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="todo">To Do</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="done">Done</SelectItem><SelectItem value="canceled">Canceled</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                    <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
