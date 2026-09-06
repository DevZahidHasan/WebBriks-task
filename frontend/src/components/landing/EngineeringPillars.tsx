'use client';

import React from 'react';
import { Cpu, Lock, RefreshCw, Layers } from 'lucide-react';

export function EngineeringPillars() {
  const pillars = [
    {
      icon: Cpu,
      tag: '01 / CONCURRENCY CONTROL',
      title: 'ACID Shifting vs Fractional Exhaustion',
      description:
        'Rather than halving floating-point numbers which collapses after 53 moves, our reordering engine executes atomic PostgreSQL updateMany queries with contiguous integer indices.',
    },
    {
      icon: Lock,
      tag: '02 / MULTI-TENANT ACCESS',
      title: 'Anti-IDOR Parent Guard Resolution',
      description:
        'Every mutation route checks parent board membership across nested /columns and /tasks parameters, guaranteeing attackers cannot tamper with boards they do not belong to.',
    },
    {
      icon: RefreshCw,
      tag: '03 / TACTILE RESILIENCY',
      title: 'Optimistic UI with Instant Rollback',
      description:
        'Client-side state renders moves instantly with zero latency. If the network drops or the server rejects, state rolls back to the previous snapshot with a Sonner alert.',
    },
    {
      icon: Layers,
      tag: '04 / PRODUCTION STANDARDS',
      title: '100% Strict TypeScript Architecture',
      description:
        'Strict type safety with zero any across both NestJS backend and Next.js App Router, complete with normalized AppError formats and class-validator DTOs.',
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
          SYSTEM CAPABILITIES
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-100 mt-1">
          Built for resilience under real-world concurrency.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="p-6 sm:p-8 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-zinc-500">{pillar.tag}</span>
                  <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 tracking-tight mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
