// path: web/src/components/projects/NewProjectDialog.tsx

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
// The unused 'Plus' import has been removed to fix the error.

const createProjectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
});
type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

// This component can be triggered by any button
export default function NewProjectDialog({ triggerButton }: { triggerButton: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { title: '', description: '' },
  });

  const mutation = useMutation({
    mutationFn: (newProject: CreateProjectFormValues) => api.post('/projects', newProject),
    onSuccess: () => {
      toast.success('Project created successfully!');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsOpen(false);
      form.reset();
    },
    onError: (error: AxiosError<{ message: string }>) => {
        const errorMessage = error.response?.data?.message || "Failed to create project.";
        toast.error(errorMessage);
    }
  });

  const onSubmit = (data: CreateProjectFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>
            Fill in the details below to get started.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g. Marketing Campaign" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="e.g. A project to launch the new product" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Creating...' : 'Create Project'}
                </Button>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
