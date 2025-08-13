import React from 'react';

export default function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] animate-fadeIn">
      <div className="flex flex-col justify-center items-center bg-white rounded-lg px-16 py-8 shadow-lg gap-3 font-bold w-full max-w-[300px] text-[var(--sb-theme-color)]">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-[var(--sb-theme-color,#333)] border-r-[var(--sb-theme-color,#999)] rounded-full animate-spin" />
        <p>{message}</p>
      </div>
    </div>
  );
}
