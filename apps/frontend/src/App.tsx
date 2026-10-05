import React, { useState } from 'react';
import AppShell, { DatosSimulados } from './components/layout/AppShell';
import LoginView from './components/auth/LoginView';
import IngestaView from './components/workflow/IngestaView';
import VisorDocumento from './components/workflow/VisorDocumento';
import FormularioAtributos from './components/workflow/FormularioAtributos';
import PreguntaDecisiva from './components/workflow/PreguntaDecisiva';
import RankingView from './components/workflow/RankingView';
import AuditoriaPedimentoView, { ObservacionAuditoria } from './components/workflow/AuditoriaPedimentoView';
import DictamenFinalView from './components/workflow/DictamenFinalView';

export default function App() {
  // 1. Estado Reactivo Central (Simulado)
  const [pasoActual, setPasoActual] = useState<number>(0);
  const [tipoDocumento, setTipoDocumento] = useState<'ficha' | 'pedimento'>('ficha');
  const [qwenActivo, setQwenActivo] = useState<boolean>(true);
  const [layaActivo, setLayaActivo] = useState<boolean>(true);
  const [evidenciaHovered, setEvidenciaHovered] = useState<string | null>(null);
  const [observacionAuditoria, setObservacionAuditoria] = useState<ObservacionAuditoria | null>(null);

  // Datos simulados de la ficha técnica de acero
  const [datosSimulados, setDatosSimulados] = useState<DatosSimulados>({
    material: 'Lámina rolada en frío inox 304',
    tipoProducto: 'Bobina laminada en frío',
    espesor: '0.90 mm',
    norma: 'ASTM A240 / Grado 304',
    origen: 'Extracción Determinista + Ficha Técnica PDF',
    confianzaOcr: 0.996,
    fraccionSugerida: '7219.34.01 — NICO 01',
    descripcionArancelaria:
      'Productos laminados planos de acero inoxidable, de anchura superior o igual a 600 mm, simplemente laminados en frío, de espesor superior a 0.5 mm pero inferior a 1 mm.',
    pesoNeto: '24,500 kg',
    unidadMedida: 'Kilogramo (kg)',
    paisOrigen: 'México',
  });

  const reiniciarFlujo = () => {
    setPasoActual(0);
    setTipoDocumento('ficha');
    setObservacionAuditoria(null);
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
                fraccionSugerida: '7219.34.01',
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
                fraccionSugerida: '7219.34.01',
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
                fraccionSugerida: '7219.34.01',
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
                fraccionSugerida: '7219.34.01',
                descripcionArancelaria:
                  'Productos laminados planos de acero inoxidable, simplemente laminados en frío',
              }));
              setPasoActual(6);
            }
          }}
        />
      )}

      {/* VISTA 2: VALIDACIÓN DE ATRIBUTOS TÉCNICOS (DISTRIBUCIÓN 45% VISOR / 55% ATRIBUTOS) */}
      {pasoActual === 2 && (
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Encabezado de la etapa */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-black/[0.12] rounded-[14px] px-5 py-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-black leading-tight">
                Validación de Atributos Extraídos
              </h2>
              <p className="text-xs text-black/[0.4] mt-0.5">
                Pase el cursor sobre los datos o la ficha física para verificar la evidencia de extracción.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-[10px]">
                Densidad OCR Óptima: {(datosSimulados.confianzaOcr * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Grid de 2 Columnas: 45% Izquierdo (Visor de Hoja Física) y 55% Derecho (Atributos) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* 45% IZQUIERDO: VISOR DE LA HOJA TÉCNICA FÍSICA */}
            <div className="lg:col-span-5 h-[680px]">
              <VisorDocumento
                nombreArchivo="Ficha_Tecnica_Aceros_304.pdf"
                highlightedField={evidenciaHovered}
                onHoverEvidence={setEvidenciaHovered}
              />
            </div>

            {/* 55% DERECHO: PANEL DE ATRIBUTOS TÉCNICOS EXTRACTADOS */}
            <div className="lg:col-span-7">
              <FormularioAtributos
                highlightedField={evidenciaHovered}
                onHoverField={setEvidenciaHovered}
                qwenActivo={qwenActivo}
                layaActivo={layaActivo}
                onVolver={() => setPasoActual(1)}
                onConfirmar={(atributos) => {
                  setDatosSimulados((prev) => ({
                    ...prev,
                    material: atributos.material,
                    tipoProducto: atributos.forma,
                    espesor: `${atributos.espesor.toFixed(2)} mm`,
                    norma: atributos.norma,
                  }));
                  setPasoActual(3);
                }}
              />
            </div>

          </div>

        </div>
      )}

      {/* VISTA 3: PREGUNTA DECISIVA (DESAMBIGUACIÓN ARANCELARIA) */}
      {pasoActual === 3 && (
        <PreguntaDecisiva
          confianzaActual={datosSimulados.confianzaOcr < 0.99 ? datosSimulados.confianzaOcr : 0.865}
          onVolver={() => setPasoActual(2)}
          onRespuestaRegistrada={(respuesta) => {
            setDatosSimulados((prev) => ({
              ...prev,
              fraccionSugerida: respuesta.subpartidaEfecto,
              confianzaOcr: respuesta.nuevaConfianza,
              descripcionArancelaria:
                respuesta.id === 'enrollado'
                  ? 'Productos laminados planos de acero inoxidable, de anchura superior o igual a 600 mm, simplemente laminados en frío, de espesor superior a 0.5 mm pero inferior o igual a 1 mm (en bobinas)'
                  : respuesta.id === 'hojas_cortadas'
                  ? 'Los demás productos laminados planos de acero inoxidable, de anchura superior o igual a 600 mm, cortados en hojas'
                  : 'Productos laminados planos de acero inoxidable (clasificación residual)',
            }));
            setPasoActual(4);
          }}
        />
      )}

      {/* VISTA 4: DICTAMEN / RANKING ARANCELARIO */}
      {pasoActual === 4 && (
        <RankingView
          fraccion={
            datosSimulados.fraccionSugerida.includes('NICO')
              ? datosSimulados.fraccionSugerida
              : `${datosSimulados.fraccionSugerida} — NICO 01`
          }
          confianza={datosSimulados.confianzaOcr > 0.95 ? datosSimulados.confianzaOcr : 0.996}
          onVolver={() => setPasoActual(3)}
          onAprobar={(datos) => {
            setDatosSimulados((prev) => ({
              ...prev,
              fraccionSugerida: datos.fraccion,
              confianzaOcr: datos.confianza,
            }));
            setPasoActual(5);
          }}
          onCorregirManual={(motivo, fraccionCorregida) => {
            setDatosSimulados((prev) => ({
              ...prev,
              fraccionSugerida: fraccionCorregida,
              confianzaOcr: 1.0,
            }));
            setPasoActual(5);
          }}
        />
      )}

      {/* VISTA 5: AUDITORÍA DE PEDIMENTO */}
      {pasoActual === 5 && (
        <AuditoriaPedimentoView
          fraccionMotor={datosSimulados.fraccionSugerida}
          onVolver={() => setPasoActual(4)}
          onConfirmarConformidad={() => {
            setObservacionAuditoria(null);
            setPasoActual(6);
          }}
          onEmitirObservacion={(observacion) => {
            setObservacionAuditoria(observacion);
            setPasoActual(6);
          }}
        />
      )}

      {/* VISTA 6: DICTAMEN FINAL Y EXPEDIENTE CERTIFICADO */}
      {pasoActual === 6 && (
        <DictamenFinalView
          idCaso="EXP-2026-0419-MX"
          sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
          versionBaseLegal="LIGIE-72-73@2026"
          fraccion={
            datosSimulados.fraccionSugerida.includes('—')
              ? datosSimulados.fraccionSugerida.split('—')[0].trim()
              : datosSimulados.fraccionSugerida
          }
          nico={
            datosSimulados.fraccionSugerida.includes('NICO')
              ? datosSimulados.fraccionSugerida.split('NICO')[1]?.trim() || '01'
              : '01'
          }
          descripcionLegal={datosSimulados.descripcionArancelaria}
          mercancia={`${datosSimulados.material} (${datosSimulados.tipoProducto}, espesor ${datosSimulados.espesor})`}
          firmante="Diego Ramírez (Clasificador Aduanal)"
          observacionAuditoria={observacionAuditoria}
          onNuevoDocumento={reiniciarFlujo}
          onVolver={() => setPasoActual(5)}
        />
      )}
    </AppShell>
  );
}
