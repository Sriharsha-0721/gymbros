import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto overscroll-contain animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Body */}
      <div
        className={`relative w-full ${widthClasses[maxWidth]} bg-[#12141c] border-t sm:border border-[#232838] rounded-t-3xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl z-10 max-h-[90dvh] sm:max-h-[85dvh] flex flex-col my-auto overflow-hidden pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3 shrink-0">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight truncate">
              {title}
            </h3>
            {description && (
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 -mr-2 -mt-1 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-0.5">
          {children}
        </div>
      </div>
    </div>
  );
};
