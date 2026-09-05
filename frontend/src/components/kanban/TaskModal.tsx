'use client';

import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { BoardMember, Task, TaskPriority } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  columnId: string;
  boardMembers: BoardMember[];
  onSave: (data: {
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate?: string | null;
    assigneeId?: string | null;
  }) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  canEdit: boolean;
}

export function TaskModal({
  isOpen,
  onClose,
  task,
  boardMembers,
  onSave,
  onDelete,
  canEdit,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setAssigneeId(task.assigneeId || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setDueDate('');
      setAssigneeId('');
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        assigneeId: assigneeId || null,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!task || !onDelete) return;
    if (confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
        onClose();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Task Details' : 'Create New Task'}
      description={task ? 'Inspect or update workflow task specifications.' : 'Add a task card to this column.'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <Input
          label="Title"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!canEdit}
          required
          autoFocus
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-300">Description</label>
          <textarea
            className="w-full bg-zinc-900 text-zinc-100 text-sm px-3 py-2 rounded-md border border-zinc-800 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-500 transition-colors min-h-[90px] disabled:opacity-50"
            placeholder="Add detailed task notes or acceptance criteria..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!canEdit}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Priority */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-300">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              disabled={!canEdit}
              className="bg-zinc-900 text-zinc-100 text-sm px-3 py-2 rounded-md border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-300">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={!canEdit}
              className="bg-zinc-900 text-zinc-100 text-sm px-3 py-2 rounded-md border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors"
            />
          </div>
        </div>

        {/* Assignee */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-300">Assignee</label>
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            disabled={!canEdit}
            className="bg-zinc-900 text-zinc-100 text-sm px-3 py-2 rounded-md border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors"
          >
            <option value="">Unassigned</option>
            {boardMembers.map((member) => (
              <option key={member.id} value={member.user.id}>
                {member.user.name} ({member.user.email}) - {member.role}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-850 mt-2">
          {task && canEdit && onDelete ? (
            <Button
              type="button"
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Task
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {canEdit && (
              <Button type="submit" isLoading={isSubmitting}>
                {task ? 'Save Changes' : 'Create Task'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
