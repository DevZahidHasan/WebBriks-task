'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Share2, Trash2 } from 'lucide-react';
import { Board, BoardMember, BoardRole } from '../../types';
import { Button } from '../ui/Button';

interface BoardHeaderProps {
  board: Board;
  members: BoardMember[];
  currentUserRole?: BoardRole;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddColumn: () => void;
  onOpenShare: () => void;
  onUpdateTitle: (newTitle: string) => Promise<void>;
  onDeleteBoard: () => Promise<void>;
}

export function BoardHeader({
  board,
  members,
  currentUserRole,
  searchQuery,
  onSearchChange,
  onAddColumn,
  onOpenShare,
  onUpdateTitle,
  onDeleteBoard,
}: BoardHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(board.title);

  const isOwner = currentUserRole === 'OWNER';
  const canEdit = currentUserRole === 'OWNER' || currentUserRole === 'MEMBER';

  const handleTitleSubmit = async () => {
    if (title.trim() && title !== board.title) {
      await onUpdateTitle(title.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="flex flex-col gap-4 border-b border-zinc-800/80 pb-5">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/boards"
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Boards
          </Link>
          <span className="text-zinc-700">/</span>
          {isEditingTitle && canEdit ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="text-sm font-semibold bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded text-zinc-100 focus:outline-none"
            />
          ) : (
            <span
              onClick={() => canEdit && setIsEditingTitle(true)}
              className="text-sm font-semibold text-zinc-200 hover:text-white cursor-pointer"
              title={canEdit ? 'Click to edit title' : undefined}
            >
              {board.title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Member Avatars Stack */}
          <div className="flex items-center -space-x-1.5 overflow-hidden mr-2">
            {members.slice(0, 4).map((member) => (
              <div
                key={member.id}
                title={`${member.user.name} (${member.role})`}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-zinc-950 bg-zinc-800 text-[10px] font-semibold flex items-center justify-center text-zinc-300"
              >
                {member.user.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {members.length > 4 && (
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-zinc-950 bg-zinc-900 text-[9px] font-mono flex items-center justify-center text-zinc-400">
                +{members.length - 4}
              </div>
            )}
          </div>

          <Button variant="secondary" size="sm" onClick={onOpenShare}>
            <Share2 className="w-3.5 h-3.5" />
            Share
          </Button>

          {canEdit && (
            <Button size="sm" onClick={onAddColumn}>
              <Plus className="w-3.5 h-3.5" />
              Add Column
            </Button>
          )}

          {isOwner && (
            <button
              onClick={onDeleteBoard}
              title="Delete Board"
              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800/80 rounded-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Board Description Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-zinc-400">
          {board.description || 'Drag and drop cards across columns to coordinate development workflows.'}
        </p>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-zinc-900 text-xs text-zinc-100 pl-8 pr-3 py-1.5 rounded-md border border-zinc-800 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
