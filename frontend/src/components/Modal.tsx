import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] w-full max-w-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col max-h-[90vh] transition-all">
        <div className="px-6 py-4 border-b border-[#E9E5F7] dark:border-[#30334F] flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl text-[#6B7280] dark:text-[#A9A8BC] hover:text-[#7C3AED] dark:hover:text-white hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
