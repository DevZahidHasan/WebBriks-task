'use client';

import React from 'react';
import Link from 'next/link';
import { KanbanSquare, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
            <KanbanSquare className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-zinc-300 tracking-tight">WebBricks-task</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-400">
          <Link href="/login" className="hover:text-zinc-100 transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="hover:text-zinc-100 transition-colors">
            Create Account
          </Link>
          <Link href="/boards" className="hover:text-zinc-100 transition-colors">
            Boards
          </Link>
          <a
            href="https://github.com/DevZahidHasan/WebBriks-task"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-100 transition-colors flex items-center gap-1 font-mono"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
