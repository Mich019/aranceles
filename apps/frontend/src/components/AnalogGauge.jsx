import React from 'react';

export default function AnalogGauge({ score = 0, label = 'FORTALEZA CLAVE' }) {
  // score: 0 to 100
  // needle angle: -70deg to +70deg
  const needleAngle = -70 + (score / 100) * 140;

  const getScoreColor = () => {
    if (score < 30) return 'text-red-500';
    if (score < 70) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getScoreText = () => {
    if (score === 0) return 'SIN CLAVE';
    if (score < 30) return 'DÉBIL / VULNERABLE';
    if (score < 70) return 'MEDIANA / ACEPTABLE';
    return 'ALTA / ROBUSTA (AES-256)';
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 skeuo-inset rounded-lg border border-slate-300 select-none">
      <span className="text-[10px] font-extrabold font-mono text-slate-600 uppercase tracking-wider mb-1">
        {label}
      </span>

      {/* Dial Meter Face */}
      <div className="relative w-36 h-20 bg-slate-900 rounded-t-full border-2 border-slate-400 shadow-inner overflow-hidden flex items-end justify-center">
        {/* Dial Scale Markings */}
        <div className="absolute inset-0 flex items-center justify-between px-3 text-[8px] font-mono text-slate-400 pt-6">
          <span className="text-red-400 font-bold">DÉBIL</span>
          <span className="text-amber-400 font-bold">MED</span>
          <span className="text-emerald-400 font-bold">ALTA</span>
        </div>

        {/* Color arc background */}
        <div className="absolute top-2 w-28 h-28 rounded-full border-[5px] border-slate-800 border-t-red-500 border-r-emerald-500 border-l-amber-500 opacity-60" />

        {/* Needle */}
        <div
          className="absolute bottom-1 w-0.5 h-14 bg-red-600 origin-bottom transition-transform duration-500 ease-out shadow-lg"
          style={{ transform: `rotate(${needleAngle}deg)` }}
        >
          <div className="w-2 h-2 rounded-full bg-red-400 -ml-0.75 -mt-1 shadow-[0_0_5px_#ef4444]" />
        </div>

        {/* Center Screw Cap */}
        <div className="absolute bottom-0 w-5 h-5 rounded-full bg-slate-400 border border-slate-600 shadow-md flex items-center justify-center z-10">
          <div className="w-2 h-2 rounded-full bg-slate-700" />
        </div>
      </div>

      {/* Score Result Label */}
      <div className={`mt-1.5 text-[11px] font-mono font-bold uppercase tracking-wider ${getScoreColor()}`}>
        {getScoreText()}
      </div>
    </div>
  );
}
