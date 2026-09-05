import React from 'react';
import { cn } from '../../lib/utils';
import { TaskPriority } from '../../types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'priority';
  priority?: TaskPriority;
}

export function Badge({ className, variant = 'default', priority, children, ...props }: BadgeProps) {
  if (priority) {
    const priorityStyles: Record<TaskPriority, string> = {
      URGENT: 'bg-red-500/10 text-red-400 border border-red-500/20 font-semibold',
      HIGH: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium',
      MEDIUM: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium',
      LOW: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 font-normal',
    };

    return (
      <span
        className={cn(
          'inline-flex items-center text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full select-none',
          priorityStyles[priority],
          className,
        )}
        {...props}
      >
        {children || priority}
      </span>
    );
  }

  const baseStyles = 'inline-flex items-center text-xs px-2 py-0.5 rounded-full select-none';
  const variants = {
    default: 'bg-zinc-800 text-zinc-300 border border-zinc-700/50',
    outline: 'bg-transparent text-zinc-400 border border-zinc-800',
    priority: '',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
