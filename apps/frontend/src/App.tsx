import React, { useState } from 'react';
import AppShell, { DatosSimulados } from './components/layout/AppShell';
import LoginView from './components/auth/LoginView';
import IngestaView from './components/workflow/IngestaView';

export default function App() {
  // 1. Estado Reactivo Central (Simulado)
  const [pasoActual, setPasoActual] = useState<number>(0);
  const [tipoDocumento, setTipoDocumento] = useState<'ficha' | 'pedimento'>('ficha');
  const [qwenActivo, setQwenActivo] = useState<boolean>(true);
  const [layaActivo, setLayaActivo] = useState<boolean>(true);

  // Datos simulados de la ficha técnica de acero
  const [datosSimulados, setDatosSimulados] = useState<DatosSimulados>({
    material: 'Acero aleado al boro',
    tipoProducto: 'Barras laminadas en caliente de sección circular',
    espesor: '12.5 mm',
    norma: 'ASTM A514 Gr. B',
    origen: 'Extracción OCR + Ficha Técnica PDF',
    confianzaOcr: 0.992,
    fraccionSugerida: '7228.30.00.00',
    descripcionArancelaria: 'Barras de los demás aceros aleados; barras simplemente laminadas o extrudidas en caliente',
    pesoNeto: '24,500 kg',
    unidadMedida: 'Kilogramo (kg)',
    paisOrigen: 'Alemania',
  });

  const reiniciarFlujo = () => {
    setPasoActual(0);
    setTipoDocumento('ficha');
  };

  return (
    <AppShell
      pasoActual={pasoActual}
      setPasoActual={setPasoActual}
      tipoDocumento={tipoDocumento}
      setTipoDocumento={setTipoDocumento}
      qwenActivo={qwenActivo}
      setQwenActivo={setQwenActivo}
      layaActivo={layaActivo}
      setLayaActivo={setLayaActivo}
      datosSimulados={datosSimulados}
      onReset={reiniciarFlujo}
    >
      {/* VISTA 0: INICIO DE SESIÓN */}
      {pasoActual === 0 && (
        <LoginView
          onSuccess={() => {
            setPasoActual(1);
          }}
        />
      )}

      {/* VISTA 1: INGESTA DE DOCUMENTO */}
      {pasoActual === 1 && (
        <IngestaView
          tipoDocumento={tipoDocumento}
          setTipoDocumento={setTipoDocumento}
          onDocumentoCargado={(detalles) => {
            if (detalles.tipo === 'pedimento') {
              setDatosSimulados((prev) => ({
                ...prev,
                material: 'Láminas de acero inoxidable austenítico',
                tipoProducto: 'Rollos laminados en frío, espesor 1.5 mm',
                espesor: '1.5 mm',
                norma: 'ASTM A240 / Grado 304',
                origen: 'Pedimento Aduanal de Importación (SHA-256 Validado)',
                fraccionSugerida: '7219.34.00.00',
                descripcionArancelaria:
                  'Productos laminados planos de acero inoxidable, de anchura superior o igual a 600 mm, simplemente laminados en frío, de espesor superior a 1 mm pero inferior a 3 mm',
              }));
              setPasoActual(2);
            } else {
              setDatosSimulados((prev) => ({
                ...prev,
                material: 'Rollo de acero inoxidable 304',
                tipoProducto: 'Productos laminados planos en frío',
                espesor: '1.5 mm',
                norma: 'ASTM A240',
                origen: 'Ficha Técnica de Fabricante (SHA-256 Validado)',
                fraccionSugerida: '7219.34.00.00',
                descripcionArancelaria:
                  'Productos laminados planos de acero inoxidable, de anchura superior o igual a 600 mm, simplemente laminados en frío',
              }));
              setPasoActual(2);
            }
          }}
          onExcepcionResuelta={(tipoExcepcion, datos) => {
            if (tipoExcepcion === 'ocr_error' && datos) {
              setDatosSimulados((prev) => ({
                ...prev,
                material: datos.material || 'Acero inoxidable austenítico (AISI 304)',
                tipoProducto: datos.presentacion || 'Rollo laminado en frío',
                espesor: datos.espesor || '1.5 mm',
                origen: 'Captura Manual Guiada (Excepción OCR)',
                confianzaOcr: 0.999,
                fraccionSugerida: '7219.34.00.00',
              }));
              setPasoActual(2);
            } else if (tipoExcepcion === 'fuera_alcance') {
              setDatosSimulados((prev) => ({
                ...prev,
                material: 'Maquinaria industrial fuera de Capítulos 72/73',
                tipoProducto: 'Aparato mecánico con función propia',
                espesor: 'No aplicable',
                origen: 'Reorientación por Nota 1 Cap. 72 / Nota 1(f) Secc. XV',
                fraccionSugerida: '8479.89.90.00',
                descripcionArancelaria:
                  'Máquinas y aparatos con función propia no expresados ni comprendidos en otra parte del Capítulo 84',
              }));
              setPasoActual(4);
            } else if (tipoExcepcion === 'reuso') {
              setDatosSimulados((prev) => ({
                ...prev,
                material: 'Rollo de acero inoxidable 304',
                tipoProducto: 'Productos laminados planos en frío',
                espesor: '1.5 mm',
                norma: 'ASTM A240',
                origen: 'Precedente Aprobado (Dictamen 2026-0142)',
                fraccionSugerida: '7219.34.00.00',
                descripcionArancelaria:
                  'Productos laminados planos de acero inoxidable, simplemente laminados en frío',
              }));
              setPasoActual(6);
            }
          }}
        />
      )}

      {/* VISTA 2: VALIDACIÓN DE ATRIBUTOS TÉCNICOS */}
      {pasoActual === 2 && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white border border-black/[0.12] rounded-[18px] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-black">
                  Validación de Atributos Extraídos
                </h2>
                <p className="text-xs text-black/[0.4] mt-1">
                  Confirme los datos técnicos antes de realizar la clasificación arancelaria.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-[10px]">
                  Confianza OCR: {(datosSimulados.confianzaOcr * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Hoja física tangible de datos */}
            <div className="bg-white border border-black/[0.12] rounded-[10px] p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-black/[0.7] mb-1">
                    Material declarado
                  </label>
                  <div className="p-2.5 bg-black/[0.02] border border-black/[0.12] rounded-[10px] text-xs font-semibold text-black flex items-center justify-between">
                    <span>{datosSimulados.material}</span>
                    <span className="text-[10px] text-emerald-800 font-normal">Verificado</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-black/[0.7] mb-1">
                    Tipo de producto / forma
                  </label>
                  <div className="p-2.5 bg-black/[0.02] border border-black/[0.12] rounded-[10px] text-xs font-semibold text-black flex items-center justify-between">
                    <span>{datosSimulados.tipoProducto}</span>
                    <span className="text-[10px] text-emerald-800 font-normal">Normalizado (Qwen)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-black/[0.7] mb-1">
                    Espesor / Dimensión
                  </label>
                  <div className="p-2.5 bg-black/[0.02] border border-black/[0.12] rounded-[10px] text-xs font-semibold text-black flex items-center justify-between">
                    <span>{datosSimulados.espesor}</span>
                    <span className="text-[10px] text-emerald-800 font-normal">Conforme</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-black/[0.7] mb-1">
                    Norma técnica internacional
                  </label>
                  <div className="p-2.5 bg-black/[0.02] border border-black/[0.12] rounded-[10px] text-xs font-semibold text-black flex items-center justify-between">
                    <span>{datosSimulados.norma}</span>
                    <span className="text-[10px] text-emerald-800 font-normal">Vigente</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs text-black/[0.6]">
                <span>Origen de datos: {datosSimulados.origen}</span>
                <span>País de origen: {datosSimulados.paisOrigen}</span>
              </div>
            </div>

            {/* Acciones de paso */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-black/[0.08]">
              <button
                type="button"
                onClick={() => setPasoActual(1)}
                className="px-4 py-2 border border-black/[0.12] hover:border-black/[0.3] text-black text-xs font-medium rounded-[10px] transition-colors"
              >
                ← Volver a Ingesta
              </button>
              <button
                type="button"
                onClick={() => setPasoActual(3)}
                className="px-5 py-2.5 bg-[#2563eb] text-white text-xs font-medium rounded-[10px] hover:opacity-90 transition-opacity"
              >
                Confirmar y Pasar a Evaluación →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 3: PREGUNTA DECISIVA (FORMULARIO: ELEGIR, NO TECLEAR) */}
      {pasoActual === 3 && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white border border-black/[0.12] rounded-[18px] p-6 sm:p-8">
            <div className="mb-6">
              <span className="text-[11px] font-semibold text-[#2563eb] uppercase tracking-wider">
                Pregunta de Clasificación
              </span>
              <h2 className="text-base sm:text-lg font-semibold text-black mt-1">
                ¿El proceso de conformado de las barras incluye deformación plástica en frío posterior?
              </h2>
              <p className="text-xs text-black/[0.4] mt-1">
                Esta distinción determina la subpartida arancelaria correspondiente en el Capítulo 72.
              </p>
            </div>

            {/* Opciones con consecuencias directas */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => setPasoActual(4)}
                className="w-full p-4 rounded-[10px] border border-black/[0.12] hover:border-[#2563eb] bg-white text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm text-black group-hover:text-[#2563eb]">
                    No, son simplemente laminadas o extruidas en caliente
                  </div>
                  <span className="text-xs text-black/[0.4]">Subpartida 7228.30</span>
                </div>
                <div className="text-xs text-black/[0.6] mt-1">
                  Consecuencia: Aplica arancel base del 0% según acuerdo de asociación con la UE.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPasoActual(4)}
                className="w-full p-4 rounded-[10px] border border-black/[0.12] hover:border-[#2563eb] bg-white text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm text-black group-hover:text-[#2563eb]">
                    Sí, tienen acabado o conformado en frío
                  </div>
                  <span className="text-xs text-black/[0.4]">Subpartida 7228.50</span>
                </div>
                <div className="text-xs text-black/[0.6] mt-1">
                  Consecuencia: Requiere certificado adicional de tolerancias dimensionales.
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-black/[0.08]">
              <button
                type="button"
                onClick={() => setPasoActual(2)}
                className="px-4 py-2 border border-black/[0.12] text-black text-xs font-medium rounded-[10px]"
              >
                ← Volver a Validación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 4: DICTAMEN / RANKING ARANCELARIO */}
      {pasoActual === 4 && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white border border-black/[0.12] rounded-[18px] p-6 sm:p-8">
            <div className="mb-6">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-[10px]">
                Dictamen Técnico Determinado
              </span>
              <h2 className="text-base sm:text-lg font-semibold text-black mt-3">
                Fracción Arancelaria Determinada
              </h2>
              <div className="mt-2 p-4 bg-black/[0.02] border border-black/[0.12] rounded-[10px]">
                <div className="text-2xl font-bold text-[#2563eb] font-mono">
                  {datosSimulados.fraccionSugerida}
                </div>
                <p className="text-xs text-black/[0.7] mt-1">
                  {datosSimulados.descripcionArancelaria}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-black/[0.7] mb-6">
              <div className="flex justify-between py-1.5 border-b border-black/[0.06]">
                <span>Fundamento Legal:</span>
                <span className="font-semibold text-black">Reglas Generales 1 y 6 de la Nomenclatura</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-black/[0.06]">
                <span>Arancel Ad-Valorem:</span>
                <span className="font-semibold text-black">0.0 %</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-black/[0.06]">
                <span>Restricciones No Arancelarias:</span>
                <span className="font-semibold text-emerald-800">Ninguna requerida</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-black/[0.08]">
              <button
                type="button"
                onClick={() => setPasoActual(3)}
                className="px-4 py-2 border border-black/[0.12] text-black text-xs font-medium rounded-[10px]"
              >
                ← Reevaluar
              </button>
              <button
                type="button"
                onClick={() => setPasoActual(5)}
                className="px-5 py-2.5 bg-[#2563eb] text-white text-xs font-medium rounded-[10px] hover:opacity-90"
              >
                Ver Auditoría de Pedimento →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 5: AUDITORÍA DE PEDIMENTO */}
      {pasoActual === 5 && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white border border-black/[0.12] rounded-[18px] p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-black">
                Auditoría Cruzada: Pedimento vs. Ficha Técnica
              </h2>
              <p className="text-xs text-black/[0.4] mt-1">
                Contraste directo entre los datos de la declaración y el dictamen técnico.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 border border-black/[0.12] rounded-[10px] bg-white">
                <div className="text-xs font-semibold text-black/[0.6] mb-2 uppercase tracking-wide">
                  Declarado en Pedimento
                </div>
                <div className="text-sm font-mono font-bold text-black">7228.30.00.00</div>
                <div className="text-xs text-black/[0.6] mt-1">Barras de acero aleado laminadas en caliente</div>
              </div>

              <div className="p-4 border border-emerald-300 rounded-[10px] bg-emerald-50/[0.5]">
                <div className="text-xs font-semibold text-emerald-800 mb-2 uppercase tracking-wide">
                  Resultado de Evaluación Técnica
                </div>
                <div className="text-sm font-mono font-bold text-emerald-900">7228.30.00.00</div>
                <div className="text-xs text-emerald-800 mt-1">Coincidencia exacta sin discrepancias arancelarias</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-black/[0.08]">
              <button
                type="button"
                onClick={() => setPasoActual(4)}
                className="px-4 py-2 border border-black/[0.12] text-black text-xs font-medium rounded-[10px]"
              >
                ← Volver a Dictamen
              </button>
              <button
                type="button"
                onClick={() => setPasoActual(6)}
                className="px-5 py-2.5 bg-[#2563eb] text-white text-xs font-medium rounded-[10px] hover:opacity-90"
              >
                Generar Expediente Final →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 6: EXPEDIENTE FINAL */}
      {pasoActual === 6 && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white border border-black/[0.12] rounded-[18px] p-6 sm:p-8 text-center">
            {/* Hoja física tangible de expediente */}
            <div className="w-16 h-20 mx-auto bg-white border border-black/[0.15] rounded-[6px] flex flex-col p-2.5 justify-between mb-4 shadow-none">
              <div className="w-6 h-1 bg-[#2563eb] rounded" />
              <div className="space-y-1">
                <div className="w-full h-0.5 bg-black/[0.2]" />
                <div className="w-full h-0.5 bg-black/[0.2]" />
                <div className="w-3/4 h-0.5 bg-black/[0.2]" />
              </div>
              <div className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-300 mx-auto flex items-center justify-center text-[8px] text-emerald-800 font-bold">
                ✓
              </div>
            </div>

            <h2 className="text-lg font-semibold text-black">
              Expediente Arancelario Certificado
            </h2>
            <p className="text-xs text-black/[0.6] mt-1 max-w-md mx-auto">
              El dictamen técnico para la mercancía <strong>{datosSimulados.material}</strong> ({datosSimulados.fraccionSugerida}) ha sido registrado con validez institucional.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={reiniciarFlujo}
                className="px-5 py-2.5 bg-[#2563eb] text-white text-xs font-medium rounded-[10px] hover:opacity-90"
              >
                Iniciar Nueva Clasificación
              </button>
              <button
                type="button"
                onClick={() => setPasoActual(1)}
                className="px-4 py-2.5 border border-black/[0.12] text-black text-xs font-medium rounded-[10px] hover:border-black/[0.3]"
              >
                Volver a Ingesta
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
