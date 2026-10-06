import React, { useState } from 'react';

export interface PerfilAutenticado {
  id?: string;
  nombre: string;
  cargo: string;
  correo: string;
  rol: 'admin' | 'encargado' | 'operativo';
  sede: string;
  destino: 'admin_hub' | 'operacion';
  fotoUrl?: string;
}

export interface LoginViewProps {
  onSuccess?: (perfil: PerfilAutenticado, estadoDestino: 'admin_hub' | 'operacion') => void;
  onNavigate?: (estado: 'admin_hub' | 'operacion', perfil: PerfilAutenticado) => void;
  estadoInicial?: 'login' | 'admin_hub' | 'operacion';
}

interface PerfilRapido {
  id: 'admin' | 'encargado' | 'operador';
  etiqueta: string;
  correo: string;
  contrasena: string;
  nombre: string;
  cargo: string;
  sede: string;
  estadoDestino: 'admin_hub' | 'operacion';
  descripcionDestino: string;
  fotoUrl: string;
}

const PERFILES_SIMULADOS: PerfilRapido[] = [
  {
    id: 'admin',
    etiqueta: 'Administración Central',
    correo: 'admin@aranceles.gob.mx',
    contrasena: 'Admin.Aranceles#2026',
    nombre: 'Lic. Sofía Valenzuela',
    cargo: 'Administrador Central de Aranceles',
    sede: 'Administración General de Aranceles',
    estadoDestino: 'admin_hub',
    descripcionDestino: 'Acceso total: políticas, jerarquía, expedientes y padrón',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=480&fit=crop&crop=face',
  },
  {
    id: 'encargado',
    etiqueta: 'Encargado de Equipo',
    correo: 'encargado@aranceles.gob.mx',
    contrasena: 'Encargado.Aranceles#2026',
    nombre: 'Lic. María Elena Morales',
    cargo: 'Encargada de Equipo Operativo',
    sede: 'Aduana de Manzanillo',
    estadoDestino: 'operacion',
    descripcionDestino: 'Clasificación y gestión de empleados asignados a su cargo',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=480&fit=crop&crop=face',
  },
  {
    id: 'operador',
    etiqueta: 'Personal Operativo',
    correo: 'operador@aranceles.gob.mx',
    contrasena: 'Operativo.Aduanal#2026',
    nombre: 'Diego Ramírez',
    cargo: 'Personal Operativo de Clasificación',
    sede: 'Aduana de Nuevo Laredo',
    estadoDestino: 'operacion',
    descripcionDestino: 'Recepción de documentos, análisis e historial propio',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=480&fit=crop&crop=face',
  },
];

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccess,
  onNavigate,
  estadoInicial = 'login',
}) => {
  const [correo, setCorreo] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [estadoReactivo, setEstadoReactivo] = useState<'login' | 'admin_hub' | 'operacion'>(
    estadoInicial
  );
  const [perfilActivo, setPerfilActivo] = useState<PerfilAutenticado | null>(null);

  const ejecutarTransicion = (perfil: PerfilAutenticado, destino: 'admin_hub' | 'operacion') => {
    setPerfilActivo(perfil);
    setEstadoReactivo(destino);
    if (onSuccess) {
      onSuccess(perfil, destino);
    }
    if (onNavigate) {
      onNavigate(destino, perfil);
    }
  };

  const handleSeleccionarPerfil = (perfil: PerfilRapido) => {
    setCorreo(perfil.correo);
    setContrasena(perfil.contrasena);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const correoLimpio = correo.trim().toLowerCase();

    if (!correoLimpio) {
      setError('Ingrese su correo electrónico institucional.');
      return;
    }

    if (!contrasena.trim()) {
      setError('Escriba su contraseña para continuar.');
      return;
    }

    setError(null);
    setCargando(true);

    // Lógica de detección de rol por correo institucional
    const esAdmin = correoLimpio.includes('admin');
    const esEncargado = correoLimpio.includes('encargado');
    const perfilCoincidente = PERFILES_SIMULADOS.find(
      (p) => p.correo.toLowerCase() === correoLimpio
    );

    const destino: 'admin_hub' | 'operacion' = esAdmin ? 'admin_hub' : 'operacion';

    const perfilResultado: PerfilAutenticado = perfilCoincidente
      ? {
          nombre: perfilCoincidente.nombre,
          cargo: perfilCoincidente.cargo,
          correo: perfilCoincidente.correo,
          rol: perfilCoincidente.id,
          sede: perfilCoincidente.sede,
          destino: perfilCoincidente.estadoDestino,
          fotoUrl: perfilCoincidente.fotoUrl,
        }
      : esAdmin
      ? {
          nombre: 'Lic. Sofía Valenzuela',
          cargo: 'Administrador Central de Aranceles',
          correo: correo.trim(),
          rol: 'admin',
          sede: 'Administración General de Aranceles',
          destino: 'admin_hub',
          fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=480&fit=crop&crop=face',
        }
      : esEncargado
      ? {
          nombre: 'Lic. María Elena Morales',
          cargo: 'Encargada de Equipo Operativo',
          correo: correo.trim(),
          rol: 'encargado',
          sede: 'Aduana de Manzanillo',
          destino: 'operacion',
          fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=480&fit=crop&crop=face',
        }
      : {
          nombre: 'Diego Ramírez',
          cargo: 'Personal Operativo de Clasificación',
          correo: correo.trim(),
          rol: 'operativo',
          sede: 'Aduana de Nuevo Laredo',
          destino: 'operacion',
          fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=480&fit=crop&crop=face',
        };

    setTimeout(() => {
      setCargando(false);
      ejecutarTransicion(perfilResultado, destino);
    }, 450);
  };

  const handleCerrarSesion = () => {
    setEstadoReactivo('login');
    setPerfilActivo(null);
    setContrasena('');
    setError(null);
  };

  // Renderizado reactivo cuando no hay callback exterior que desmonte la vista
  if (estadoReactivo === 'admin_hub' && perfilActivo && !onSuccess && !onNavigate) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#f1f5f9] px-4 py-8">
        <div className="w-full max-w-[480px] bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/logo.png"
              alt="Logo Institucional"
              className="w-10 h-10 object-contain drop-shadow-xs"
            />
            <div>
              <h1 className="text-xl font-bold text-[#0f172a] leading-tight">
                Centro de Mando Administrativo
              </h1>
              <p className="text-sm font-normal text-[#64748b] leading-tight mt-0.5">
                Sistema Nacional de Aranceles
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] mb-6">
            <div className="text-xs uppercase tracking-wider font-semibold text-[#dc2626] mb-1">
              Sesión Verificada
            </div>
            <div className="text-base font-bold text-[#0f172a]">{perfilActivo.nombre}</div>
            <div className="text-sm text-[#475569]">{perfilActivo.cargo}</div>
            <div className="text-xs text-[#64748b] mt-1">{perfilActivo.correo} • {perfilActivo.sede}</div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#64748b] leading-relaxed">
              Autenticación confirmada para funciones de supervisión central, administración de políticas y auditoría del padrón institucional.
            </p>
            <button
              type="button"
              onClick={handleCerrarSesion}
              className="w-full min-h-[44px] px-4 bg-white hover:bg-[#f8fafc] text-[#0f172a] font-medium text-sm rounded-lg border border-[#e2e8f0] hover:border-[#cbd5e1] transition-colors cursor-pointer"
            >
              Volver al acceso institucional
            </button>
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-[#64748b] font-normal">
          © 2026 FASITLAC • Todos los derechos reservados
        </footer>
      </div>
    );
  }

  if (estadoReactivo === 'operacion' && perfilActivo && !onSuccess && !onNavigate) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#f1f5f9] px-4 py-8">
        <div className="w-full max-w-[480px] bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/logo.png"
              alt="Logo Institucional"
              className="w-10 h-10 object-contain drop-shadow-xs"
            />
            <div>
              <h1 className="text-xl font-bold text-[#0f172a] leading-tight">
                Recepción y Clasificación
              </h1>
              <p className="text-sm font-normal text-[#64748b] leading-tight mt-0.5">
                Sistema Nacional de Aranceles
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] mb-6">
            <div className="text-xs uppercase tracking-wider font-semibold text-[#dc2626] mb-1">
              Sesión Verificada
            </div>
            <div className="text-base font-bold text-[#0f172a]">{perfilActivo.nombre}</div>
            <div className="text-sm text-[#475569]">{perfilActivo.cargo}</div>
            <div className="text-xs text-[#64748b] mt-1">{perfilActivo.correo} • {perfilActivo.sede}</div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#64748b] leading-relaxed">
              Autenticación confirmada para el flujo de ingesta de documentos, validación técnica y emisión de dictámenes arancelarios.
            </p>
            <button
              type="button"
              onClick={handleCerrarSesion}
              className="w-full min-h-[44px] px-4 bg-white hover:bg-[#f8fafc] text-[#0f172a] font-medium text-sm rounded-lg border border-[#e2e8f0] hover:border-[#cbd5e1] transition-colors cursor-pointer"
            >
              Volver al acceso institucional
            </button>
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-[#64748b] font-normal">
          © 2026 FASITLAC • Todos los derechos reservados
        </footer>
      </div>
    );
  }

  // Vista principal: Formulario de Acceso Único
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#f1f5f9] px-4 py-8 sm:py-12">
      {/* Tarjeta Institucional */}
      <div className="w-full max-w-[540px] bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 shadow-xs">
        
        {/* Encabezado formal */}
        <div className="mb-6">
          <img
            src="/logo.png"
            alt="Logo Institucional"
            className="w-12 h-12 object-contain mb-3 drop-shadow-xs"
          />
          <h1 className="text-xl font-bold text-[#0f172a] leading-tight">
            Acceso a la Plataforma
          </h1>
          <p className="text-xs text-[#64748b] font-normal leading-normal mt-1">
            Sistema Nacional de Aranceles
          </p>
        </div>

        {/* Formulario de Acceso Único */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-medium text-[#334155] mb-1.5"
            >
              Correo institucional
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                setError(null);
              }}
              placeholder="usuario@aranceles.gob.mx"
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#dc2626] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-medium text-[#334155] mb-1.5"
            >
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={contrasena}
              onChange={(e) => {
                setContrasena(e.target.value);
                setError(null);
              }}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#dc2626] focus:bg-white transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 bg-[#fff1f2] border border-[#fecdd3] rounded-lg text-xs font-medium text-[#e11d48]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full min-h-[44px] mt-2 px-4 rounded-lg bg-[#dc2626] text-white font-medium text-sm hover:bg-[#b91c1c] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer shadow-xs"
          >
            {cargando ? 'Verificando credenciales…' : 'Ingresar al sistema'}
          </button>
        </form>

        {/* Acceso Rápido por Perfiles */}
        <div className="mt-6 pt-5 border-t border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#64748b]">
              Perfiles institucionales de demostración
            </span>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-2"
            role="radiogroup"
            aria-label="Selector de perfiles de demostración"
          >
            {PERFILES_SIMULADOS.map((p) => {
              const esActivo = correo.trim().toLowerCase() === p.correo.toLowerCase();

              return (
                <div
                  key={p.id}
                  onClick={() => handleSeleccionarPerfil(p)}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    esActivo
                      ? 'bg-[#fef2f2] border-[#dc2626] ring-1 ring-[#dc2626]'
                      : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-white hover:border-[#cbd5e1]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0f172a] truncate">
                        {p.nombre.split(' ')[0]} {p.nombre.split(' ')[1] || ''}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          p.id === 'admin'
                            ? 'bg-[#dc2626]'
                            : p.id === 'encargado'
                            ? 'bg-amber-500'
                            : 'bg-emerald-600'
                        }`}
                      />
                    </div>
                    <div className="text-[10px] text-[#64748b] mt-0.5 leading-snug truncate">
                      {p.etiqueta}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSeleccionarPerfil(p);
                      const perfilDestino: PerfilAutenticado = {
                        nombre: p.nombre,
                        cargo: p.cargo,
                        correo: p.correo,
                        rol: p.id,
                        sede: p.sede,
                        destino: p.estadoDestino,
                      };
                      ejecutarTransicion(perfilDestino, p.estadoDestino);
                    }}
                    className={`mt-2.5 w-full py-1.5 px-1.5 rounded-[8px] text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-none ${
                      p.id === 'admin'
                        ? 'bg-[#dc2626] text-white hover:bg-[#b91c1c]'
                        : p.id === 'encargado'
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-white hover:bg-black/[0.04] text-black border border-black/[0.12]'
                    }`}
                  >
                    <span>
                      {p.id === 'admin'
                        ? 'Administrador'
                        : p.id === 'encargado'
                        ? 'Encargado'
                        : 'Operativo'}
                    </span>
                    <span>→</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Pie de página institucional */}
      <footer className="mt-6 text-center text-xs text-[#64748b] font-normal">
        © 2026 FASITLAC • Todos los derechos reservados
      </footer>
    </div>
  );
};

export default LoginView;
