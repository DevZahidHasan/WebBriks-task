'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Layout, Users, LogOut, ArrowUpRight, FolderKanban } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Board, AppError } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';

export default function BoardsDashboardPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchBoards();
    }
  }, [user, authLoading, router]);

  const fetchBoards = async () => {
    try {
      setIsLoading(true);
      const data = await api.getBoards();
      setBoards(data);
    } catch (err: unknown) {
      const appErr = err as AppError;
      toast.error(appErr.message || 'Failed to load boards');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Board title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await api.createBoard({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
      });
      toast.success('Board created successfully');
      setIsCreateOpen(false);
      setNewTitle('');
      setNewDescription('');
      router.push(`/boards/${created.id}`);
    } catch (err: unknown) {
      const appErr = err as AppError;
      toast.error(appErr.message || 'Failed to create board');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (!user && isLoading)) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 flex flex-col gap-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center py-4 border-b border-zinc-900">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-zinc-850 bg-zinc-950/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-200">
              <FolderKanban className="w-4 h-4 text-zinc-300" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-100">Mini Kanban</span>
            <span className="text-zinc-600 text-xs font-mono">/</span>
            <span className="text-zinc-400 text-xs">Workspaces</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right hidden sm:block">
              <span className="text-xs font-medium text-zinc-200">{user?.name}</span>
              <span className="text-[11px] text-zinc-500 font-mono">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-mono">PROJECT BOARDS</span>
            <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight mt-0.5">Your Active Workspaces</h1>
            <p className="text-xs text-zinc-400 mt-1">Manage project workflow columns, cards, and team permissions.</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            New Board
          </Button>
        </div>

        {/* Boards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : boards.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-800 p-12 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500">
              <Layout className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-zinc-200">No boards yet</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              Create your first Kanban board to start organizing tasks, inviting teammates, and visualizing workflows.
            </p>
            <Button onClick={() => setIsCreateOpen(true)} size="sm" className="mt-2">
              <Plus className="w-4 h-4" />
              Create your first board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <Link
                key={board.id}
                href={`/boards/${board.id}`}
                className="group relative flex flex-col justify-between p-5 rounded-lg bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700/80 transition-all duration-150 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm text-zinc-100 group-hover:text-white tracking-tight flex items-center gap-1.5">
                      {board.title}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-zinc-400 transition-opacity" />
                    </h3>
                    <Badge
                      variant="outline"
                      className={
                        board.role === 'OWNER'
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                          : 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                      }
                    >
                      {board.role || 'MEMBER'}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {board.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 text-zinc-400" />
                    {board._count?.columns || 0} columns
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                    {board._count?.members || 1} members
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Create Board Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Board"
        description="Add a workspace to track projects, assign tasks, and collaborate."
      >
        <form onSubmit={handleCreateBoard} className="flex flex-col gap-4 mt-2">
          <Input
            label="Board Title"
            placeholder="e.g. Q3 Growth Sprint"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            autoFocus
          />
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-medium text-zinc-300">Description (Optional)</label>
            <textarea
              className="w-full bg-zinc-900 text-zinc-100 text-sm px-3 py-2 rounded-md border border-zinc-800 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-500 transition-colors min-h-[80px]"
              placeholder="What is this board about?"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Board
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
