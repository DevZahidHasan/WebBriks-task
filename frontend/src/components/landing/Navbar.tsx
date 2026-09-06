'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, FolderKanban } from 'lucide-react';

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-zinc-950/70 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 group-hover:border-zinc-700 transition-colors">
            <FolderKanban className="w-4 h-4 text-zinc-300" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-zinc-100">
            Mini Kanban
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800 hidden sm:inline-block">
            v1.0.4
          </span>
        </Link>

        {/* Live System Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>API ENGINE ONLINE</span>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors px-3 py-1.5"
          >
            Sign In
          </Link>
          <Link
            href="/boards"
            className="inline-flex items-center gap-1 text-xs font-medium bg-zinc-100 text-zinc-950 px-3.5 py-1.5 rounded-md hover:bg-white transition-all font-semibold active:scale-[0.98]"
          >
            <span>Launch App</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
