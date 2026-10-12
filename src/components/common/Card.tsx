import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'interactive' | 'lime-glow';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200 border';

  const variants = {
    default: 'bg-[#12141c]/90 border-[#1f2433] backdrop-blur-md',
    elevated: 'bg-[#181b26]/95 border-[#282f42] shadow-xl backdrop-blur-md',
    interactive:
      'bg-[#12141c]/90 border-[#1f2433] hover:border-[#2f384e] hover:bg-[#161924] cursor-pointer active:scale-[0.99] backdrop-blur-md',
    'lime-glow':
      'bg-[#12141c] border-[#ccff00]/40 shadow-lg shadow-[#ccff00]/10',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
