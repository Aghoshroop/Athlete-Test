import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'yellow' | 'emerald' | 'blue' | 'purple' | 'red' | 'gray' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'yellow', size = 'sm', className = '' }: BadgeProps) {
  const variantStyles = {
    yellow: 'bg-red-950/40 text-rose-300 border-red-500/40 font-semibold',
    emerald: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 font-semibold',
    blue: 'bg-blue-950/40 text-blue-300 border-blue-500/40 font-medium',
    purple: 'bg-purple-950/40 text-purple-300 border-purple-500/40 font-medium',
    red: 'bg-red-600 text-white border-red-500 font-bold shadow-xs',
    gray: 'bg-slate-900 text-slate-300 border-slate-700 font-medium',
    outline: 'bg-black text-white border-slate-700 font-medium',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-full border',
    md: 'text-sm px-2.5 py-1 rounded-full border',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
}
