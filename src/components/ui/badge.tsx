import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'outline';
}

export function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
  const baseStyles =
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors';

  const variants = {
    primary: 'bg-red-100 text-red-900 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
    secondary: 'bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    accent: 'bg-emerald-100 text-emerald-900 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    outline: 'border border-stone-300 text-stone-700 dark:border-stone-700 dark:text-stone-300',
  };

  return <span className={cn(baseStyles, variants[variant], className)} {...props} />;
}
