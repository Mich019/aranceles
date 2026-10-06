import React, { useState } from 'react';
import LoginView, { PerfilAutenticado } from './components/auth/LoginView';
import DashboardLayout, { SeccionMenu } from './components/layout/DashboardLayout';
import DashboardOverview from './components/dashboard/DashboardOverview';
import GestionRolesView from './components/admin/GestionRolesView';
import BandejaSupervisorView, { ExpedientePendiente } from './components/admin/BandejaSupervisorView';
import GestionEmpleadosView, { EMPLEADOS_INICIALES, Empleado } from './components/admin/GestionEmpleadosView';
import JerarquiaView from './components/admin/JerarquiaView';
import ConfiguracionSistemaView from './components/admin/ConfiguracionSistemaView';
import HistorialExpedientesView from './components/workflow/HistorialExpedientesView';
import IngestaView from './components/workflow/IngestaView';
import VisorDocumento from './components/workflow/VisorDocumento';
import FormularioAtributos from './components/workflow/FormularioAtributos';
import PreguntaDecisiva from './components/workflow/PreguntaDecisiva';
import AuditoriaPedimentoView, { ObservacionAuditoria } from './components/workflow/AuditoriaPedimentoView';
import DictamenFinalView from './components/workflow/DictamenFinalView';
import { ArrowLeft } from 'lucide-react';

export interface DatosSimulados {
  material: string;
  tipoProducto: string;
  espesor: string;
  norma: string;
  origen: string;
  confianzaOcr: number;
  fraccionSugerida: string;
  descripcionArancelaria: string;
  pesoNeto?: string;
  unidadMedida?: string;
  paisOrigen?: string;
  supervisorVoBo?: {
    nombre: string;
    cargo: string;
    fechaHora: string;
  };
}

