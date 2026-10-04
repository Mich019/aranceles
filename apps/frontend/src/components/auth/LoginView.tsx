import React, { useState } from 'react';

export interface LoginViewProps {
  onSuccess: (perfil: { nombre: string; cargo: string; correo: string }) => void;
}

interface PerfilPredefinido {
  id: string;
  nombre: string;
  cargo: string;
  tipo: string;
  correo: string;
  sede: string;
}

const PERFILES: PerfilPredefinido[] = [
  {
    id: 'clasificador',
    nombre: 'Diego Ramírez',
    cargo: 'Clasificador Aduanal',
    tipo: 'Operativo',
    correo: 'diego.ramirez@aduana.gob',
    sede: 'Aduana Quito • Terminal Aéreo',
  },
  {
    id: 'auditor',
    nombre: 'Auditor Central',
    cargo: 'Control y Supervisión',
    tipo: 'Auditoría',
    correo: 'auditoria.central@aduana.gob',
    sede: 'Dirección Nacional de Aranceles',
  },
];

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const [perfilSeleccionado, setPerfilSeleccionado] = useState<PerfilPredefinido>(PERFILES[0]);
  const [correo, setCorreo] = useState<string>(PERFILES[0].correo);
  const [contrasena, setContrasena] = useState<string>('••••••••••••');
  const [cargando, setCargando] = useState<boolean>(false);

  const handleSelectPerfil = (perfil: PerfilPredefinido) => {
    setPerfilSeleccionado(perfil);
    setCorreo(perfil.correo);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    // Simula medio segundo de validación formal
    setTimeout(() => {
      setCargando(false);
      onSuccess({
        nombre: perfilSeleccionado.nombre,
        cargo: perfilSeleccionado.cargo,
        correo: correo,
      });
    }, 500);
  };

  return (
    <div className="flex items-center justify-center py-6 sm:py-10">
      <div className="w-full max-w-lg bg-white border border-black/[0.12] rounded-[18px] p-6 sm:p-8">
        
        {/* Cabecera del formulario institucional */}
        <div className="text-center mb-6">
          {/* Emblema tangible institucional */}
          <div className="w-12 h-12 mx-auto rounded-[10px] bg-black/[0.04] border border-black/[0.12] flex items-center justify-center text-black font-bold text-sm mb-3">
            SNA
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-black tracking-tight">
            ¿Quién ingresa al sistema?
          </h2>
          <p className="text-xs text-black/[0.4] mt-1 max-w-sm mx-auto leading-relaxed">
            Seleccione su perfil asignado e ingrese sus credenciales de servicio aduanal.
          </p>
        </div>

        {/* 1. Selector Visual de Perfil Rápido (Elegir, no teclear) */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-black/[0.7] mb-2">
            Perfil de acceso institucional:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PERFILES.map((perfil) => {
              const seleccionado = perfilSeleccionado.id === perfil.id;
              return (
                <button
                  key={perfil.id}
                  type="button"
                  onClick={() => handleSelectPerfil(perfil)}
                  className={`p-3 rounded-[10px] border text-left transition-all ${
                    seleccionado
                      ? 'border-[#2563eb] bg-[#2563eb]/[0.05] ring-1 ring-[#2563eb]'
                      : 'border-black/[0.12] bg-black/[0.01] hover:border-black/[0.25]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Gafete miniatura */}
                    <div className="w-7 h-7 rounded-full bg-black/[0.06] border border-black/[0.12] flex-shrink-0 flex items-center justify-center font-bold text-[11px] text-black">
                      {perfil.nombre.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-black truncate">
                        {perfil.nombre}
                      </div>
                      <div className="text-[11px] text-black/[0.6] leading-tight mt-0.5">
                        {perfil.cargo} ({perfil.tipo})
                      </div>
                      <div className="text-[10px] text-black/[0.4] mt-1 truncate">
                        {perfil.sede}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Formulario de Credenciales */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-black/[0.7] mb-1.5" htmlFor="login-email">
              Correo Institucional
            </label>
            <input
              type="email"
              id="login-email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-black/[0.04] border border-black/[0.12] rounded-[10px] text-sm text-black focus:outline-none focus:border-[#2563eb] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-black/[0.7]" htmlFor="login-password">
                Contraseña
              </label>
              <span className="text-[11px] text-black/[0.4]">
                Autenticación local
              </span>
            </div>
            <input
              type="password"
              id="login-password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-black/[0.04] border border-black/[0.12] rounded-[10px] text-sm text-black focus:outline-none focus:border-[#2563eb] focus:bg-white transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3 px-4 bg-[#2563eb] text-white font-semibold text-sm rounded-[10px] hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              {cargando ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validando credenciales...</span>
                </>
              ) : (
                <span>Entrar a la plataforma de clasificación</span>
              )}
            </button>
          </div>
        </form>

        {/* Aviso de seguridad institucional */}
        <div className="mt-6 pt-4 border-t border-black/[0.08] text-center">
          <p className="text-[11px] text-black/[0.4] leading-relaxed">
            Acceso restringido a funcionarios autorizados. Todas las consultas y dictámenes emitidos quedan registrados en el sistema de auditoría aduanera.
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginView;
