// path: web/src/components/projects/KanbanColumn.tsx

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard'; 
import { Status, Task } from '@/types';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  projectId: string;
}

export default function KanbanColumn({ status, tasks, projectId }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });

  const statusTitles: Record<Status, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
    canceled: 'Canceled',
  };

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col"
    >
      <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">{statusTitles[status]} ({tasks.length})</h3>
      <div className="space-y-4 flex-grow">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} projectId={projectId} />
            ))}
        </SortableContext>
      </div>
    </div>
  );
}
