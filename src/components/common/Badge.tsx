import React from 'react';
import { GymStatus } from '../../types';
import { Sun, Sunset, Moon, Coffee, HelpCircle } from 'lucide-react';

interface BadgeProps {
  status: GymStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const GymStatusBadge: React.FC<BadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  switch (status) {
    case 'morning':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 ${sizeClasses[size]} ${className}`}
        >
          {showIcon && <Sun size={iconSizes[size]} className="shrink-0 animate-spin-slow" />}
          <span>Morning</span>
        </span>
      );
    case 'evening':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 ${sizeClasses[size]} ${className}`}
        >
          {showIcon && <Sunset size={iconSizes[size]} className="shrink-0" />}
          <span>Evening</span>
        </span>
      );
    case 'night':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 ${sizeClasses[size]} ${className}`}
        >
          {showIcon && <Moon size={iconSizes[size]} className="shrink-0" />}
          <span>Night</span>
        </span>
      );
    case 'rest':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]} ${className}`}
        >
          {showIcon && <Coffee size={iconSizes[size]} className="shrink-0" />}
          <span>Rest Day</span>
        </span>
      );
    case 'undecided':
    default:
      return (
        <span
          className={`inline-flex items-center rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 ${sizeClasses[size]} ${className}`}
        >
          {showIcon && <HelpCircle size={iconSizes[size]} className="shrink-0" />}
          <span>Not Decided</span>
        </span>
      );
  }
};
