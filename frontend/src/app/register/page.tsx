'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 sm:p-6">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col gap-1.5 text-center sm:text-left">
          <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-mono">NEW ACCOUNT</span>
          <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">Create your workspace</h1>
          <p className="text-xs text-zinc-400">Join Mini Kanban to organize teams and workflows</p>
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
