'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, KanbanSquare } from 'lucide-react';

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 group-hover:border-zinc-700 transition-colors">
            <KanbanSquare className="w-4 h-4 text-zinc-200" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-zinc-100">
            WebBricks-task
          </span>
        </Link>

        {/* Action CTAs */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/boards"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-zinc-100 text-zinc-950 px-3.5 py-1.5 rounded-md hover:bg-white transition-all font-semibold active:scale-[0.98]"
          >
            <span>Open Boards</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
