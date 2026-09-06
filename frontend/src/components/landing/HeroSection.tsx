'use client';

import React, { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Github } from 'lucide-react';
import gsap from 'gsap';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.from('.hero-headline', {
        y: 30,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          '.hero-subtitle',
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          '-=0.4',
        )
        .from(
          '.hero-buttons',
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
          },
          '-=0.3',
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-16 md:pt-40 md:pb-20 px-6 max-w-5xl mx-auto flex flex-col items-center text-center"
    >
      <h1 className="hero-headline text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-zinc-100 max-w-3xl leading-[1.1] mb-6">
        Tactile, collaborative workflow management.
      </h1>

      <p className="hero-subtitle text-base sm:text-lg text-zinc-400 max-w-2xl font-normal leading-relaxed mb-10">
        WebBricks-task gives software teams clear visibility across backlogs,
        sprints, and releases with zero-friction drag-and-drop.
      </p>

      <div className="hero-buttons flex flex-wrap items-center justify-center gap-3.5">
        <Link
          href="/boards"
          className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-950 font-semibold px-5 py-2.5 rounded-md hover:bg-white transition-all text-sm active:scale-[0.98]"
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
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 px-4 py-2.5 text-sm transition-colors"
        >
          <Github className="w-4 h-4" />
          <span>GitHub</span>
        </a>
      </div>
    </section>
  );
}
