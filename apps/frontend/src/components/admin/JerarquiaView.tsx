import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  ArrowRightLeft,
  CheckCircle2,
  Sparkles,
  GripVertical,
  ArrowDownToLine,
} from 'lucide-react';
import { Empleado } from './GestionEmpleadosView';

export interface JerarquiaViewProps {
  empleados: Empleado[];
  onActualizarEmpleados: (empleadosActualizados: Empleado[]) => void;
  onVolver?: () => void;
}

export const JerarquiaView: React.FC<JerarquiaViewProps> = ({
  empleados,
  onActualizarEmpleados,
  onVolver,
}) => {
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [empleadoSeleccionadoMover, setEmpleadoSeleccionadoMover] = useState<Empleado | null>(null);
  const [nuevoEncargadoDestino, setNuevoEncargadoDestino] = useState<string>('');

  // Estados para Drag & Drop interactivo de credenciales
  const [idEmpleadoArrastrado, setIdEmpleadoArrastrado] = useState<string | null>(null);
  const [zonaDestinoHover, setZonaDestinoHover] = useState<string | null>(null);

  // 1. Filtrar los niveles de la jerarquía
  const administrador = empleados.find((e) => e.rolJerarquico === 'admin') || empleados[0];
  const encargados = empleados.filter((e) => e.rolJerarquico === 'encargado');
  const empleadosOperativos = empleados.filter((e) => e.rolJerarquico === 'empleado');

  // Empleados que no tienen ningún encargado asignado
  const empleadosSinAsignar = empleadosOperativos.filter((e) => !e.encargadoId);

  // 2. Mover un empleado a otro encargado (o a sin asignar)
  const handleMoverEmpleado = (empleadoId: string, nuevoEncargadoId: string | null) => {
    const empleado = empleados.find((e) => e.id === empleadoId);
    if (!empleado) return;

    const encargadoDestino = encargados.find((enc) => enc.id === nuevoEncargadoId);

    const actualizados = empleados.map((e) => {
      if (e.id === empleadoId) {
        return {
          ...e,
          encargadoId: nuevoEncargadoId,
        };
      }
      return e;
    });

    onActualizarEmpleados(actualizados);
    setEmpleadoSeleccionadoMover(null);

    const textoDestino = encargadoDestino ? encargadoDestino.nombre : 'Personal Disponible (Sin Asignar)';
    setMensajeExito(`✓ ${empleado.nombre} fue reasignado exitosamente al equipo de ${textoDestino}.`);
    setTimeout(() => setMensajeExito(null), 3800);
  };

  // 3. Ascender un empleado para convertirlo en Encargado
  const handleAscenderAEncargado = (empleadoId: string) => {
    const empleado = empleados.find((e) => e.id === empleadoId);
    if (!empleado) return;

    const actualizados = empleados.map((e) => {
      if (e.id === empleadoId) {
        return {
          ...e,
          rolJerarquico: 'encargado' as const,
          cargo: e.cargo.includes('Encargad') ? e.cargo : `Encargado de Equipo (${e.aduana})`,
          encargadoId: administrador.id,
          permisos: {
            ...e.permisos,
            firmaDictamen: true,
          },
        };
      }
      return e;
    });

    onActualizarEmpleados(actualizados);
    setMensajeExito(`👑 ¡${empleado.nombre} fue promovido a Encargado de Equipo! Ahora lidera su propia rama de supervisión.`);
    setTimeout(() => setMensajeExito(null), 3800);
  };

  // 4. Degradar un Encargado para convertirlo en Empleado
  const handleDegradarAEmpleado = (encargadoId: string) => {
    const encargado = empleados.find((e) => e.id === encargadoId);
    if (!encargado) return;

    // Buscar si hay otro encargado disponible para reasignar a sus subordinados
    const otroEncargado = encargados.find((enc) => enc.id !== encargadoId);

    const actualizados = empleados.map((e) => {
      if (e.id === encargadoId) {
        return {
          ...e,
          rolJerarquico: 'empleado' as const,
          cargo: 'Personal Operativo de Clasificación',
          encargadoId: otroEncargado ? otroEncargado.id : null,
        };
      }
      // Reasignar subordinados que dependían de él
      if (e.encargadoId === encargadoId) {
        return {
          ...e,
          encargadoId: otroEncargado ? otroEncargado.id : null,
        };
      }
      return e;
    });

    onActualizarEmpleados(actualizados);
    setMensajeExito(`ℹ️ ${encargado.nombre} fue cambiado a Personal Operativo. Sus colaboradores fueron transferidos.`);
    setTimeout(() => setMensajeExito(null), 3800);
  };

  // ---------------------------------------------------------------------------
  // MANEJADORES DE DRAG AND DROP
  // ---------------------------------------------------------------------------
  const handleDragStart = (e: React.DragEvent, empleadoId: string) => {
    e.dataTransfer.setData('text/plain', empleadoId);
    e.dataTransfer.effectAllowed = 'move';
    setIdEmpleadoArrastrado(empleadoId);
  };

  const handleDragEnd = () => {
    setIdEmpleadoArrastrado(null);
    setZonaDestinoHover(null);
  };

  const handleDragOverZona = (e: React.DragEvent, zonaId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (zonaDestinoHover !== zonaId) {
      setZonaDestinoHover(zonaId);
    }
  };

  const handleDragLeaveZona = (e: React.DragEvent, zonaId: string) => {
    const currentTarget = e.currentTarget;
    if (!currentTarget.contains(e.relatedTarget as Node)) {
      if (zonaDestinoHover === zonaId) {
        setZonaDestinoHover(null);
      }
    }
  };

  const handleDropEnEncargado = (e: React.DragEvent, encargadoId: string) => {
    e.preventDefault();
    setZonaDestinoHover(null);
    const empId = e.dataTransfer.getData('text/plain') || idEmpleadoArrastrado;
    if (!empId) return;

    const emp = empleados.find((item) => item.id === empId);
    if (emp && emp.encargadoId === encargadoId) {
      setIdEmpleadoArrastrado(null);
      return;
    }

    handleMoverEmpleado(empId, encargadoId);
    setIdEmpleadoArrastrado(null);
  };

  const handleDropEnSinAsignar = (e: React.DragEvent) => {
    e.preventDefault();
    setZonaDestinoHover(null);
    const empId = e.dataTransfer.getData('text/plain') || idEmpleadoArrastrado;
    if (!empId) return;

    const emp = empleados.find((item) => item.id === empId);
    if (emp && emp.encargadoId === null) {
      setIdEmpleadoArrastrado(null);
      return;
    }

    handleMoverEmpleado(empId, null);
    setIdEmpleadoArrastrado(null);
  };

  const handleDropEnAdmin = (e: React.DragEvent) => {
    e.preventDefault();
    setZonaDestinoHover(null);
    const empId = e.dataTransfer.getData('text/plain') || idEmpleadoArrastrado;
    if (!empId) return;

    handleAscenderAEncargado(empId);
    setIdEmpleadoArrastrado(null);
  };

  // Renderizador de Credencial Física Draggable
  const renderCredencialDraggable = (emp: Empleado, encargadoActualId?: string | null) => {
    const estaSiendoArrastrado = idEmpleadoArrastrado === emp.id;

    return (
      <div
        key={emp.id}
        draggable={true}
        onDragStart={(e) => handleDragStart(e, emp.id)}
        onDragEnd={handleDragEnd}
        title="Arrastra esta credencial para moverla a otro equipo o soltarla en la bandeja inferior"
        className={`bg-white border rounded-2xl p-3 shadow-2xs transition-all cursor-grab active:cursor-grabbing hover:shadow-md hover:border-[#dc2626]/50 group relative select-none ${
          estaSiendoArrastrado
            ? 'opacity-30 scale-95 border-dashed border-[#dc2626] ring-2 ring-red-300 bg-red-50/20'
            : 'border-slate-200 hover:-translate-y-0.5'
        }`}
      >
        {/* Ranura para cordón institucional (lanyard punch) */}
        <div className="w-8 h-1.5 bg-slate-300/80 rounded-full mx-auto mb-2" />

        {/* Franja superior institucional con manija de arrastre */}
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
            <span className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase">
              CREDENCIAL {emp.id}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 group-hover:text-[#dc2626] transition-colors">
            <GripVertical className="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider hidden sm:inline">
              Arrastrar
            </span>
          </div>
        </div>

        {/* Contenido de la Credencial */}
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-13 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0 shadow-2xs">
            <img
              src={emp.fotoUrl}
              alt={emp.nombre}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
              {emp.nombre}
            </span>
            <span className="text-[10px] text-slate-500 block truncate mt-0.5">
              {emp.cargo}
            </span>
            <span className="text-[9px] font-mono text-slate-400 block truncate mt-0.5">
              {emp.aduana}
            </span>
          </div>
        </div>

        {/* Acciones auxiliares en clic (para máxima accesibilidad) */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={() => {
              setEmpleadoSeleccionadoMover(emp);
              setNuevoEncargadoDestino(encargadoActualId || 'sin_asignar');
            }}
            className="text-[10px] font-semibold text-slate-600 hover:text-[#dc2626] bg-slate-50 hover:bg-red-50 border border-slate-200 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Mover</span>
          </button>

          <button
            type="button"
            onClick={() => handleAscenderAEncargado(emp.id)}
            className="text-[10px] font-semibold text-amber-700 hover:text-amber-900 hover:bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            title="Ascender a Encargado de Equipo"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Ascender</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. ENCABEZADO INSTITUCIONAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Jerarquía Institucional y Asignación de Equipos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-0.5">
            Organigrama visual interactivo en árbol. Arrastre las credenciales de los empleados para distribuirlos entre los encargados, promoverlos o dejarlos en disponibilidad.
          </p>
        </div>

        {onVolver && (
          <button
            type="button"
            onClick={onVolver}
            className="self-start md:self-auto px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Volver al Panel
          </button>
        )}
      </div>

      {/* MENSAJE DE ÉXITO O REASIGNACIÓN */}
      {mensajeExito && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{mensajeExito}</span>
          </div>
          <button
            type="button"
            onClick={() => setMensajeExito(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* BANNER DINÁMICO DE ESTADO DE ARRASTRE */}
      {idEmpleadoArrastrado ? (
        <div className="sticky top-2 z-40 p-3.5 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-between border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-semibold">
              Moviendo credencial de <strong className="text-red-400 underline">{empleados.find((e) => e.id === idEmpleadoArrastrado)?.nombre}</strong>:
              Arrastre y suelte sobre la columna de un Encargado, sobre el Administrador (para ascender) o en la bandeja inferior (para desasignar).
            </span>
          </div>
          <button
            type="button"
            onClick={handleDragEnd}
            className="text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer transition-colors"
          >
            Cancelar Arrastre
          </button>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-600 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-[#dc2626] shrink-0" />
            <span>
              <strong>Arrastre y Suelte Interactivo:</strong> Tome cualquier credencial de empleado con el cursor y suéltela sobre la rama de un Encargado para asignarlo a su equipo, sobre el Administrador para ascenderlo, o en la bandeja inferior para dejarlo disponible.
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 bg-white px-2 py-1 rounded-lg border border-slate-200">
            Modo Arrastre Habilitado
          </span>
        </div>
      )}

      {/* 2. BARRA DE MÉTRICAS RÁPIDAS DEL ORGANIGRAMA */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Cúpula Directiva
          </span>
          <span className="text-lg font-black text-slate-900 mt-0.5 block">1 Administrador</span>
          <span className="text-[11px] text-slate-500">Supervisión total</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
            Mandos Medios
          </span>
          <span className="text-lg font-black text-slate-900 mt-0.5 block">
            {encargados.length} Encargados
          </span>
          <span className="text-[11px] text-slate-500">Equipos operativos</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
            Personal Asignado
          </span>
          <span className="text-lg font-black text-slate-900 mt-0.5 block">
            {empleadosOperativos.length - empleadosSinAsignar.length} Empleados
          </span>
          <span className="text-[11px] text-slate-500">Bajo supervisión</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
            Personal Disponible
          </span>
          <span className="text-lg font-black text-slate-900 mt-0.5 block">
            {empleadosSinAsignar.length} Disponibles
          </span>
          <span className="text-[11px] text-slate-500">Listos para asignar</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. EL ÁRBOL JERÁRQUICO VISUAL (CANVAS DE ORGANIGRAMA)                     */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs overflow-x-auto min-w-full">
        <div className="min-w-[840px] flex flex-col items-center">
          
          {/* ------------------------------------------------------------- */}
          {/* NIVEL 1: ADMINISTRADOR CENTRAL (CÚPULA) - ZONA DROP PROMOCIÓN */}
          {/* ------------------------------------------------------------- */}
          <div className="flex flex-col items-center">
            <div
              onDragOver={(e) => handleDragOverZona(e, 'admin')}
              onDragLeave={(e) => handleDragLeaveZona(e, 'admin')}
              onDrop={handleDropEnAdmin}
              className={`w-80 bg-white border-2 rounded-2xl p-4 transition-all ${
                zonaDestinoHover === 'admin'
                  ? 'border-2 border-dashed border-[#dc2626] bg-red-50 ring-4 ring-red-500/20 shadow-xl scale-105'
                  : idEmpleadoArrastrado
                  ? 'border-dashed border-red-300 hover:border-red-500 shadow-md'
                  : 'border-[#dc2626] shadow-md hover:shadow-lg'
              }`}
            >
              {/* Badge superior */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#dc2626] text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-2xs">
                Nivel 1 • Administración Central
              </div>

              <div className="flex items-center gap-3 mt-1">
                <div className="w-14 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                  <img
                    src={administrador.fotoUrl}
                    alt={administrador.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {administrador.nombre}
                  </h4>
                  <span className="text-[11px] text-slate-600 block leading-tight truncate">
                    {administrador.cargo}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1">
                    {administrador.correo}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Mando Superior
                </span>
                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                  {administrador.aduana}
                </span>
              </div>

              {/* Indicador de soltar para ascender */}
              {zonaDestinoHover === 'admin' && (
                <div className="mt-2.5 py-1.5 px-2 bg-[#dc2626] text-white text-[11px] font-bold rounded-xl text-center shadow-md animate-pulse flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Soltar aquí para promover a Encargado de Equipo</span>
                </div>
              )}
            </div>

            {/* Línea conectora vertical hacia abajo */}
            <div className="w-0.5 h-10 bg-slate-300" />
          </div>

          {/* ------------------------------------------------------------- */}
          {/* LÍNEA HORIZONTAL QUE DISTRIBUYE A LOS ENCARGADOS              */}
          {/* ------------------------------------------------------------- */}
          <div className="w-full relative flex items-center justify-center">
            {/* Barra horizontal que abarca a las columnas de encargados */}
            <div className="w-3/4 h-0.5 bg-slate-300" />
          </div>

          {/* ------------------------------------------------------------- */}
          {/* NIVEL 2: RAMAS DE ENCARGADOS Y SUS EQUIPOS (ZONAS DROP)       */}
          {/* ------------------------------------------------------------- */}
          <div className="grid grid-cols-2 gap-8 w-full mt-0 pt-0">
            {encargados.map((enc) => {
              const subordinados = empleadosOperativos.filter((emp) => emp.encargadoId === enc.id);
              const esZonaHover = zonaDestinoHover === enc.id;

              return (
                <div
                  key={enc.id}
                  onDragOver={(e) => handleDragOverZona(e, enc.id)}
                  onDragLeave={(e) => handleDragLeaveZona(e, enc.id)}
                  onDrop={(e) => handleDropEnEncargado(e, enc.id)}
                  className={`flex flex-col items-center rounded-2xl p-3.5 transition-all ${
                    esZonaHover
                      ? 'bg-red-50/70 ring-4 ring-red-500/25 border-2 border-dashed border-[#dc2626] shadow-xl scale-[1.01]'
                      : idEmpleadoArrastrado
                      ? 'border-2 border-dashed border-amber-300/80 bg-amber-50/20'
                      : 'border-2 border-transparent'
                  }`}
                >
                  {/* Pequeña línea vertical desde la barra horizontal hacia la tarjeta del encargado */}
                  <div className="w-0.5 h-6 bg-slate-300 -mt-3.5 mb-1" />

                  {/* TARJETA DEL ENCARGADO */}
                  <div className="w-full max-w-sm bg-amber-50/40 border-2 border-amber-400/80 rounded-2xl p-4 shadow-sm relative hover:border-amber-500 transition-all">
                    {/* Badge */}
                    <div className="absolute -top-3 left-4 px-3 py-0.5 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-2xs flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Nivel 2 • Encargado de Equipo</span>
                    </div>

                    <div className="flex items-start gap-3 mt-1.5">
                      <div className="w-12 h-14 rounded-xl overflow-hidden border border-amber-200 bg-white shrink-0">
                        <img
                          src={enc.fotoUrl}
                          alt={enc.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {enc.nombre}
                        </h4>
                        <span className="text-[11px] font-medium text-amber-900 block leading-tight truncate">
                          {enc.cargo}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                          {enc.correo}
                        </span>
                      </div>
                    </div>

                    {/* Barra de control del encargado */}
                    <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-700" />
                        <span className="text-xs font-bold text-amber-950">
                          {subordinados.length} {subordinados.length === 1 ? 'Empleado a cargo' : 'Empleados a cargo'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDegradarAEmpleado(enc.id)}
                        className="text-[10px] font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 px-2 py-1 rounded-lg border border-rose-200/60 transition-colors cursor-pointer"
                        title="Quitar rol de encargado y convertir en empleado operativo"
                      >
                        Convertir en Empleado
                      </button>
                    </div>
                  </div>

                  {/* Indicador de soltar sobre este Encargado */}
                  {esZonaHover && (
                    <div className="w-full max-w-sm my-3 py-2.5 px-3 bg-[#dc2626] text-white text-xs font-bold rounded-xl text-center shadow-lg animate-pulse flex items-center justify-center gap-2">
                      <ArrowDownToLine className="w-4 h-4" />
                      <span>Soltar para asignar al equipo de {enc.nombre.split(' ')[0]}</span>
                    </div>
                  )}

                  {/* Línea conectora vertical hacia los empleados subordinados */}
                  <div className="w-0.5 h-6 bg-slate-300" />

                  {/* ----------------------------------------------------------- */}
                  {/* NIVEL 3: EMPLEADOS ASIGNADOS BAJO ESTE ENCARGADO            */}
                  {/* ----------------------------------------------------------- */}
                  <div className="w-full max-w-sm space-y-3">
                    {subordinados.map((sub) => renderCredencialDraggable(sub, enc.id))}

                    {subordinados.length === 0 && (
                      <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center">
                        <span className="text-xs font-semibold text-slate-500 block">
                          Sin empleados asignados actualmente
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Arrastre una credencial aquí para integrarla a este equipo.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* BANDEJA INFERIOR: EMPLEADOS SIN ASIGNAR (ZONA DROP DISPONIBLES)*/}
          {/* ------------------------------------------------------------- */}
          <div
            onDragOver={(e) => handleDragOverZona(e, 'sin_asignar')}
            onDragLeave={(e) => handleDragLeaveZona(e, 'sin_asignar')}
            onDrop={handleDropEnSinAsignar}
            className={`w-full mt-10 pt-6 rounded-2xl p-4 transition-all ${
              zonaDestinoHover === 'sin_asignar'
                ? 'border-2 border-dashed border-rose-500 bg-rose-50/80 ring-4 ring-rose-500/20 shadow-xl scale-[1.01]'
                : idEmpleadoArrastrado
                ? 'border-2 border-dashed border-slate-300 bg-slate-50/50'
                : 'border-t-2 border-dashed border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Personal Operativo Sin Encargado Asignado ({empleadosSinAsignar.length})
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">
                Arrastre credenciales aquí para liberarlas de su encargado
              </span>
            </div>

            {/* Banner si se está soltando sobre la bandeja inferior */}
            {zonaDestinoHover === 'sin_asignar' && (
              <div className="mb-3 py-2.5 px-3 bg-rose-600 text-white text-xs font-bold rounded-xl text-center shadow-lg animate-pulse flex items-center justify-center gap-2">
                <ArrowDownToLine className="w-4 h-4" />
                <span>Soltar aquí para dejar sin encargado (personal disponible)</span>
              </div>
            )}

            {empleadosSinAsignar.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {empleadosSinAsignar.map((emp) => renderCredencialDraggable(emp, null))}
              </div>
            ) : (
              <div className="p-3 bg-emerald-50/60 border border-emerald-200/70 rounded-xl text-center text-xs text-emerald-800 font-medium">
                ✓ Todo el personal operativo se encuentra actualmente distribuido y asignado a un encargado de equipo.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL AUXILIAR: REASIGNAR EMPLEADO DE EQUIPO                           */}
      {/* ========================================================================= */}
      {empleadoSeleccionadoMover && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#dc2626]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Reasignar Empleado a Encargado
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEmpleadoSeleccionadoMover(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <div className="w-11 h-14 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                <img
                  src={empleadoSeleccionadoMover.fotoUrl}
                  alt={empleadoSeleccionadoMover.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {empleadoSeleccionadoMover.nombre}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {empleadoSeleccionadoMover.cargo}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {empleadoSeleccionadoMover.correo}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Seleccione el Encargado Destino:
              </label>
              <select
                value={nuevoEncargadoDestino}
                onChange={(e) => setNuevoEncargadoDestino(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 cursor-pointer focus:outline-none focus:border-[#dc2626]"
              >
                {encargados.map((enc) => (
                  <option key={enc.id} value={enc.id}>
                    Equipo de {enc.nombre} — {enc.aduana}
                  </option>
                ))}
                <option value="sin_asignar">
                  -- Dejar Sin Encargado Asignado (Disponible) --
                </option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEmpleadoSeleccionadoMover(null)}
                className="px-4 py-2 border border-slate-200 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const destinoId = nuevoEncargadoDestino === 'sin_asignar' ? null : nuevoEncargadoDestino;
                  handleMoverEmpleado(empleadoSeleccionadoMover.id, destinoId);
                }}
                className="px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                Confirmar Reasignación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JerarquiaView;
