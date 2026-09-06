'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import { Board, Column, Task, TaskPriority, AppError } from '../../../types';
import { BoardHeader } from '../../../components/kanban/BoardHeader';
import { KanbanColumn } from '../../../components/kanban/KanbanColumn';
import { TaskModal } from '../../../components/kanban/TaskModal';
import { ShareBoardModal } from '../../../components/kanban/ShareBoardModal';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import gsap from 'gsap';
import { MOTION } from '../../../lib/motion';

export default function BoardViewPage() {
  const { id: boardId } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  // Task Modal state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string>('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const fetchBoard = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getBoard(boardId);
      setBoard(data);
      setColumns(data.columns || []);
    } catch (err: unknown) {
      const appErr = err as AppError;
      toast.error(appErr.message || 'Failed to load board');
      router.push('/boards');
    } finally {
      setIsLoading(false);
    }
  }, [boardId, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && boardId) {
      fetchBoard();
    }
  }, [user, authLoading, boardId, fetchBoard, router]);

  // Animate Kanban columns into view with a smooth staggered cascade
  useEffect(() => {
    if (!isLoading && columns.length > 0) {
      gsap.fromTo(
        '.kanban-column',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration.normal,
          stagger: 0.06,
          ease: MOTION.ease.out,
        }
      );
    }
  }, [isLoading, columns.length]);

  // Determine current user's role on this board
  const currentUserMembership = board?.members?.find((m) => m.user.id === user?.id);
  const currentUserRole = currentUserMembership?.role || (board?.ownerId === user?.id ? 'OWNER' : 'VIEWER');
  const canEdit = currentUserRole === 'OWNER' || currentUserRole === 'MEMBER';

  // --- Optimistic Drag-and-Drop Handler ---
  const handleDragEnd = async (result: DropResult) => {
    if (!canEdit) {
      toast.error('Viewers cannot reorder tasks');
      return;
    }

    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Save previous state for atomic rollback on failure
    const previousColumns = [...columns];

    // Compute optimistic state
    const sourceColIndex = columns.findIndex((c) => c.id === source.droppableId);
    const destColIndex = columns.findIndex((c) => c.id === destination.droppableId);

    if (sourceColIndex === -1 || destColIndex === -1) return;

    const sourceCol = { ...columns[sourceColIndex], tasks: [...columns[sourceColIndex].tasks] };
    const destCol = sourceColIndex === destColIndex
      ? sourceCol
      : { ...columns[destColIndex], tasks: [...columns[destColIndex].tasks] };

    const [movedTask] = sourceCol.tasks.splice(source.index, 1);
    if (!movedTask) return;

    movedTask.columnId = destination.droppableId;
    destCol.tasks.splice(destination.index, 0, movedTask);

    // Re-assign positions locally
    sourceCol.tasks.forEach((t, i) => (t.position = i));
    if (sourceColIndex !== destColIndex) {
      destCol.tasks.forEach((t, i) => (t.position = i));
    }

    const newColumns = [...columns];
    newColumns[sourceColIndex] = sourceCol;
    if (sourceColIndex !== destColIndex) {
      newColumns[destColIndex] = destCol;
    }

    // Apply optimistic update immediately
    setColumns(newColumns);

    // Dispatch background API call
    try {
      await api.moveTask(draggableId, {
        targetColumnId: destination.droppableId,
        newPositionIndex: destination.index,
      });
    } catch (err: unknown) {
      // Rollback on error
      setColumns(previousColumns);
      const appErr = err as AppError;
      toast.error(appErr.message || 'Failed to move task. Reverted changes.');
    }
  };

  // --- Column Management ---
  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    setIsAddingColumn(true);
    try {
      const created = await api.createColumn(boardId, { title: newColumnTitle.trim() });
      setColumns((prev) => [...prev, created]);
      toast.success('Column created');
      setNewColumnTitle('');
      setIsAddColumnOpen(false);
    } catch (err: unknown) {
      const appErr = err as AppError;
      toast.error(appErr.message || 'Failed to create column');
    } finally {
      setIsAddingColumn(false);
    }
  };

  const handleDeleteColumn = async (colId: string) => {
    if (!confirm('Are you sure you want to delete this column and all its tasks?')) return;

    try {
      await api.deleteColumn(colId);
      setColumns((prev) => prev.filter((c) => c.id !== colId));
      toast.success('Column deleted');
    } catch (err: unknown) {
      const appErr = err as AppError;
      toast.error(appErr.message || 'Failed to delete column');
    }
  };

  // --- Task Management ---
  const handleOpenCreateTask = (colId: string) => {
    setSelectedTask(null);
    setTargetColumnId(colId);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setSelectedTask(task);
    setTargetColumnId(task.columnId);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (data: {
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate?: string | null;
    assigneeId?: string | null;
  }) => {
    try {
      if (selectedTask) {
        const updated = await api.updateTask(selectedTask.id, data);
        setColumns((prev) =>
          prev.map((c) =>
            c.id === updated.columnId
              ? { ...c, tasks: c.tasks.map((t) => (t.id === updated.id ? updated : t)) }
              : c,
          ),
        );
        toast.success('Task updated');
      } else {
        const created = await api.createTask(targetColumnId, data);
        setColumns((prev) =>
          prev.map((c) =>
            c.id === targetColumnId ? { ...c, tasks: [...c.tasks, created] } : c,
          ),
        );
        toast.success('Task created');
      }
    } catch (err: unknown) {
      const appErr = err as AppError;
      toast.error(appErr.message || 'Failed to save task');
      throw err;
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      setColumns((prev) =>
        prev.map((c) => ({
          ...c,
          tasks: c.tasks.filter((t) => t.id !== taskId),
        })),
      );
      toast.success('Task deleted');
    } catch (err: unknown) {
      const appErr = err as AppError;
      toast.error(appErr.message || 'Failed to delete task');
      throw err;
    }
  };

  // --- Board Title & Deletion ---
  const handleUpdateBoardTitle = async (newTitle: string) => {
    try {
      const updated = await api.updateBoard(boardId, { title: newTitle });
      setBoard((prev) => (prev ? { ...prev, title: updated.title } : null));
      toast.success('Board title updated');
    } catch (err: unknown) {
      const appErr = err as AppError;
      toast.error(appErr.message || 'Failed to update board title');
    }
  };

  const handleDeleteBoard = async () => {
    if (!confirm('Are you sure you want to permanently delete this board? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteBoard(boardId);
      toast.success('Board deleted');
      router.push('/boards');
    } catch (err: unknown) {
      const appErr = err as AppError;
      toast.error(appErr.message || 'Failed to delete board');
    }
  };

  if (isLoading || !board) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-4 overflow-x-auto pb-4">
          <Skeleton className="h-[500px] w-80 shrink-0" />
          <Skeleton className="h-[500px] w-80 shrink-0" />
          <Skeleton className="h-[500px] w-80 shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Board Top Header */}
      <div className="p-4 sm:p-6 pb-2">
        <BoardHeader
          board={board}
          members={board.members || []}
          currentUserRole={currentUserRole}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddColumn={() => setIsAddColumnOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          onUpdateTitle={handleUpdateBoardTitle}
          onDeleteBoard={handleDeleteBoard}
        />
      </div>

      {/* Kanban Drag and Drop Workspace */}
      <main className="flex-1 overflow-x-auto p-4 sm:p-6 pt-2">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex items-start gap-4 pb-6 min-w-max">
            {columns.map((column) => {
              const filteredTasks = column.tasks.filter((t) => {
                if (!searchQuery.trim()) return true;
                const query = searchQuery.toLowerCase();
                return (
                  t.title.toLowerCase().includes(query) ||
                  (t.description && t.description.toLowerCase().includes(query)) ||
                  (t.assignee && t.assignee.name.toLowerCase().includes(query))
                );
              });

              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={filteredTasks}
                  onAddTask={() => handleOpenCreateTask(column.id)}
                  onEditTask={handleOpenEditTask}
                  onDeleteColumn={() => handleDeleteColumn(column.id)}
                  canEdit={canEdit}
                />
              );
            })}

            {/* Empty State / Add Column Card */}
            {canEdit && (
              <button
                onClick={() => setIsAddColumnOpen(true)}
                className="w-80 h-32 shrink-0 border border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40 rounded-xl flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 transition-all font-medium text-xs"
              >
                <span>+ Add another column</span>
              </button>
            )}
          </div>
        </DragDropContext>
      </main>

      {/* Task Modal (Create & Edit) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        columnId={targetColumnId}
        boardMembers={board.members || []}
        onSave={handleSaveTask}
        onDelete={selectedTask ? handleDeleteTask : undefined}
        canEdit={canEdit}
      />

      {/* Share Board Modal */}
      <ShareBoardModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        boardId={board.id}
        members={board.members || []}
        currentUserId={user?.id || ''}
        currentUserRole={currentUserRole}
        onMemberChanged={fetchBoard}
      />

      {/* Add Column Modal */}
      <Modal
        isOpen={isAddColumnOpen}
        onClose={() => setIsAddColumnOpen(false)}
        title="Add Column"
        description="Add a new workflow phase to this board."
      >
        <form onSubmit={handleAddColumn} className="flex flex-col gap-4 mt-2">
          <Input
            label="Column Title"
            placeholder="e.g. In Review, QA, Deployed"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            required
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddColumnOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isAddingColumn}>
              Create Column
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
