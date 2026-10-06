import React, { useMemo, useState } from 'react';

export interface ObservacionAuditoria {
  tipo: 'rectificacion' | 'documentacion' | 'turnar';
  titulo: string;
  partidasObservadas: number[];
  nota: string;
}

export interface AuditoriaPedimentoViewProps {
  /** Fracción determinada por el motor, ej. "7219.34.01 — NICO 01". */
  fraccionMotor?: string;
  onConfirmarConformidad: () => void;
  onEmitirObservacion: (observacion: ObservacionAuditoria) => void;
  onVolver: () => void;
}

interface PartidaPedimento {
  secuencia: number;
  descripcion: string;
  fraccionDeclarada: string;
  nicoDeclarado: string;
  detalleTecnico: string;
  usaResultadoPrincipal: boolean;
  motorFijo?: { fraccion: string; nico: string };
}

const DATOS_PEDIMENTO = {
  numero15Digitos: '262438416001234', // 15 dígitos aduanales estándar: 26 (año) 24 (aduana) 3841 (patente) 6001234 (consecutivo)
  aduana: '24 — Aduana de Nuevo Laredo (Sección Aduanera Puente III)',
  clave: 'A1 - Importación definitiva',
  proveedor: 'Aceros Especiales S.A.',
  importador: 'Industrial Metalúrgica del Norte S.A. de C.V.',
};

const PARTIDAS_BASE: PartidaPedimento[] = [
  {
    secuencia: 1,
    descripcion: 'Lámina rolada en frío inox 304',
    fraccionDeclarada: '7219.33.01',
    nicoDeclarado: '99',
    detalleTecnico:
      'La fracción declarada 7219.33.01 aplica a espesores de 1 mm a 3 mm. La ficha técnica analizada acredita un espesor calibrado de 0.90 mm (rango 0.5 a 1.0 mm de la partida 7219.34.01).',
    usaResultadoPrincipal: true,
  },
  {
    secuencia: 2,
    descripcion: 'Fleje inox 304 laminado en frío, calibre 0.60 mm',
    fraccionDeclarada: '7219.34.01',
    nicoDeclarado: '01',
    detalleTecnico:
      'Coincidencia dimensional y de aleación con las especificaciones de la subpartida 7219.34.',
    usaResultadoPrincipal: false,
    motorFijo: { fraccion: '7219.34.01', nico: '01' },
  },
];

const OPCIONES_OBSERVACION = [
  {
    id: 'rectificacion' as const,
    titulo: 'Solicitar rectificación de pedimento (R1)',
    consecuencia:
      'El agente aduanal deberá tramitar la rectificación de la fracción arancelaria antes de la modulación.',
  },
  {
    id: 'documentacion' as const,
    titulo: 'Requerir certificado de calibre y prueba de laboratorio',
    consecuencia:
      'Se abre incidencia documental hasta comprobar la tolerancia dimensional del lote importado.',
  },
  {
    id: 'turnar' as const,
    titulo: 'Turnar a mesa de glosa y control aduanero central',
    consecuencia:
      'Pasa a revisión de la Dirección Nacional de Aranceles sin frenar el despacho de las partidas conformes.',
  },
];

// Formateador de 15 dígitos con separación de campos aduanales
const formatearPedimento15 = (num: string): string => {
  const limpio = num.replace(/\D/g, '');
  if (limpio.length === 15) {
    return `${limpio.slice(0, 2)}  ${limpio.slice(2, 4)}  ${limpio.slice(4, 8)}  ${limpio.slice(8, 15)}`;
  }
  return num;
};

const separarFraccion = (texto: string) => {
  const fraccion = texto.match(/\d{4}\.\d{2}\.\d{2}/)?.[0] ?? '7219.34.01';
  const nico = texto.match(/NICO\s*(\d{2})/i)?.[1] ?? '01';
  return { fraccion, nico };
};

