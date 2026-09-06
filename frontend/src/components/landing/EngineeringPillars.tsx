'use client';

import React from 'react';
import { Move, Users, CheckSquare, Zap } from 'lucide-react';

export function EngineeringPillars() {
  const features = [
    {
      icon: Move,
      title: 'Tactile Drag-and-Drop',
      description:
        'Smooth card movement across columns with real-time positional calculation and instant visual feedback.',
    },
    {
      icon: Users,
      title: 'Collaborative Workspaces',
      description:
        'Invite team members by email with specific roles—Owners can manage everything, Members can update, and Viewers can monitor.',
    },
    {
      icon: CheckSquare,
      title: 'Contiguous Task Indexing',
      description:
        'Deleting or moving tasks automatically shifts surrounding positions so columns never suffer from gaps or order divergence.',
    },
    {
      icon: Zap,
      title: 'Modern Full-Stack Performance',
      description:
        'Engineered with Next.js App Router, NestJS modular backend, and PostgreSQL for reliable speed and scalability.',
    },
  ];

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto w-full">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
          Everything your team needs to deliver on time.
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Designed with simplicity and precision for high-performing development teams.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="p-6 rounded-lg bg-zinc-900/40 border border-zinc-850 hover:border-zinc-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-md bg-zinc-850 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-3">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 tracking-tight mb-1.5">
                {feature.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
