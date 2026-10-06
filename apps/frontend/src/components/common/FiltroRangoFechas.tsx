import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface RangoFechas {
  desde: Date | null;
  hasta: Date | null;
  preset?: string;
}

export interface FiltroRangoFechasProps {
  rango: RangoFechas;
  onChange: (nuevoRango: RangoFechas) => void;
  className?: string;
  placeholder?: string;
  posicion?: 'left' | 'right';
}

const PRESETS = [
  { id: 'this_week', label: 'Esta semana' },
  { id: 'last_week', label: 'Semana pasada' },
  { id: 'this_month', label: 'Este mes' },
  { id: 'this_year', label: 'Este año' },
  { id: 'last_year', label: 'Año pasado' },
  { id: 'all_time', label: 'Todo el historial' },
];

const NOMBRES_MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DIAS_SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export const FiltroRangoFechas: React.FC<FiltroRangoFechasProps> = ({
  rango,
  onChange,
  className = '',
  placeholder = 'Filtrar por fecha',
  posicion = 'right',
}) => {
  const [abierto, setAbierto] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Mes base mostrado en el primer calendario (año y mes)
  const fechaBase = rango.desde || new Date();
  const [añoVista, setAñoVista] = useState<number>(fechaBase.getFullYear());
  const [mesVista, setMesVista] = useState<number>(fechaBase.getMonth());

  // Estado temporal de selección manual
  const [seleccionTemporal, setSeleccionTemporal] = useState<{ desde: Date | null; hasta: Date | null }>({
    desde: rango.desde,
    hasta: rango.hasta,
  });

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickFuera = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    if (abierto) {
      document.addEventListener('mousedown', handleClickFuera);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickFuera);
    };
  }, [abierto]);

  // Formateador DD/MM/AAAA
  const formatearFecha = (d: Date | null): string => {
    if (!d) return '';
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const año = d.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  // Navegar meses
  const irMesAnterior = () => {
    if (mesVista === 0) {
      setMesVista(11);
      setAñoVista(añoVista - 1);
    } else {
      setMesVista(mesVista - 1);
    }
  };

  const irMesSiguiente = () => {
    if (mesVista === 11) {
      setMesVista(0);
      setAñoVista(añoVista + 1);
    } else {
      setMesVista(mesVista + 1);
    }
  };

  // Calcular preset
  const aplicarPreset = (presetId: string) => {
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);

    let nuevoDesde: Date | null = null;
    let nuevoHasta: Date | null = null;

    if (presetId === 'this_week') {
      const diaSemana = (hoy.getDay() + 6) % 7; // Lunes = 0
      nuevoDesde = new Date(hoy);
      nuevoDesde.setDate(hoy.getDate() - diaSemana);
      nuevoDesde.setHours(0, 0, 0, 0);
      nuevoHasta = new Date(hoy);
    } else if (presetId === 'last_week') {
      const diaSemana = (hoy.getDay() + 6) % 7;
      nuevoHasta = new Date(hoy);
      nuevoHasta.setDate(hoy.getDate() - diaSemana - 1);
      nuevoHasta.setHours(23, 59, 59, 999);
      nuevoDesde = new Date(nuevoHasta);
      nuevoDesde.setDate(nuevoHasta.getDate() - 6);
      nuevoDesde.setHours(0, 0, 0, 0);
    } else if (presetId === 'this_month') {
      nuevoDesde = new Date(hoy.getFullYear(), hoy.getMonth(), 1, 0, 0, 0, 0);
      nuevoHasta = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (presetId === 'this_year') {
      nuevoDesde = new Date(hoy.getFullYear(), 0, 1, 0, 0, 0, 0);
      nuevoHasta = new Date(hoy.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else if (presetId === 'last_year') {
      nuevoDesde = new Date(hoy.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
      nuevoHasta = new Date(hoy.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
    } else if (presetId === 'all_time') {
      nuevoDesde = null;
      nuevoHasta = null;
    }

    onChange({ desde: nuevoDesde, hasta: nuevoHasta, preset: presetId });
    setSeleccionTemporal({ desde: nuevoDesde, hasta: nuevoHasta });
    setAbierto(false);
  };

  // Clic en un día del calendario
  const handleDiaClick = (año: number, mes: number, dia: number) => {
    const fechaClic = new Date(año, mes, dia, 12, 0, 0, 0);

    if (!seleccionTemporal.desde || (seleccionTemporal.desde && seleccionTemporal.hasta)) {
      // Primer clic: definir inicio
      const nuevo = { desde: fechaClic, hasta: null };
      setSeleccionTemporal(nuevo);
    } else {
      // Segundo clic: definir fin
      let inicio = seleccionTemporal.desde;
      let fin = fechaClic;
      if (fechaClic < inicio) {
        fin = inicio;
        inicio = fechaClic;
      }
      inicio.setHours(0, 0, 0, 0);
      fin.setHours(23, 59, 59, 999);

      const resultado = { desde: inicio, hasta: fin, preset: 'custom' };
      setSeleccionTemporal(resultado);
      onChange(resultado);
      setAbierto(false);
    }
  };

  // Limpiar filtro
  const handleLimpiar = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ desde: null, hasta: null, preset: 'all_time' });
    setSeleccionTemporal({ desde: null, hasta: null });
  };

  // Comprobar si dos fechas corresponden al mismo día
  const sonMismoDia = (d1: Date | null, d2: Date | null): boolean => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Renderizar la cuadrícula de un mes (con ancho generoso y diseño idéntico a la referencia)
  const renderizarMes = (
    año: number,
    mes: number,
    mostrarFlechaIzquierda = false,
    mostrarFlechaDerecha = false
  ) => {
    const primerDiaSemana = (new Date(año, mes, 1).getDay() + 6) % 7;
    const totalDias = new Date(año, mes + 1, 0).getDate();
    const hoy = new Date();

    const celdas = [];
    // Espacios previos al día 1
    for (let i = 0; i < primerDiaSemana; i++) {
      celdas.push(<div key={`empty-${i}`} className="h-9 w-full" />);
    }

    // Normalizar fechas seleccionadas para comparación precisa
    const tInicio = seleccionTemporal.desde
      ? new Date(
          seleccionTemporal.desde.getFullYear(),
          seleccionTemporal.desde.getMonth(),
          seleccionTemporal.desde.getDate(),
          0,
          0,
          0,
          0
        ).getTime()
      : null;

    const tFin = seleccionTemporal.hasta
      ? new Date(
          seleccionTemporal.hasta.getFullYear(),
          seleccionTemporal.hasta.getMonth(),
          seleccionTemporal.hasta.getDate(),
          0,
          0,
          0,
          0
        ).getTime()
      : null;

    // Días del mes
    for (let dia = 1; dia <= totalDias; dia++) {
      const fechaDia = new Date(año, mes, dia, 0, 0, 0, 0);
      const tDia = fechaDia.getTime();

      const esInicio = tInicio !== null && tDia === tInicio;
      const esFin = tFin !== null && tDia === tFin;
      const estaEnRango = tInicio !== null && tFin !== null && tDia > tInicio && tDia < tFin;
      const esHoy = sonMismoDia(fechaDia, hoy);

      // Determinación de conectores visuales para el rango
      const tieneRangoCompleto = tInicio !== null && tFin !== null && tInicio !== tFin;

      celdas.push(
        <div key={`day-${dia}`} className="relative h-9 w-full flex items-center justify-center">
          {/* Fondo continuo azul suave para días dentro del rango */}
          {estaEnRango && (
            <div className="absolute inset-0 bg-blue-50 dark:bg-blue-950/60 z-0" />
          )}

          {/* Extensión izquierda o derecha de la barra para inicio/fin */}
          {esInicio && tieneRangoCompleto && (
            <div className="absolute right-0 top-0 bottom-0 left-1/2 bg-blue-50 dark:bg-blue-950/60 z-0" />
          )}
          {esFin && tieneRangoCompleto && (
            <div className="absolute left-0 top-0 bottom-0 right-1/2 bg-blue-50 dark:bg-blue-950/60 z-0" />
          )}

          {/* Botón interactivo del día */}
          <button
            type="button"
            onClick={() => handleDiaClick(año, mes, dia)}
            className={`relative z-10 w-8 h-8 text-xs flex items-center justify-center transition-all cursor-pointer font-medium ${
              esInicio || esFin
                ? 'bg-[#1976d2] text-white rounded-md font-bold shadow-xs hover:bg-[#1565c0]'
                : estaEnRango
                ? 'text-[#1976d2] dark:text-blue-300 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-none'
                : esHoy
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold rounded-md hover:bg-slate-200 dark:hover:bg-slate-700'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md'
            }`}
          >
            {dia}
          </button>
        </div>
      );
    }

    return (
      <div className="w-[260px] sm:w-[280px] shrink-0 space-y-3">
        {/* Cabecera del mes con flechas en los extremos conforme a la referencia */}
        <div className="flex items-center justify-between h-8 px-1">
          {mostrarFlechaIzquierda ? (
            <button
              type="button"
              onClick={irMesAnterior}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer transition-colors"
              title="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-6" />
          )}

          <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 text-center tracking-tight">
            {NOMBRES_MESES[mes]} {año}
          </div>

          {mostrarFlechaDerecha ? (
            <button
              type="button"
              onClick={irMesSiguiente}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer transition-colors"
              title="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-6" />
          )}
        </div>

        {/* Encabezado de días de la semana */}
        <div className="grid grid-cols-7 text-center">
          {DIAS_SEMANA.map((d, idx) => (
            <span
              key={idx}
              className="h-7 w-full text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center justify-center uppercase"
            >
              {d}
            </span>
          ))}
        </div>

        {/* Cuadrícula de días con 7 columnas amplias */}
        <div className="grid grid-cols-7 gap-y-1 text-center">{celdas}</div>
      </div>
    );
  };

  // Calcular segundo mes
  const segundoMes = mesVista === 11 ? 0 : mesVista + 1;
  const segundoAño = mesVista === 11 ? añoVista + 1 : añoVista;

  const tieneRangoActivo = Boolean(rango.desde && rango.hasta);

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      {/* Botón activador (Input Pill exacto a la imagen de referencia) */}
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer shadow-2xs ${
          tieneRangoActivo
            ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-[#2563eb] dark:text-blue-300'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
        }`}
        title="Filtrar por rango de fechas"
      >
        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-mono">
          {tieneRangoActivo
            ? `${formatearFecha(rango.desde)} - ${formatearFecha(rango.hasta)}`
            : placeholder}
        </span>
        {tieneRangoActivo && (
          <span
            onClick={handleLimpiar}
            className="p-0.5 hover:bg-blue-200/60 dark:hover:bg-blue-900/60 rounded-full cursor-pointer ml-1 text-blue-600 dark:text-blue-300"
            title="Limpiar filtro de fechas"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>

      {/* Popover desplegable con doble calendario y accesos rápidos */}
      {abierto && (
        <div
          className={`absolute ${
            posicion === 'right' ? 'right-0' : 'left-0'
          } mt-2 z-50 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-150 w-max max-w-[95vw]`}
        >
          {/* Panel Izquierdo: Atajos de Presets (Idéntico a la referencia) */}
          <div className="w-full md:w-44 p-3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 space-y-1 bg-slate-50/40 dark:bg-slate-900/40 shrink-0">
            {PRESETS.map((p) => {
              const esActivo = rango.preset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => aplicarPreset(p.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    esActivo
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Panel Derecho: Dos meses paralelos con separación nítida */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            <div>{renderizarMes(añoVista, mesVista, true, false)}</div>
            <div className="hidden sm:block border-l border-slate-100 dark:border-slate-800 pl-6 sm:pl-8">
              {renderizarMes(segundoAño, segundoMes, false, true)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltroRangoFechas;