export const AuditoriaPedimentoView: React.FC<AuditoriaPedimentoViewProps> = ({
  fraccionMotor = '7219.34.01 — NICO 01',
  onConfirmarConformidad,
  onEmitirObservacion,
  onVolver,
}) => {
  const [modoObservacion, setModoObservacion] = useState<boolean>(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<ObservacionAuditoria['tipo']>('rectificacion');
  const [notaObservacion, setNotaObservacion] = useState<string>('');

  const partidasComparadas = useMemo(() => {
    const motorPrincipal = separarFraccion(fraccionMotor);
    return PARTIDAS_BASE.map((partida) => {
      const motor = partida.usaResultadoPrincipal ? motorPrincipal : partida.motorFijo!;
      const coincide =
        partida.fraccionDeclarada === motor.fraccion && partida.nicoDeclarado === motor.nico;
      return {
        ...partida,
        motor,
        coincide,
      };
    });
  }, [fraccionMotor]);

  const hayDiscrepancia = partidasComparadas.some((p) => !p.coincide);

  const handleEmitirObservacion = () => {
    const opcion = OPCIONES_OBSERVACION.find((o) => o.id === tipoSeleccionado) || OPCIONES_OBSERVACION[0];
    onEmitirObservacion({
      tipo: opcion.id,
      titulo: opcion.titulo,
      partidasObservadas: partidasComparadas.filter((p) => !p.coincide).map((p) => p.secuencia),
      nota: notaObservacion.trim() || 'Discrepancia de rango dimensional entre fracción 7219.33 y 7219.34 detectada en auditoría cruzada.',
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        
        {/* Cabecera de la etapa */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#e2e8f0]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#dc2626]">
              Control Arancelario en Despacho
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#0f172a] mt-0.5">
              Auditoría Cruzada de Pedimento vs. Dictamen
            </h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              Cotejo automatizado entre los datos declarados en el pedimento y la determinación técnica de la mercancía.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-[#475569] bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1.5 rounded-full">
              Protocolo: Anexo 22 LIGIE
            </span>
          </div>
        </div>

        {/* 1. ENCABEZADO DEL PEDIMENTO */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#e2e8f0]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0f172a] block">
                Declaración Aduanera de Importación
              </span>
              <span className="text-[11px] text-[#64748b]">
                Régimen Definitivo • Verificación Física y Documental
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-[#64748b] block">
                Número de Pedimento (15 dígitos):
              </span>
              <span className="text-sm sm:text-base font-mono font-bold text-[#0f172a] tracking-widest bg-white border border-[#cbd5e1] px-2.5 py-0.5 rounded-lg">
                {formatearPedimento15(DATOS_PEDIMENTO.numero15Digitos)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#64748b] block text-[11px]">Aduana:</span>
              <span className="font-semibold text-[#0f172a] block mt-0.5">
                {DATOS_PEDIMENTO.aduana}
              </span>
            </div>

            <div>
              <span className="text-[#64748b] block text-[11px]">Clave de Pedimento:</span>
              <span className="font-semibold text-[#0f172a] block mt-0.5">
                {DATOS_PEDIMENTO.clave}
              </span>
            </div>

            <div>
              <span className="text-[#64748b] block text-[11px]">Proveedor Extranjero:</span>
              <span className="font-semibold text-[#0f172a] block mt-0.5 truncate" title={DATOS_PEDIMENTO.proveedor}>
                {DATOS_PEDIMENTO.proveedor}
              </span>
            </div>

            <div>
              <span className="text-[#64748b] block text-[11px]">Importador Nacional:</span>
              <span className="font-semibold text-[#0f172a] block mt-0.5 truncate" title={DATOS_PEDIMENTO.importador}>
                {DATOS_PEDIMENTO.importador}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TABLA DE COMPARATIVA TANGIBLE (FILAS ESTRUCTURADAS) */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Comparativa de Partidas Declaradas vs. Motor
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {partidasComparadas.length} partidas analizadas
            </span>
          </div>

          {/* Encabezados de columnas (visible en desktop) */}
          <div className="hidden lg:grid grid-cols-12 gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600">
            <div className="col-span-3">Secuencia y Descripción</div>
            <div className="col-span-2">Declarado en Pedimento</div>
            <div className="col-span-2">Determinado por Motor</div>
            <div className="col-span-5">Estado y Diagnóstico</div>
          </div>

          {/* Filas estructuradas con borde limpio */}
          <div className="space-y-3">
            {partidasComparadas.map((partida) => (
              <div
                key={partida.secuencia}
                className={`p-4 rounded-xl border transition-all ${
                  partida.coincide
                    ? 'border-slate-200 bg-white hover:border-slate-300'
                    : 'border-amber-200 bg-amber-50/30'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                  
                  {/* Columna 1: Secuencia de Partida y Descripción del Pedimento */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-mono text-[11px] font-bold text-slate-700">
                        {partida.secuencia}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Partida {partida.secuencia}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1.5 font-medium leading-relaxed">
                      {partida.descripcion}
                    </p>
                  </div>

                  {/* Columna 2: Fracción y NICO Declarados en Pedimento */}
                  <div className="lg:col-span-2">
                    <span className="lg:hidden text-[11px] text-slate-400 block font-semibold">
                      Declarado en Pedimento:
                    </span>
                    <div className="font-mono text-xs sm:text-sm font-bold text-slate-900">
                      {partida.fraccionDeclarada} - {partida.nicoDeclarado}
                    </div>
                    <span className="text-[11px] text-slate-500">Fracción del pedimento</span>
                  </div>

                  {/* Columna 3: Fracción Determinada por el Motor */}
                  <div className="lg:col-span-2">
                    <span className="lg:hidden text-[11px] text-slate-400 block font-semibold">
                      Determinado por Motor:
                    </span>
                    <div className="font-mono text-xs sm:text-sm font-bold text-blue-600">
                      {partida.motor.fraccion} - {partida.motor.nico}
                    </div>
                    <span className="text-[11px] text-blue-600/80">Dictamen del motor</span>
                  </div>

                  {/* Columna 4: Estado del Semáforo y Alerta de Discrepancia */}
                  <div className="lg:col-span-5 space-y-1.5">
                    {partida.coincide ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>Partida Conforme</span>
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="inline-flex items-start gap-1.5 text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 flex-shrink-0 mt-1" />
                          <span>
                            Posible Discrepancia de Clasificación: El espesor declarado no coincide con el rango de la fracción.
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed pl-1">
                          {partida.detalleTecnico}
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario de Observación de Discrepancia (Desplegable) */}
        {modoObservacion && (
          <div className="p-5 bg-amber-50/50 border border-amber-200 rounded-xl space-y-4">
            <div>
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wide block">
                Emitir Observación Oficial de Discrepancia Arancelaria
              </span>
              <p className="text-xs text-amber-900/80 mt-0.5">
                Seleccione la vía de resolución procedimental para las partidas con conflicto arancelario:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {OPCIONES_OBSERVACION.map((op) => {
                const activo = tipoSeleccionado === op.id;
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => setTipoSeleccionado(op.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      activo
                        ? 'border-blue-600 bg-white ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block">{op.titulo}</span>
                    <span className="text-[11px] text-slate-500 mt-1 block leading-tight">
                      {op.consecuencia}
                    </span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1" htmlFor="nota-auditoria">
                Nota u observación técnica complementaria:
              </label>
              <textarea
                id="nota-auditoria"
                rows={2}
                value={notaObservacion}
                onChange={(e) => setNotaObservacion(e.target.value)}
                placeholder="Indique los detalles para la notificación al agente aduanal..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setModoObservacion(false)}
                className="px-4 py-2 border border-slate-300 text-xs font-medium text-slate-700 rounded-lg bg-white hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleEmitirObservacion}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Registrar y Emitir Observación Oficial
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. ACCIONES DE CIERRE DE AUDITORÍA */}
        {/* ========================================================================= */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onVolver}
            className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl transition-colors"
          >
            ← Volver a Dictamen
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Botón para Emitir Observación de Discrepancia Arancelaria */}
            <button
              type="button"
              onClick={() => {
                if (!modoObservacion) {
                  setModoObservacion(true);
                } else {
                  handleEmitirObservacion();
                }
              }}
              className={`w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-xl transition-all border ${
                hayDiscrepancia
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Emitir Observación de Discrepancia Arancelaria
            </button>

            <button
              type="button"
              onClick={onConfirmarConformidad}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#dc2626] text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-[#b91c1c] shadow-xs transition-colors cursor-pointer"
            >
              Confirmar conformidad →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuditoriaPedimentoView;
