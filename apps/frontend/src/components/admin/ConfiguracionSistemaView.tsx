import React, { useState } from 'react';
import {
  Sun,
  Moon,
  ArrowLeft,
  Save,
  Check,
  FileSpreadsheet,
  HardDriveDownload,
  ShieldCheck,
} from 'lucide-react';

export interface PoliticasSistema {
  supervisionObligatoria: boolean;
  umbralSemaforoVerde: number;
  limitePreguntasDecisivas: number;
  retencionExpedientesAnos: number;
}

export interface ConfiguracionSistemaViewProps {
  onVolver?: () => void;
  politicasIniciales?: Partial<PoliticasSistema>;
  onGuardarPoliticas?: (politicas: PoliticasSistema) => void;
  supervisionObligatoria?: boolean;
  onToggleSupervision?: (val: boolean) => void;
  modoOscuro?: boolean;
  onToggleModoOscuro?: (val: boolean) => void;
}

export const ConfiguracionSistemaView: React.FC<ConfiguracionSistemaViewProps> = ({
  onVolver,
  politicasIniciales,
  onGuardarPoliticas,
  supervisionObligatoria: supervisionProp,
  onToggleSupervision,
  modoOscuro = false,
  onToggleModoOscuro,
}) => {
  // 1. Estados reactivos de políticas
  const [supervisionObligatoria, setSupervisionObligatoria] = useState<boolean>(
    supervisionProp ?? politicasIniciales?.supervisionObligatoria ?? true
  );
  const [umbralSemaforoVerde, setUmbralSemaforoVerde] = useState<number>(
    politicasIniciales?.umbralSemaforoVerde ?? 0.99
  );
  const [limitePreguntasDecisivas, setLimitePreguntasDecisivas] = useState<number>(
    politicasIniciales?.limitePreguntasDecisivas ?? 3
  );
  const [retencionExpedientesAnos, setRetencionExpedientesAnos] = useState<number>(
    politicasIniciales?.retencionExpedientesAnos ?? 5
  );

  const [notificacion, setNotificacion] = useState<string | null>(null);

  // Manejo de cambio de supervisión
  const handleToggleSupervisionInterno = () => {
    const nuevoValor = !supervisionObligatoria;
    setSupervisionObligatoria(nuevoValor);
    if (onToggleSupervision) {
      onToggleSupervision(nuevoValor);
    }
  };

  // Manejo de incremento / decremento
  const ajustarUmbral = (delta: number) => {
    setUmbralSemaforoVerde((prev) => {
      const nuevo = Math.round((prev + delta) * 1000) / 1000;
      return Math.min(0.999, Math.max(0.9, nuevo));
    });
  };

  const ajustarPreguntas = (delta: number) => {
    setLimitePreguntasDecisivas((prev) => {
      const nuevo = prev + delta;
      return Math.min(5, Math.max(1, nuevo));
    });
  };

  const ajustarRetencion = (delta: number) => {
    setRetencionExpedientesAnos((prev) => {
      const nuevo = prev + delta;
      return Math.min(10, Math.max(3, nuevo));
    });
  };

  // Guardar políticas
  const handleGuardar = () => {
    const politicas: PoliticasSistema = {
      supervisionObligatoria,
      umbralSemaforoVerde,
      limitePreguntasDecisivas,
      retencionExpedientesAnos,
    };

    if (onGuardarPoliticas) {
      onGuardarPoliticas(politicas);
    }

    setNotificacion('Políticas institucionales y parámetros operativos guardados con éxito.');
    setTimeout(() => setNotificacion(null), 3500);
  };

  // Alternar fondo claro / oscuro
  const handleCambiarFondo = (activarOscuro: boolean) => {
    if (onToggleModoOscuro) {
      onToggleModoOscuro(activarOscuro);
    }
    setNotificacion(
      activarOscuro
        ? 'Fondo Oscuro activado (Interfaz para baja luminosidad).'
        : 'Fondo Claro institucional activado.'
    );
    setTimeout(() => setNotificacion(null), 3000);
  };

  // Descarga de Bitácora (.CSV)
  const handleDescargarCsv = () => {
    const encabezados =
      'ID_EVENTO,FECHA_HORA,OPERADOR,ADUANA,TIPO_EVENTO,EXPEDIENTE,SHA256_DOCUMENTO,ESTADO_VOBO\n';
    const registros = [
      'EVT-2026-9041,2026-10-04 17:05:00,Diego Ramírez,Aduana Quito,Emisión Dictamen,EXP-2026-0419-MX,e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855,Aprobado Directo',
      'EVT-2026-9040,2026-10-04 17:03:22,Diego Ramírez,Aduana Quito,Desambiguación Presentación,EXP-2026-0419-MX,e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855,Resuelto',
      'EVT-2026-9039,2026-10-04 17:01:14,Diego Ramírez,Aduana Quito,Ingesta Documento PDF,EXP-2026-0419-MX,e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855,Integridad Conforme',
      'EVT-2026-9038,2026-10-04 15:42:10,Juan Carlos Pérez,Aduana Quito,Solicitud Vo.Bo.,EXP-2026-0418-MX,9f82a10c7b9e4d2f80112233b1ae3b0c44298fc1c149afbf4c8996fb92427ae4,Pendiente Supervisor',
      'EVT-2026-9037,2026-10-04 14:18:55,María Elena Morales,Aduana Guayaquil,Auditoría Pedimento,EXP-2026-0417-MX,7b9e4d2f80112233b1ae3b0c44298fc1c149afbf4c8996fb92427ae4e3b0c442,Conforme 100%',
      'EVT-2026-9036,2026-10-04 11:30:20,Abg. Roberto Mendoza,Aduana Central Quito,Aprobación Vo.Bo.,EXP-2026-0416-MX,4d2f80112233b1ae3b0c44298fc1c149afbf4c8996fb92427ae4e3b0c44298fc,Validado Nivel 3',
    ].join('\n');

    const contenidoCompleto = '\uFEFF' + encabezados + registros;
    const blob = new Blob([contenidoCompleto], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `Bitacora_Auditoria_Aranceles_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);

    setNotificacion('Descarga de bitácora de auditoría (.CSV) generada correctamente.');
    setTimeout(() => setNotificacion(null), 3000);
  };

  return (
    <div className="space-y-6 select-none text-slate-900 dark:text-slate-100 transition-colors">
      {/* Botón de retorno y cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {onVolver && (
            <button
              type="button"
              onClick={onVolver}
              className="text-xs font-semibold text-[#dc2626] hover:underline mb-1.5 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al Panel Principal</span>
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Políticas y Configuración del Sistema
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Ajustes visuales de fondo (Claro / Oscuro), directrices de supervisión previa y parámetros del motor arancelario.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGuardar}
          className="py-2.5 px-5 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold rounded-xl transition-all self-start sm:self-auto cursor-pointer shadow-xs flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Guardar políticas vigentes</span>
        </button>
      </div>

      {/* AVISO DE NOTIFICACIÓN TEMPORAL */}
      {notificacion && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{notificacion}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotificacion(null)}
            className="text-emerald-800 dark:text-emerald-300 hover:opacity-75 font-bold px-2 py-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* CONTENEDOR PRINCIPAL DE CONFIGURACIÓN */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs transition-colors">
        {/* =================================================================== */}
        {/* 1. SECCIÓN: FONDO CLARO Y OSCURO (REQUERIMIENTO PRINCIPAL)          */}
        {/* =================================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                1. Apariencia y Fondo del Sistema (Modo Claro / Modo Oscuro)
              </span>
            </div>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                modoOscuro
                  ? 'text-indigo-400 bg-indigo-950/40 border-indigo-800'
                  : 'text-amber-800 bg-amber-50 border-amber-300'
              }`}
            >
              {modoOscuro ? 'Fondo Oscuro Activo' : 'Fondo Claro Activo'}
            </span>
          </div>

          <div className="p-5 border border-slate-200/90 dark:border-slate-800 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>Alternar Fondo Visual de la Plataforma</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                  Cambie entre el fondo claro institucional (#f1f5f9) para trabajo de oficina diurno y el fondo oscuro (#0b0f19) para operaciones nocturnas o baja luminosidad.
                </p>
              </div>

              {/* Botón de alternancia rápida (Toggle táctil con Sol / Luna) */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {modoOscuro ? 'Modo Oscuro' : 'Modo Claro'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCambiarFondo(!modoOscuro)}
                  aria-label="Alternar entre fondo claro y fondo oscuro"
                  className={`w-16 h-8 rounded-full p-1 transition-colors relative cursor-pointer flex items-center ${
                    modoOscuro ? 'bg-[#dc2626]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white keep-white shadow-xs flex items-center justify-center transition-transform ${
                      modoOscuro ? 'translate-x-8 text-[#dc2626]' : 'translate-x-0 text-amber-500'
                    }`}
                  >
                    {modoOscuro ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Dos tarjetas seleccionables de modo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
              {/* Tarjeta 1: Fondo Claro */}
              <div
                onClick={() => handleCambiarFondo(false)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  !modoOscuro
                    ? 'border-[#dc2626] bg-white shadow-xs ring-1 ring-[#dc2626]'
                    : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/90 hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                  <Sun className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Fondo Claro Institucional
                    </span>
                    {!modoOscuro && (
                      <span className="text-[10px] font-bold text-[#dc2626] uppercase">Activo</span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                    Lienzo slate suave (#f1f5f9) con tarjetas blancas
                  </span>
                </div>
              </div>

              {/* Tarjeta 2: Fondo Oscuro */}
              <div
                onClick={() => handleCambiarFondo(true)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  modoOscuro
                    ? 'border-[#dc2626] bg-slate-900 shadow-xs ring-1 ring-[#dc2626]'
                    : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/90 hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-950/70 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-800">
                  <Moon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Fondo Oscuro (Dark Mode)
                    </span>
                    {modoOscuro && (
                      <span className="text-[10px] font-bold text-[#dc2626] uppercase">Activo</span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                    Lienzo profundo (#0b0f19) y paneles `#0f172a`
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 2. DOBLE CONTROL Y SUPERVISIÓN PREVIA (MECANISMO ESTRICTO)          */}
        {/* =================================================================== */}
        <section className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              2. Régimen de Doble Control y Fiscalización Previa
            </span>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                supervisionObligatoria
                  ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700'
                  : 'text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700'
              }`}
            >
              {supervisionObligatoria ? 'Mecanismo Activo' : 'Supervisión Flexible'}
            </span>
          </div>

          <div className="p-5 border border-slate-200/90 dark:border-slate-800 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Supervisión previa obligatoria para todo el personal operativo
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                  Al estar activo, ningún archivo cargado por personal operativo se procesará en el motor arancelario de forma directa; pasará a la bandeja de visto bueno para ser revisado por su supervisor correspondiente.
                </p>
              </div>

              {/* Interruptor (Toggle) de alto contraste */}
              <button
                type="button"
                onClick={handleToggleSupervisionInterno}
                aria-pressed={supervisionObligatoria}
                className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  supervisionObligatoria ? 'bg-[#dc2626]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white keep-white transition-transform absolute top-1 ${
                    supervisionObligatoria ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              Estado actual del flujo:{' '}
              {supervisionObligatoria ? (
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  Todo dictamen emitido por clasificadores Nivel 1 retiene firma hasta recibir Vo.Bo. oficial.
                </span>
              ) : (
                <span className="font-semibold text-amber-700 dark:text-amber-400">
                  Los clasificadores autorizados pueden emitir resoluciones directas sin visado previo.
                </span>
              )}
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 3. PARÁMETROS DEL MOTOR DETERMINISTA (CONTROLES − / +)              */}
        {/* =================================================================== */}
        <section className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 block">
              3. Parámetros del Motor Determinista (Controles Táctiles − / +)
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ajuste de los umbrales algorítmicos que gobiernan la emisión de dictámenes directos y desambiguación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Parámetro 1: Umbral de semáforo verde */}
            <div className="p-4 border border-slate-200/90 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/80 flex flex-col justify-between space-y-4 shadow-2xs">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Umbral de Semáforo Verde
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                  Certeza determinista mínima requerida para expedir el dictamen sin desambiguación.
                </p>
              </div>

              {/* Control − / + */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => ajustarUmbral(-0.005)}
                  disabled={umbralSemaforoVerde <= 0.9}
                  className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-30 text-lg font-bold flex items-center justify-center cursor-pointer transition-colors text-slate-900 dark:text-slate-100"
                  title="Disminuir umbral"
                >
                  −
                </button>

                <div className="text-center px-2">
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-slate-100 block">
                    {(umbralSemaforoVerde * 100).toFixed(1)}%
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 block">
                    {umbralSemaforoVerde.toFixed(3)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => ajustarUmbral(0.005)}
                  disabled={umbralSemaforoVerde >= 0.999}
                  className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-30 text-lg font-bold flex items-center justify-center cursor-pointer transition-colors text-slate-900 dark:text-slate-100"
                  title="Aumentar umbral"
                >
                  +
                </button>
              </div>
            </div>

            {/* Parámetro 2: Límite de preguntas decisivas */}
            <div className="p-4 border border-slate-200/90 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/80 flex flex-col justify-between space-y-4 shadow-2xs">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Límite de Preguntas Decisivas
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                  Máximo de preguntas de desambiguación antes de remitir a peritaje técnico manual.
                </p>
              </div>

              {/* Control − / + */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => ajustarPreguntas(-1)}
                  disabled={limitePreguntasDecisivas <= 1}
                  className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-30 text-lg font-bold flex items-center justify-center cursor-pointer transition-colors text-slate-900 dark:text-slate-100"
                  title="Disminuir límite"
                >
                  −
                </button>

                <div className="text-center px-2">
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-slate-100 block">
                    {limitePreguntasDecisivas}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Preguntas máx.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => ajustarPreguntas(1)}
                  disabled={limitePreguntasDecisivas >= 5}
                  className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-30 text-lg font-bold flex items-center justify-center cursor-pointer transition-colors text-slate-900 dark:text-slate-100"
                  title="Aumentar límite"
                >
                  +
                </button>
              </div>
            </div>

            {/* Parámetro 3: Retención mínima de expedientes */}
            <div className="p-4 border border-slate-200/90 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/80 flex flex-col justify-between space-y-4 shadow-2xs">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Retención Mínima de Expedientes
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                  Plazo de conservación inmutable de documentos glosados y firmas digitales.
                </p>
              </div>

              {/* Control − / + */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => ajustarRetencion(-1)}
                  disabled={retencionExpedientesAnos <= 3}
                  className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-30 text-lg font-bold flex items-center justify-center cursor-pointer transition-colors text-slate-900 dark:text-slate-100"
                  title="Disminuir años"
                >
                  −
                </button>

                <div className="text-center px-2">
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-slate-100 block">
                    {retencionExpedientesAnos} años
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Plazo legal mínimo
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => ajustarRetencion(1)}
                  disabled={retencionExpedientesAnos >= 10}
                  className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-30 text-lg font-bold flex items-center justify-center cursor-pointer transition-colors text-slate-900 dark:text-slate-100"
                  title="Aumentar años"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 4. RESPALDO Y AUDITORÍA                                             */}
        {/* =================================================================== */}
        <section className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 block">
            4. Respaldo Criptográfico y Bitácora de Auditoría
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* Tarjeta de resguardo */}
            <div className="p-5 border border-slate-200/90 dark:border-slate-800 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                    Almacenamiento Local Seguro e Inmutable
                  </h4>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Todos los archivos PDF originales recibidos se almacenan en el volumen local cifrado de la aduana. Cada documento cuenta con una firma SHA-256 única y una constancia inmutable que garantiza su no alteración durante el período de retención legal ({retencionExpedientesAnos} años).
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Normativa: Archivo Aduanal y Glosa Digital</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Integridad 100%</span>
              </div>
            </div>

            {/* Descarga de bitácora */}
            <div className="p-5 border border-slate-200/90 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/80 flex flex-col justify-between space-y-4 shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                    Exportación de Registro Oficial de Eventos
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  Obtenga un archivo estructurado con todos los eventos de clasificación, intervenciones de supervisión y expedición de dictámenes para efectos de fiscalización interna o auditoría externa.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleDescargarCsv}
                  className="w-full py-2.5 px-4 border border-slate-200 dark:border-slate-700 hover:border-[#dc2626] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <HardDriveDownload className="w-4 h-4 text-[#dc2626]" />
                  <span>Descargar bitácora de auditoría y eventos (.CSV)</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ConfiguracionSistemaView;
