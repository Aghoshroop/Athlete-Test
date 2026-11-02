import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'yellow' | 'emerald' | 'blue' | 'purple' | 'red' | 'gray' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'yellow', size = 'sm', className = '' }: BadgeProps) {
  const variantStyles = {
    yellow: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
    blue: 'bg-blue-100 text-blue-800 border-blue-300 font-medium',
    purple: 'bg-purple-100 text-purple-800 border-purple-300 font-medium',
    red: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold',
    gray: 'bg-slate-100 text-slate-700 border-slate-300 font-medium',
    outline: 'bg-white text-slate-800 border-slate-300 font-medium',
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
