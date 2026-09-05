'use client';

import React, { useState } from 'react';
import { UserPlus, Trash2, ShieldCheck, Eye, Users } from 'lucide-react';
import { toast } from 'sonner';
import { BoardMember, BoardRole, AppError } from '../../types';
import { api } from '../../lib/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

interface ShareBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  members: BoardMember[];
  currentUserId: string;
  currentUserRole?: BoardRole;
  onMemberChanged: () => Promise<void>;
}

export function ShareBoardModal({
  isOpen,
  onClose,
  boardId,
  members,
  currentUserId,
  currentUserRole,
  onMemberChanged,
}: ShareBoardModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<BoardRole>('MEMBER');
  const [isInviting, setIsInviting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const canManage = currentUserRole === 'OWNER' || currentUserRole === 'MEMBER';
  const isOwner = currentUserRole === 'OWNER';

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsInviting(true);
    try {
      await api.addBoardMember(boardId, {
        email: email.trim().toLowerCase(),
        role,
      });
      toast.success(`Collaborator added to board as ${role}`);
      setEmail('');
      await onMemberChanged();
    } catch (err: unknown) {
      const appErr = err as AppError;
      toast.error(appErr.message || 'Failed to add collaborator');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemove = async (targetUserId: string) => {
    setRemovingId(targetUserId);
    try {
      await api.removeBoardMember(boardId, targetUserId);
      toast.success('Member removed');
      await onMemberChanged();
    } catch (err: unknown) {
      const appErr = err as AppError;
      toast.error(appErr.message || 'Failed to remove member');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share & Collaborate"
      description="Invite teammates to this board to view or manage tasks."
      className="max-w-md"
    >
      <div className="flex flex-col gap-6 mt-3">
        {/* Invite Form */}
        {canManage ? (
          <form onSubmit={handleInvite} className="flex flex-col gap-3 p-3.5 bg-zinc-950/60 rounded-lg border border-zinc-800">
            <span className="text-[11px] font-mono text-zinc-400 uppercase flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5" /> Invite Teammate
            </span>
            <div className="flex gap-2">
              <Input
                placeholder="colleague@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-xs py-1.5"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as BoardRole)}
                className="bg-zinc-900 text-zinc-200 text-xs px-2.5 py-1.5 rounded-md border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              >
                <option value="MEMBER">Member (Edit)</option>
                <option value="VIEWER">Viewer (Read-only)</option>
              </select>
            </div>
            <Button type="submit" size="sm" isLoading={isInviting} className="self-end">
              Invite User
            </Button>
          </form>
        ) : (
          <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800 text-xs text-zinc-500">
            Only owners and members can invite new collaborators.
          </div>
        )}

        {/* Members List */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-mono text-zinc-500 uppercase flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Board Members ({members.length})
          </span>

          <div className="flex flex-col divide-y divide-zinc-850 max-h-56 overflow-y-auto">
            {members.map((member) => {
              const isMemberOwner = member.role === 'OWNER';
              const isSelf = member.user.id === currentUserId;
              const canRemove = !isMemberOwner && (isOwner || isSelf);

              return (
                <div key={member.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-200 shrink-0">
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-zinc-200 truncate flex items-center gap-1.5">
                        {member.user.name}
                        {isSelf && <span className="text-[10px] text-zinc-500 font-mono">(You)</span>}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono truncate">{member.user.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={
                        member.role === 'OWNER'
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                          : member.role === 'MEMBER'
                          ? 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                          : 'border-zinc-700 text-zinc-400'
                      }
                    >
                      {member.role === 'OWNER' && <ShieldCheck className="w-3 h-3 mr-1" />}
                      {member.role === 'VIEWER' && <Eye className="w-3 h-3 mr-1" />}
                      {member.role}
                    </Badge>

                    {canRemove && (
                      <button
                        onClick={() => handleRemove(member.user.id)}
                        disabled={removingId === member.user.id}
                        title={isSelf ? 'Leave board' : 'Remove member'}
                        className="text-zinc-600 hover:text-red-400 p-1 rounded hover:bg-zinc-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