const EXPEDIENTES_DEMO_INICIALES: ExpedientePendiente[] = [
  {
    id: 'EXP-2026-0422-MX',
    nombreArchivo: 'Ficha_Tecnica_Bobina_Inox_304.pdf',
    formato: 'pdf',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    peso: '3.4 MB',
    remitente: {
      nombre: 'Juan Carlos Pérez',
      rol: 'Operativo',
      aduana: 'Aduana de Quito',
    },
    fechaRecepcion: '04 de octubre de 2026 • 17:01 hrs',
    tipoDocumento: 'ficha',
    estado: 'pendiente',
    numeroParte: 'NP-ACERO-304-X',
    proveedor: 'Aceros Especiales S.A.',
  },
  {
    id: 'EXP-2026-0421-MX',
    nombreArchivo: 'Pedimento_Aduanal_Planchas_7219.pdf',
    formato: 'pdf',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    peso: '1.8 MB',
    remitente: {
      nombre: 'Carlos Andrés Benítez',
      rol: 'Operativo',
      aduana: 'Aduana de Tulcán',
    },
    fechaRecepcion: '04 de octubre de 2026 • 15:45 hrs',
    tipoDocumento: 'pedimento',
    estado: 'pendiente',
    numeroParte: 'PED-2026-ECU-00918',
    proveedor: 'Consignatario Industrial Quito',
  },
];

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex items-center justify-center p-6 font-sans">
          <div className="bg-white border border-slate-200 p-8 rounded-2xl max-w-md w-full shadow-md text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#dc2626] mx-auto flex items-center justify-center font-bold text-xl">
              !
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Inconsistencia detectada en la interfaz
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {this.state.error?.message || 'Error inesperado al cargar la vista.'}
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-xs"
            >
              Recargar Plataforma
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // 1. Estado de Sesión y Navegación
  const [autenticado, setAutenticado] = useState<boolean>(false);
  const [usuarioActivo, setUsuarioActivo] = useState<PerfilAutenticado | null>(null);
  const [seccionActiva, setSeccionActiva] = useState<SeccionMenu>('dashboard');

  // 2. Estado del Flujo de Clasificación
  const [pasoActual, setPasoActual] = useState<number>(1);
  const [tipoDocumento, setTipoDocumento] = useState<'ficha' | 'pedimento'>('ficha');
  const [evidenciaHovered, setEvidenciaHovered] = useState<string | null>(null);
  const [_observacionAuditoria, setObservacionAuditoria] = useState<ObservacionAuditoria | null>(null);

  // 3. Supervisión y Expedientes
  const [supervisionObligatoria, setSupervisionObligatoria] = useState<boolean>(true);
  const [expedientesPendientes, setExpedientesPendientes] = useState<ExpedientePendiente[]>(
    EXPEDIENTES_DEMO_INICIALES
  );
  // Padrón central de empleados jerárquicos
  const [listaEmpleados, setListaEmpleados] = useState<Empleado[]>(EMPLEADOS_INICIALES);

  // 4. Tema Visual del Sistema (Modo Claro / Modo Oscuro)
  const [modoOscuro, setModoOscuro] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem('aranceles_tema');
      return guardado === 'oscuro';
    }
    return false;
  });

  React.useEffect(() => {
    if (modoOscuro) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aranceles_tema', 'oscuro');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aranceles_tema', 'claro');
    }
  }, [modoOscuro]);

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

  const handleLogin = (perfil: PerfilAutenticado | string, perfilSecundario?: PerfilAutenticado) => {
    let perfilReal: PerfilAutenticado;
    if (typeof perfil === 'object' && perfil !== null && 'rol' in perfil) {
      perfilReal = perfil;
    } else if (typeof perfilSecundario === 'object' && perfilSecundario !== null && 'rol' in perfilSecundario) {
      perfilReal = perfilSecundario;
    } else {
      perfilReal = {
        nombre: 'Lic. Sofía Valenzuela',
        cargo: 'Administrador Central de Aranceles',
        correo: 'admin@aranceles.gob.mx',
        rol: 'admin',
        sede: 'Administración General de Aranceles',
        destino: 'admin_hub',
        fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=480&fit=crop&crop=face',
      };
    }

    setUsuarioActivo(perfilReal);
    setAutenticado(true);
    // Mandar siempre al Dashboard principal de bienvenida, NO a llenar la ficha directo
    setSeccionActiva('dashboard');
    setPasoActual(1);
  };

  const handleCerrarSesion = () => {
    setAutenticado(false);
    setUsuarioActivo(null);
    setSeccionActiva('dashboard');
    setPasoActual(1);
    setObservacionAuditoria(null);
  };

  const esAdmin =
    usuarioActivo?.rol === 'admin' ||
    usuarioActivo?.rol === 'administrador' ||
    Boolean(usuarioActivo?.correo && usuarioActivo.correo.toLowerCase().includes('admin'));

  const esEncargado =
    usuarioActivo?.rol === 'encargado' ||
    Boolean(usuarioActivo?.correo && usuarioActivo.correo.toLowerCase().includes('encargado'));

  const handleCambiarRol = () => {
    if (esAdmin) {
      // De Administrador a Encargado (Supervisa equipo específico de Manzanillo)
      setUsuarioActivo({
        nombre: 'Lic. María Elena Morales',
        cargo: 'Encargada de Equipo (Manzanillo)',
        correo: 'encargado@aranceles.gob.mx',
        rol: 'encargado',
        sede: 'Aduana de Manzanillo',
        destino: 'supervision_equipo',
        fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=480&fit=crop&crop=face',
      });
      setSeccionActiva('dashboard');
    } else if (esEncargado) {
      // De Encargado a Empleado / Operativo (solo clasificar e historial)
      setUsuarioActivo({
        nombre: 'Diego Ramírez',
        cargo: 'Personal Operativo de Clasificación',
        correo: 'operador@aranceles.gob.mx',
        rol: 'operativo',
        sede: 'Aduana de Nuevo Laredo',
        destino: 'operacion',
        fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=480&fit=crop&crop=face',
      });
      setSeccionActiva('dashboard');
    } else {
      // De Empleado a Administrador Central
      setUsuarioActivo({
        nombre: 'Lic. Sofía Valenzuela',
        cargo: 'Administrador Central de Aranceles',
        correo: 'admin@aranceles.gob.mx',
        rol: 'admin',
        sede: 'Administración General de Aranceles',
        destino: 'admin_hub',
        fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=480&fit=crop&crop=face',
      });
      setSeccionActiva('dashboard');
    }
  };

  const handleAprobarExpediente = (expAprobado: ExpedientePendiente) => {
    setExpedientesPendientes(
      expedientesPendientes.map((e) => (e.id === expAprobado.id ? expAprobado : e))
    );
    setDatosSimulados((prev) => ({
      ...prev,
      material:
        expAprobado.tipoDocumento === 'pedimento'
          ? 'Láminas de acero inoxidable austenítico'
          : 'Lámina rolada en frío inox 304',
      tipoProducto: 'Bobina laminada en frío',
      espesor: '0.90 mm',
      norma: 'ASTM A240 / Grado 304',
      origen: `Expediente Resguardado ${expAprobado.id} (SHA-256 Validado)`,
      fraccionSugerida: '7219.34.01 — NICO 01',
      supervisorVoBo: expAprobado.supervisorVoBo,
    }));
    setTipoDocumento(expAprobado.tipoDocumento);
    // Transfiere a la clasificación con Vo.Bo.
    setSeccionActiva('clasificar');
    setPasoActual(2);
  };

  const handleRechazarExpediente = (id: string, motivo: string) => {
    setExpedientesPendientes(
      expedientesPendientes.map((e) =>
        e.id === id ? { ...e, estado: 'rechazado' as const, motivoRechazo: motivo } : e
      )
    );
  };

  // PANTALLA DE ACCESO (LOGIN)
  if (!autenticado) {
    return (
      <LoginView
        onSuccess={(perfil) => handleLogin(perfil)}
      />
    );
  }

  const pendientesCount = expedientesPendientes.filter((e) => e.estado === 'pendiente').length;

  return (
    <ErrorBoundary>
      <DashboardLayout
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
        usuario={usuarioActivo}
        onCerrarSesion={handleCerrarSesion}
        onCambiarRol={handleCambiarRol}
        pendientesSupervisionCount={pendientesCount}
        modoOscuro={modoOscuro}
        onToggleModoOscuro={setModoOscuro}
      >
      {/* SECCIÓN 1: DASHBOARD / PANEL PRINCIPAL */}
      {seccionActiva === 'dashboard' && (
        <DashboardOverview
          usuario={usuarioActivo}
          onIrAClasificar={() => {
            setSeccionActiva('clasificar');
            setPasoActual(1);
          }}
          onIrAHistorial={() => setSeccionActiva('historial')}
          onIrASupervision={() => setSeccionActiva('supervision')}
          onIrAEmpleados={() => setSeccionActiva('empleados')}
          onIrARoles={() => setSeccionActiva('roles')}
          onIrAJerarquia={() => setSeccionActiva('jerarquia')}
          pendientesSupervisionCount={pendientesCount}
          expedientesPendientes={expedientesPendientes}
          listaEmpleados={listaEmpleados}
        />
      )}

      {/* SECCIÓN 2: HISTORIAL DE EXPEDIENTES */}
      {seccionActiva === 'historial' && (
        <HistorialExpedientesView
          rolUsuario={esAdmin ? 'admin' : 'operativo'}
        />
      )}

      {/* SECCIÓN 3: GESTIÓN DE ROLES (SOLO ADMIN) */}
      {seccionActiva === 'roles' && esAdmin && (
        <GestionRolesView />
      )}

      {/* SECCIÓN: JERARQUÍA EN ÁRBOL ORGANIZACIONAL (SOLO ADMIN) */}
      {seccionActiva === 'jerarquia' && esAdmin && (
        <JerarquiaView
          empleados={listaEmpleados}
          onActualizarEmpleados={setListaEmpleados}
          onVolver={() => setSeccionActiva('dashboard')}
        />
      )}

      {/* SECCIÓN 4: BANDEJA DE SUPERVISIÓN / APROBAR EXPEDIENTES (SOLO ADMIN) */}
      {seccionActiva === 'supervision' && esAdmin && (
        <BandejaSupervisorView
          expedientes={expedientesPendientes}
          onAprobarExpediente={handleAprobarExpediente}
          onRechazarExpediente={handleRechazarExpediente}
          supervisorActual={usuarioActivo?.nombre || 'Lic. Sofía Valenzuela'}
          onVolver={() => setSeccionActiva('dashboard')}
        />
      )}

      {/* SECCIÓN 5: GESTIÓN DE EMPLEADOS (ADMIN O ENCARGADO CON SUS ASIGNADOS) */}
      {seccionActiva === 'empleados' && (esAdmin || esEncargado) && (
        <GestionEmpleadosView
          usuarioActivo={usuarioActivo}
          empleados={listaEmpleados}
          onActualizarEmpleados={setListaEmpleados}
          onVolver={() => setSeccionActiva('dashboard')}
        />
      )}

      {/* SECCIÓN 6: POLÍTICAS Y CONFIGURACIÓN (SOLO ADMIN) */}
      {seccionActiva === 'configuracion' && esAdmin && (
        <ConfiguracionSistemaView
          supervisionObligatoria={supervisionObligatoria}
          onToggleSupervision={setSupervisionObligatoria}
          modoOscuro={modoOscuro}
          onToggleModoOscuro={setModoOscuro}
          onVolver={() => setSeccionActiva('dashboard')}
        />
      )}

      {/* SECCIÓN 7: CLASIFICACIÓN ARANCELARIA (FLUJO OPERATIVO COMPLETO) */}
      {seccionActiva === 'clasificar' && (
        <div className="space-y-6">
          {/* Cabecera del Flujo con barra de navegación de etapas */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSeccionActiva('dashboard')}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Volver al Panel Principal"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Panel</span>
              </button>

              <div className="h-4 w-px bg-slate-200" />

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Etapa {pasoActual} de 5
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {pasoActual === 1 && '1. Recepción y Carga de Documentos'}
                  {pasoActual === 2 && '2. Validación de Atributos Técnicos'}
                  {pasoActual === 3 && '3. Desambiguación Arancelaria'}
                  {pasoActual === 4 && '4. Dictamen Final y Justificación'}
                  {pasoActual === 5 && '5. Auditoría de Pedimento'}
                </span>
              </div>
            </div>

            {/* Píldoras de etapas */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: 1, label: '1. Ingesta' },
                { id: 2, label: '2. Atributos' },
                { id: 3, label: '3. Pregunta' },
                { id: 4, label: '4. Dictamen' },
                { id: 5, label: '5. Auditoría' },
              ].map((etapa) => {
                const activo = pasoActual === etapa.id;
                const pasado = pasoActual > etapa.id;

                return (
                  <button
                    key={etapa.id}
                    type="button"
                    onClick={() => setPasoActual(etapa.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      activo
                        ? 'bg-[#dc2626] text-white shadow-xs'
                        : pasado
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <span>{etapa.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* VISTA 1: INGESTA */}
          {pasoActual === 1 && (
            <IngestaView
              tipoDocumento={tipoDocumento}
              setTipoDocumento={setTipoDocumento}
              supervisionObligatoria={supervisionObligatoria}
              usuarioActivo={usuarioActivo}
              onIrASupervisorHub={() => setSeccionActiva('supervision')}
              onEnviarASupervision={(nuevoExp) => {
                const expFormateado: ExpedientePendiente = {
                  id: nuevoExp.id,
                  nombreArchivo: nuevoExp.nombreArchivo,
                  formato: nuevoExp.formato,
                  sha256: nuevoExp.sha256,
                  peso: nuevoExp.peso,
                  remitente: {
                    nombre: nuevoExp.remitente.nombre,
                    rol: nuevoExp.remitente.rol,
                    aduana: nuevoExp.remitente.aduana,
                  },
                  fechaRecepcion: nuevoExp.fechaRecepcion,
                  tipoDocumento: nuevoExp.tipo,
                  estado: 'pendiente',
                  numeroParte: nuevoExp.numeroParte || 'NP-ACERO-304-X',
                  proveedor: nuevoExp.proveedor || 'Aceros Mex S.A. de C.V.',
                };
                setExpedientesPendientes([expFormateado, ...expedientesPendientes]);
              }}
              onDocumentoCargado={(detalles) => {
                setDatosSimulados((prev) => ({
                  ...prev,
                  material: detalles.tipo === 'pedimento'
                    ? 'Lámina de acero inoxidable en frío'
                    : 'Lámina rolada en frío inox 304',
                  tipoProducto: 'Bobina laminada en frío',
                  origen: `Carga Digital de ${detalles.nombreArchivo}`,
                  fraccionSugerida: '7219.34.01 — NICO 01',
                  descripcionArancelaria:
                    'Productos laminados planos de acero inoxidable, de anchura superior o igual a 600 mm, simplemente laminados en frío, de espesor superior o igual a 0.5 mm pero inferior o igual a 1 mm.',
                }));
                setPasoActual(2);
              }}
            />
          )}

          {/* VISTA 2: VALIDACIÓN TÉCNICA Y VISOR */}
          {pasoActual === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 h-[680px]">
                <VisorDocumento
                  nombreArchivo={
                    tipoDocumento === 'pedimento'
                      ? 'Pedimento_Aduanal_Planchas_7219.pdf'
                      : 'Ficha_Tecnica_Aceros_304.pdf'
                  }
                  highlightedField={evidenciaHovered}
                  onHoverEvidence={setEvidenciaHovered}
                />
              </div>

              <div className="lg:col-span-7">
                <FormularioAtributos
                  datosIniciales={datosSimulados}
                  onHoverField={setEvidenciaHovered}
                  onConfirmar={() => setPasoActual(3)}
                  onVolver={() => setPasoActual(1)}
                />
              </div>
            </div>
          )}

          {/* VISTA 3: DESAMBIGUACIÓN ARANCELARIA */}
          {pasoActual === 3 && (
            <PreguntaDecisiva
              confianzaActual={0.865}
              onSeleccionarRespuesta={() => {
                if (tipoDocumento === 'pedimento') {
                  setPasoActual(5);
                } else {
                  setPasoActual(4);
                }
              }}
              onVolver={() => setPasoActual(2)}
            />
          )}

          {/* VISTA 4: DICTAMEN FINAL */}
          {pasoActual === 4 && (
            <DictamenFinalView
              fraccionPrincipal="7219.34.01"
              nico="01"
              descripcion="Productos laminados planos de acero inoxidable, de anchura superior o igual a 600 mm, simplemente laminados en frío, de espesor superior o igual a 0.5 mm pero inferior o igual a 1 mm."
              confianza={0.996}
              onVolver={() => setPasoActual(3)}
              onIrAAuditoria={() => setPasoActual(5)}
              onCerrarExpediente={() => {
                setSeccionActiva('historial');
                setPasoActual(1);
              }}
            />
          )}

          {/* VISTA 5: AUDITORÍA DE PEDIMENTO */}
          {pasoActual === 5 && (
            <AuditoriaPedimentoView
              fraccionMotor="7219.34.01 — NICO 01"
              onConfirmarConformidad={() => setPasoActual(4)}
              onEmitirObservacion={(obs) => {
                setObservacionAuditoria(obs);
                setPasoActual(4);
              }}
              onVolver={() => setPasoActual(3)}
            />
          )}
        </div>
      )}
      </DashboardLayout>
    </ErrorBoundary>
  );
}
