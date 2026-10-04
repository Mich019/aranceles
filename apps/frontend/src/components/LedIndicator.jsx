import React from 'react';

export default function LedIndicator({
  color = 'green', // 'green' | 'red' | 'amber' | 'blue'
  active = true,
  flashing = false,
  label = '',
  sublabel = '',
  size = 'md',
  className = '',
}) {
  const bulbSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const getBulbClass = () => {
    if (!active) return 'led-bulb-off';
    if (flashing && color === 'red') return 'led-bulb-red animate-alarm-flash';
    if (color === 'red') return 'led-bulb-red';
    if (color === 'green') return 'led-bulb-green';
    if (color === 'amber') return 'led-bulb-amber';
    return 'led-bulb-green';
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Metallic Chrome Bezel Ring Holder */}
      <div className="p-0.5 rounded-full bezel-ring flex items-center justify-center">
        <div className="p-0.5 bg-slate-900 rounded-full flex items-center justify-center">
          <div className={`rounded-full transition-all duration-300 ${bulbSizes[size] || bulbSizes.md} ${getBulbClass()}`} />
        </div>
      </div>

      {(label || sublabel) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-700 font-mono leading-tight">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-[9px] font-semibold text-slate-500 font-mono tracking-tight">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
