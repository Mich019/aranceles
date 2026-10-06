import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Cpu, Radio, Volume2, VolumeX } from 'lucide-react';
import { setSoundMuted, isSoundMuted, playMechanicalClick } from '../utils/audio';

export default function TerminalDisplay({
  status = 'ONLINE', // 'ONLINE' | 'ALARM' | 'SUCCESS' | 'RECOVERY'
  alarmMessage = '',
  securityLevel = 'NIVEL 04 - ALTA SEGURIDAD',
  mode = 'LOGIN', // 'LOGIN' | 'RECOVERY'
}) {
  const [timeStr, setTimeStr] = useState('');
  const [muted, setMuted] = useState(isSoundMuted());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('es-ES', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2));
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  const toggleMute = () => {
    const newMuteState = !muted;
    setSoundMuted(newMuteState);
    setMuted(newMuteState);
    if (!newMuteState) playMechanicalClick();
  };

  return (
    <div className="w-full rounded-lg skeuo-inset-dark p-3.5 crt-screen border border-slate-700/80 shadow-inner text-slate-100 font-mono select-none">
      {/* Screen Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2.5 text-[10px] tracking-wider text-slate-400">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span className="font-bold text-slate-300 uppercase">SYS-SEC // ARANCELES V4.2</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-bold tracking-widest">{timeStr}</span>
          <button
            type="button"
            onClick={toggleMute}
            title={muted ? 'Activar sonido de terminal' : 'Silenciar sonido de terminal'}
            className="text-slate-400 hover:text-cyan-300 transition-colors p-0.5 rounded hover:bg-slate-800"
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Screen Main Telemetry Panel */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 uppercase tracking-widest text-[10px]">SERVICIO INSTITUCIONAL:</span>
          <span className="text-blue-300 font-bold text-[11px] tracking-wider">
            {mode === 'LOGIN' ? 'AUTENTICACIÓN DE IDENTIDAD' : 'RESTABLECIMIENTO DE ACCESO'}
          </span>
        </div>

        {/* Dynamic Display Status Message */}
        {status === 'ALARM' ? (
          <div className="mt-2 p-2 rounded bg-red-950/80 border border-red-600/60 crt-glow-red flex items-center gap-2.5 text-red-400 text-xs font-extrabold animate-pulse">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-500 animate-bounce" />
            <div className="flex-1">
              <div className="uppercase tracking-widest text-[11px]">¡ALERTA DE SEGURIDAD DETECTADA!</div>
              <div className="text-[10px] text-red-300 font-bold">{alarmMessage || 'ALARM-09: TRES INTENTOS FALLIDOS CONSECUTIVOS'}</div>
            </div>
          </div>
        ) : status === 'SUCCESS' ? (
          <div className="mt-2 p-2 rounded bg-emerald-950/80 border border-emerald-600/60 crt-glow-green flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <Shield className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="uppercase tracking-wider text-[11px]">IDENTIDAD VERIFICADA. CONCESIÓN DE ACCESO CONCEDA.</span>
          </div>
        ) : (
          <div className="mt-1 flex items-center justify-between text-[11px] crt-glow-green text-emerald-400">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-ping" />
              <span>TERMINAL LISTA PARA AUTENTICACIÓN</span>
            </div>
            <span className="text-[9px] bg-emerald-950/90 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700/50 uppercase">
              {securityLevel}
            </span>
          </div>
        )}
      </div>

      {/* Grid Scanline Footer */}
      <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-500">
        <span>ENCRIPTACIÓN: AES-256-GCM</span>
        <span>SESIÓN: TERMINAL-SEC-88</span>
      </div>
    </div>
  );
}
