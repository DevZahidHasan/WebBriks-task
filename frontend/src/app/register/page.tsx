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

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.register-card', {
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
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, name);
      toast.success('Account created successfully');
    } catch (err: unknown) {
      const appErr = err as AppError;
      toast.error(appErr.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 sm:p-6">
      <div className="register-card w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center sm:items-start gap-2.5">
          <Link href="/" className="w-9 h-9 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 hover:border-zinc-700 transition-colors">
            <KanbanSquare className="w-5 h-5 text-zinc-200" />
          </Link>
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">Create your workspace</h1>
            <p className="text-xs text-zinc-400">Join WebBricks-task to organize teams and workflows</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-zinc-900/60 p-6 rounded-lg border border-zinc-800 shadow-xl">
          <Input
            label="Full Name"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />

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
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <Button type="submit" isLoading={isLoading} className="w-full mt-2">
            Create Account
          </Button>
        </form>

        <p className="text-xs text-center text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="text-zinc-300 hover:text-white font-medium underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
