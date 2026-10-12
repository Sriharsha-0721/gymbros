import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'Bro',
  size = 'md',
  className = '',
  showBorder = true,
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-bold',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  const borderClass = showBorder ? 'border-2 border-[#1f2433]' : '';

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImageError(true)}
        className={`rounded-full object-cover shrink-0 select-none ${sizeClasses[size]} ${borderClass} ${className}`}
      />
    );
  }

  // Consistent pleasant background color based on name string
  const colors = [
    'bg-gradient-to-tr from-lime-600 to-lime-400 text-black',
    'bg-gradient-to-tr from-amber-600 to-amber-400 text-black',
    'bg-gradient-to-tr from-cyan-600 to-cyan-400 text-black',
    'bg-gradient-to-tr from-purple-600 to-purple-400 text-white',
    'bg-gradient-to-tr from-emerald-600 to-emerald-400 text-black',
  ];
  const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorClass = colors[charCodeSum % colors.length];

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold shrink-0 select-none ${colorClass} ${sizeClasses[size]} ${borderClass} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
