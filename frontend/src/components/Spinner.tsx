import React from 'react';
import { cn } from '../utils/cn';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className, ...props }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-indigo-600 border-t-transparent dark:border-indigo-400 dark:border-t-transparent',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
};
