'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface PreviewTask {
  id: string;
  title: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: string;
  assignee: string;
}

export function InteractivePreview() {
  const [inProgressTasks, setInProgressTasks] = useState<PreviewTask[]>([
    {
      id: 'task-1',
      title: 'Setup automated CI/CD pipeline for cloud deployment',
      priority: 'URGENT',
      dueDate: 'Sep 08',
      assignee: 'A',
    },
    {
      id: 'task-2',
      title: 'Review team access permissions and invite settings',
      priority: 'HIGH',
      dueDate: 'Sep 10',
      assignee: 'S',
    },
  ]);

  const [doneTasks, setDoneTasks] = useState<PreviewTask[]>([
    {
      id: 'task-3',
      title: 'Design relational schema with PostgreSQL',
      priority: 'MEDIUM',
      dueDate: 'Sep 04',
      assignee: 'A',
    },
  ]);

  const [isMoved, setIsMoved] = useState(false);

  const handleMoveTask = () => {
    if (inProgressTasks.length === 0) return;
    const [taskToMove, ...remaining] = inProgressTasks;
    setInProgressTasks(remaining);
    setDoneTasks((prev) => [taskToMove, ...prev]);
    setIsMoved(true);
  };

  const handleReset = () => {
    setInProgressTasks([
      {
        id: 'task-1',
        title: 'Setup automated CI/CD pipeline for cloud deployment',
        priority: 'URGENT',
        dueDate: 'Sep 08',
        assignee: 'A',
      },
      {
        id: 'task-2',
        title: 'Review team access permissions and invite settings',
        priority: 'HIGH',
        dueDate: 'Sep 10',
        assignee: 'S',
      },
    ]);
    setDoneTasks([
      {
        id: 'task-3',
        title: 'Design relational schema with PostgreSQL',
        priority: 'MEDIUM',
        dueDate: 'Sep 04',
        assignee: 'A',
      },
    ]);
    setIsMoved(false);
  };

  return (
    <section className="py-8 px-6 max-w-5xl mx-auto w-full">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-zinc-800/80">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Interactive Board Preview
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Experience seamless card transitions between sprint stages.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleMoveTask}
              disabled={inProgressTasks.length === 0}
            >
              <span>Move Card</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
            {isMoved && (
              <Button size="sm" variant="ghost" onClick={handleReset} title="Reset">
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Board Columns View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1: IN PROGRESS */}
          <div className="flex flex-col gap-3 p-4 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
              <span>In Progress</span>
              <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                {inProgressTasks.length}
              </span>
            </div>

            <div className="flex flex-col gap-2 min-h-[160px]">
              {inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex flex-col gap-2 transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <Badge priority={task.priority} />
                  </div>
                  <h5 className="text-xs font-medium text-zinc-200">{task.title}</h5>
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[10px] text-zinc-500 font-mono">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Calendar className="w-3 h-3" />
                      {task.dueDate}
                    </span>
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300">
                      {task.assignee}
                    </div>
                  </div>
                </div>
              ))}

              {inProgressTasks.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded">
                  No cards in this column
                </div>
              )}
            </div>
          </div>

          {/* Column 2: DONE */}
          <div className="flex flex-col gap-3 p-4 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
              <span>Completed</span>
              <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                {doneTasks.length}
              </span>
            </div>

            <div className="flex flex-col gap-2 min-h-[160px]">
              {doneTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-md bg-zinc-900 border border-zinc-800 flex flex-col gap-2 transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <Badge priority={task.priority} />
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <h5 className="text-xs font-medium text-zinc-200">{task.title}</h5>
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[10px] text-zinc-500 font-mono">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Calendar className="w-3 h-3" />
                      {task.dueDate}
                    </span>
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300">
                      {task.assignee}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
