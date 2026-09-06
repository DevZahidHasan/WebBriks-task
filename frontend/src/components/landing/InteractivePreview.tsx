'use client';

import React, { useState } from 'react';
import { Calendar, Play, CheckCircle2, RotateCcw } from 'lucide-react';
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
      title: 'Implement atomic $transaction reordering engine',
      priority: 'URGENT',
      dueDate: 'Sep 08',
      assignee: 'A',
    },
    {
      id: 'task-2',
      title: 'Audit multi-tenant IDOR access guards across routes',
      priority: 'HIGH',
      dueDate: 'Sep 10',
      assignee: 'S',
    },
  ]);

  const [doneTasks, setDoneTasks] = useState<PreviewTask[]>([
    {
      id: 'task-3',
      title: 'Design relational schema with compound B-Tree indexes',
      priority: 'MEDIUM',
      dueDate: 'Sep 04',
      assignee: 'A',
    },
  ]);

  const [lastEvent, setLastEvent] = useState<string>(
    'Ready. Click "Simulate Atomic Move" to see the transaction engine in action.',
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSimulateMove = () => {
    if (inProgressTasks.length === 0) return;

    setIsAnimating(true);
    const movingTask = inProgressTasks[0];

    setLastEvent('DISPATCHING: PATCH /api/tasks/move { targetColumnId: "done", position: 0 }');

    setTimeout(() => {
      setInProgressTasks((prev) => prev.slice(1));
      setDoneTasks((prev) => [movingTask, ...prev]);
      setLastEvent('ACID TRANSACTION COMMITTED in 1.4ms (PostgreSQL integer shifting applied)');
      setIsAnimating(false);
    }, 450);
  };

  const handleReset = () => {
    setInProgressTasks([
      {
        id: 'task-1',
        title: 'Implement atomic $transaction reordering engine',
        priority: 'URGENT',
        dueDate: 'Sep 08',
        assignee: 'A',
      },
      {
        id: 'task-2',
        title: 'Audit multi-tenant IDOR access guards across routes',
        priority: 'HIGH',
        dueDate: 'Sep 10',
        assignee: 'S',
      },
    ]);
    setDoneTasks([
      {
        id: 'task-3',
        title: 'Design relational schema with compound B-Tree indexes',
        priority: 'MEDIUM',
        dueDate: 'Sep 04',
        assignee: 'A',
      },
    ]);
    setLastEvent('Simulation reset to initial state.');
  };

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto w-full">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-semibold text-zinc-100 font-mono">
                ENGINEERING DEMO: SPRINT BOARD SIMULATOR
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Demonstrating optimistic local state transitions backed by atomic PostgreSQL write locks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleSimulateMove}
              disabled={isAnimating || inProgressTasks.length === 0}
            >
              <Play className="w-3 h-3" />
              Simulate Atomic Move
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReset} title="Reset">
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Kanban Board Columns View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Column 1: IN PROGRESS */}
          <div className="flex flex-col gap-3 p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              <span>In Progress</span>
              <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                {inProgressTasks.length}
              </span>
            </div>

            <div className="flex flex-col gap-2 min-h-[160px]">
              {inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-md bg-zinc-900 border border-zinc-800 flex flex-col gap-2 transition-all duration-200"
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
                <div className="flex-1 flex items-center justify-center text-xs text-zinc-600 border border-dashed border-zinc-850 rounded">
                  All sprint tasks transferred!
                </div>
              )}
            </div>
          </div>

          {/* Column 2: DONE */}
          <div className="flex flex-col gap-3 p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              <span>Completed (Done)</span>
              <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                {doneTasks.length}
              </span>
            </div>

            <div className="flex flex-col gap-2 min-h-[160px]">
              {doneTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-md bg-zinc-900 border border-zinc-800 flex flex-col gap-2 transition-all duration-200"
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

        {/* Live Transaction Terminal Footer */}
        <div className="mt-6 p-3 rounded-md bg-black/80 border border-zinc-800/80 flex items-center gap-2 font-mono text-[11px]">
          <span className="text-emerald-400">&gt;</span>
          <span className="text-zinc-400 truncate">{lastEvent}</span>
        </div>
      </div>
    </section>
  );
}
