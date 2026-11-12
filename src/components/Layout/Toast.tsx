import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 bottom-[calc(76px+env(safe-area-inset-bottom,0px))] md:bottom-6 z-60 bg-[#F2F1EC] text-[#111111] px-4 py-3 rounded-lg shadow-2xl font-medium flex items-center gap-2.5 text-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <CheckCircle2 className="w-5 h-5 text-[#0F6B63] flex-none" />
      <span>{toastMessage}</span>
    </div>
  );
};
