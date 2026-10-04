import React from 'react';
import { Delete, RotateCcw } from 'lucide-react';
import { playMechanicalClick, playHeavySwitchSound } from '../utils/audio';

export default function KeypadModule({
  pin = '',
  onPinChange,
  maxLength = 6,
  onClear,
}) {
  const handleNumberClick = (num) => {
    if (pin.length < maxLength) {
      playMechanicalClick();
      onPinChange(pin + num);
    }
  };

  const handleDelete = () => {
    playMechanicalClick();
    if (pin.length > 0) {
      onPinChange(pin.slice(0, -1));
    }
  };

  const handleReset = () => {
    playHeavySwitchSound();
    if (onClear) onClear();
    else onPinChange('');
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="p-3 skeuo-panel rounded-xl border border-slate-300 shadow-md space-y-3">
      <div className="flex items-center justify-between text-[10px] font-extrabold font-mono text-slate-700 uppercase tracking-wider">
        <span>TECLADO MECÁNICO PIN DE SEGURIDAD</span>
        <span className="text-blue-600 font-bold">{pin.length}/{maxLength} DÍGITOS</span>
      </div>

      {/* Recessed PIN Slot Display */}
      <div className="py-2 px-3 rounded-lg skeuo-inset-dark flex items-center justify-center gap-2 border border-slate-700 font-mono text-lg text-emerald-400">
        {Array.from({ length: maxLength }).map((_, idx) => (
          <span
            key={idx}
            className={`w-3.5 h-4 flex items-center justify-center rounded-sm ${
              idx < pin.length ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-800 border border-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Mechanical Push Key Grid */}
      <div className="grid grid-cols-3 gap-2">
        {keys.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleNumberClick(num)}
            className="skeuo-button py-2.5 rounded-lg text-sm font-bold font-mono text-slate-800 hover:text-blue-700 active:scale-95 transition-all shadow-sm"
          >
            {num}
          </button>
        ))}
        <button
          type="button"
          onClick={handleReset}
          title="Limpiar PIN"
          className="skeuo-button py-2.5 rounded-lg text-xs font-bold font-mono text-amber-700 hover:text-amber-800 active:scale-95 flex items-center justify-center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleNumberClick('0')}
          className="skeuo-button py-2.5 rounded-lg text-sm font-bold font-mono text-slate-800 hover:text-blue-700 active:scale-95 transition-all shadow-sm"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleDelete}
          title="Borrar último dígito"
          className="skeuo-button py-2.5 rounded-lg text-xs font-bold font-mono text-red-700 hover:text-red-800 active:scale-95 flex items-center justify-center"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
