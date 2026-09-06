'use client';

import React, { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Database, Layers, Github } from 'lucide-react';
import gsap from 'gsap';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge', {
        y: 15,
        opacity: 0,
        duration: 0.6,
      })
        .from(
          '.hero-title-line',
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
          },
          '-=0.3',
        )
        .from(
          '.hero-description',
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          '-=0.4',
        )
        .from(
          '.hero-cta',
          {
            y: 15,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          '-=0.4',
        )
        .from(
          '.hero-stat-card',
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
          },
          '-=0.3',
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden"
    >
      {/* Editorial Eyebrow */}
      <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-400 mb-8 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>ACID TRANSACTION ISOLATION &bull; ZERO-GAP REORDERING</span>
      </div>

      {/* Razor-Sharp Editorial Title */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-zinc-100 max-w-4xl leading-[1.08] mb-6">
        <span className="hero-title-line block">High-velocity workflows.</span>
        <span className="hero-title-line block text-zinc-400">Provable consistency.</span>
      </h1>

      {/* Subtitle with Technical Substance */}
      <p className="hero-description text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl font-normal leading-relaxed mb-10">
        A production-grade collaborative Kanban board engineered with PostgreSQL atomic
        transactions, sub-millisecond multi-tenant RBAC, and tactile drag-and-drop physics.
      </p>

      {/* Action Buttons */}
      <div className="hero-cta flex flex-wrap items-center justify-center gap-3 mb-16">
        <Link
          href="/boards"
          className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-950 font-semibold px-5 py-2.5 rounded-md hover:bg-white transition-all text-sm shadow-md active:scale-[0.98]"
        >
          <span>Launch Workspace</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 px-5 py-2.5 rounded-md transition-colors text-sm font-medium"
        >
          Sign In
        </Link>
        <a
          href="https://github.com/DevZahidHasan/WebBriks-task"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 px-4 py-2.5 text-sm font-mono transition-colors"
        >
          <Github className="w-4 h-4" />
          <span>GitHub</span>
        </a>
      </div>

      {/* Architectural Value Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl text-left">
        <div className="hero-stat-card p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono mb-1">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>POSTGRESQL ACID</span>
          </div>
          <p className="text-xs text-zinc-400">
            Atomic integer shift transactions guarantee zero task order divergence under high concurrency.
          </p>
        </div>

        <div className="hero-stat-card p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>ANTI-IDOR RBAC</span>
          </div>
          <p className="text-xs text-zinc-400">
            Granular guards resolve parent board tenant hierarchy on all mutations with 403 authorization.
          </p>
        </div>

        <div className="hero-stat-card p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono mb-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>OPTIMISTIC UI</span>
          </div>
          <p className="text-xs text-zinc-400">
            0ms perceived interaction latency with automatic state rollback on unexpected network drop.
          </p>
        </div>
      </div>
    </section>
  );
}
