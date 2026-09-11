'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'teal' | 'emerald' | 'amber' | 'rose' | 'slate' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const variantClasses: Record<string, string> = {
  default:  'bg-slate-100 text-slate-700',
  teal:     'bg-teal-50 text-teal-700 ring-1 ring-teal-200/60',
  emerald:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60',
  amber:    'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60',
  rose:     'bg-rose-50 text-rose-600 ring-1 ring-rose-200/60',
  slate:    'bg-slate-100 text-slate-600',
  outline:  'bg-transparent text-slate-600 ring-1 ring-slate-200',
};

const sizeClasses: Record<string, string> = {
  xs: 'px-1.5 py-0.5 text-[10px] leading-none',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}