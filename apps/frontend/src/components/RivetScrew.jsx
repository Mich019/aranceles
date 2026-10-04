import React from 'react';

export default function RivetScrew({ size = 'md', angle = 45, className = '' }) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const slotSize = {
    sm: 'w-2 h-0.5',
    md: 'w-2.5 h-0.5',
    lg: 'w-3.5 h-0.5',
  };

  return (
    <div
      className={`relative rounded-full screw-head flex items-center justify-center shrink-0 ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title="Tornillo de fijación industrial"
    >
      {/* 3D Bevel inner rim */}
      <div className="absolute inset-0.5 rounded-full border border-white/40 pointer-events-none" />
      {/* Screw head Slot */}
      <div
        className={`screw-slot rounded-full ${slotSize[size] || slotSize.md}`}
        style={{ transform: `rotate(${angle}deg)` }}
      />
    </div>
  );
}
