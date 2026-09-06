'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { KanbanSquare } from 'lucide-react';
import { toast } from 'sonner';
import gsap from 'gsap';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AppError } from '../../types';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.login-card', {
        opacity: 0,
        y: 18,
        duration: 0.6,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Signed in successfully');
    } catch (err: unknown) {
      const appErr = err as AppError;
      toast.error(appErr.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 sm:p-6">
      <div className="login-card w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center sm:items-start gap-2.5">
          <Link href="/" className="w-9 h-9 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 hover:border-zinc-700 transition-colors">
            <KanbanSquare className="w-5 h-5 text-zinc-200" />
          </Link>
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">Sign in to WebBricks-task</h1>
            <p className="text-xs text-zinc-400">Tactile workflow and sprint management</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-zinc-900/60 p-6 rounded-lg border border-zinc-800 shadow-xl">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button type="submit" isLoading={isLoading} className="w-full mt-2">
            Sign In
          </Button>

          <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
            <span className="text-[10px] text-zinc-500 font-mono uppercase text-center">Quick Demo Login</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('alex.morgan@example.com')}
                className="text-[11px] py-1.5 px-2 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700/60 text-center transition-colors"
              >
                Owner: Alex
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('sarah.connor@example.com')}
                className="text-[11px] py-1.5 px-2 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700/60 text-center transition-colors"
              >
                Member: Sarah
              </button>
            </div>
          </div>
        </form>

        <p className="text-xs text-center text-zinc-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-zinc-300 hover:text-white font-medium underline underline-offset-4">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
