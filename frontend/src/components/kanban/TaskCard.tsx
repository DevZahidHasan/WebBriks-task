'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, User as UserIcon } from 'lucide-react';
import { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: () => void;
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  const isOverdue = task.dueDate ? new Date(task.dueDate) < new Date() : false;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={cn(
            'group relative flex flex-col gap-2.5 p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-150 cursor-grab active:cursor-grabbing select-none',
            snapshot.isDragging
              ? 'rotate-[1.5deg] scale-[1.02] shadow-2xl border-zinc-500 z-50 bg-zinc-850'
              : 'hover:shadow-md hover:-translate-y-0.5',
          )}
        >
          {/* Priority & Status */}
          <div className="flex items-center justify-between gap-2">
            <Badge priority={task.priority} />
          </div>

          {/* Title & Description */}
          <div>
            <h4 className="text-xs sm:text-sm font-medium text-zinc-100 group-hover:text-white line-clamp-2 leading-snug">
              {task.title}
            </h4>
            {task.description && (
              <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          {/* Footer: Due date & Assignee */}
          <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-500 font-mono border-t border-zinc-850">
            {task.dueDate ? (
              <span className={cn('flex items-center gap-1', isOverdue ? 'text-red-400 font-medium' : 'text-zinc-400')}>
                <Calendar className="w-3 h-3" />
                {formatDate(task.dueDate)}
              </span>
            ) : (
              <span />
            )}

            {task.assignee ? (
              <div
                title={`Assigned to ${task.assignee.name} (${task.assignee.email})`}
                className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-200 font-semibold"
              >
                {task.assignee.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <span className="text-zinc-600 flex items-center gap-1">
                <UserIcon className="w-3 h-3" />
                Unassigned
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
