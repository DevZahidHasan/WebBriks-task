'use client';

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus, Trash2 } from 'lucide-react';
import { Column, Task } from '../../types';
import { TaskCard } from './TaskCard';
import { cn } from '../../lib/utils';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteColumn: () => void;
  canEdit: boolean;
}

export function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteColumn,
  canEdit,
}: KanbanColumnProps) {
  return (
    <div className="kanban-column flex flex-col w-80 shrink-0 bg-zinc-900/50 border border-zinc-800/80 rounded-xl overflow-hidden max-h-[calc(100vh-12rem)] shadow-sm">
      {/* Column Header */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-zinc-800/80 bg-zinc-900/70">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            {column.title}
          </h3>
          <span className="text-[11px] font-mono text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>

        {canEdit && (
          <div className="flex items-center gap-1">
            <button
              onClick={onAddTask}
              title="Add task"
              className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDeleteColumn}
              title="Delete column"
              className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Droppable Task List */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 overflow-y-auto p-2.5 flex flex-col gap-2 transition-colors min-h-[140px]',
              snapshot.isDraggingOver && 'bg-zinc-850/50 border-zinc-700/50',
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={() => onEditTask(task)}
              />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-zinc-800/60 rounded-lg my-auto">
                <span className="text-[11px] text-zinc-500">No tasks</span>
                {canEdit && (
                  <button
                    onClick={onAddTask}
                    className="text-xs text-zinc-400 hover:text-zinc-200 mt-1.5 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3" /> Add a card
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Quick Add Footer */}
      {canEdit && tasks.length > 0 && (
        <div className="p-2 border-t border-zinc-800/50 bg-zinc-900/30">
          <button
            onClick={onAddTask}
            className="w-full py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add task
          </button>
        </div>
      )}
    </div>
  );
}
