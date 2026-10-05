import React, { useState } from 'react';

export interface LoginViewProps {
  onSuccess: (perfil: { nombre: string; cargo: string; correo: string }) => void;
}

interface PerfilPredefinido {
  id: string;
  nombre: string;
  cargo: string;
  funcion: string;
  correo: string;
  sede: string;
}

const PERFILES: PerfilPredefinido[] = [
  {
    id: 'clasificador',
    nombre: 'Diego Ramírez',
    cargo: 'Clasificador Aduanal',
    funcion: 'Clasifica fichas técnicas y pedimentos.',
    correo: 'diego.ramirez@aduana.gob.mx',
    sede: 'Aduana de Nuevo Laredo',
  },
  {
    id: 'auditor',
    nombre: 'Auditor Central',
    cargo: 'Control y Supervisión',
    funcion: 'Revisa y valida dictámenes emitidos.',
    correo: 'auditoria.central@aduana.gob.mx',
    sede: 'Administración Central de Aranceles',
  },
];

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const [perfil, setPerfil] = useState<PerfilPredefinido | null>(null);
  const [contrasena, setContrasena] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil) {
      setError('Seleccione quién ingresa al sistema.');
      return;
    }
    if (!contrasena.trim()) {
      setError('Escriba su contraseña para continuar.');
      return;
    }
    setError(null);
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      onSuccess({ nombre: perfil.nombre, cargo: perfil.cargo, correo: perfil.correo });
    }, 500);
  };

  return (
    <div className="max-w-xl mx-auto py-8 sm:py-14">
      <h2 className="text-2xl font-bold text-black">¿Quién ingresa al sistema?</h2>
      <p className="text-sm text-black/[0.7] mt-1">Elija su nombre de la lista.</p>

      {/* Lista de personas: filas separadas por línea, sin recuadros */}
      <ul className="mt-6 border-t border-black/[0.12]" role="radiogroup" aria-label="Persona que ingresa">
        {PERFILES.map((p) => {
          const activo = perfil?.id === p.id;
          return (
            <li key={p.id} className="border-b border-black/[0.12]">
              <button
                type="button"
                role="radio"
                aria-checked={activo}
                onClick={() => {
                  setPerfil(p);
                  setError(null);
                }}
                className={`w-full text-left flex items-center gap-4 px-3 py-4 min-h-[56px] rounded-[10px] transition-colors ${
                  activo ? 'bg-[#2563eb]/[0.08]' : 'hover:bg-black/[0.04]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    activo ? 'border-[#2563eb]' : 'border-black/[0.4]'
                  }`}
                >
                  {activo && <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-black">
                    {p.nombre} <span className="font-normal text-black/[0.7]">— {p.cargo}</span>
                  </span>
                  <span className="block text-sm text-black/[0.7]">{p.funcion}</span>
                  <span className="block text-xs text-black/[0.4] mt-0.5">{p.sede}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {perfil && (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="login-email" className="block text-sm font-semibold text-black mb-1.5">
              Correo institucional
            </label>
            <input
              id="login-email"
              type="email"
              value={perfil.correo}
              readOnly
              className="w-full px-3.5 py-3 bg-black/[0.04] border border-black/[0.12] rounded-[10px] text-sm text-black/[0.7] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-semibold text-black mb-1.5">
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              autoFocus
              value={contrasena}
              onChange={(e) => {
                setContrasena(e.target.value);
                setError(null);
              }}
              className="w-full px-3.5 py-3 bg-black/[0.04] border border-black/[0.12] rounded-[10px] text-sm text-black focus:outline-none focus:border-[#2563eb] focus:bg-white transition-colors"
            />
          </div>

          {error && <p className="text-sm font-medium text-rose-800">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full min-h-[48px] px-4 bg-[#2563eb] text-white font-semibold text-sm rounded-[10px] hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {cargando ? 'Verificando acceso…' : `Ingresar como ${perfil.nombre}`}
          </button>
        </form>
      )}

      {!perfil && error && <p className="mt-4 text-sm font-medium text-rose-800">{error}</p>}

      <p className="mt-8 text-xs text-black/[0.4]">
        Acceso exclusivo para personal autorizado. Cada dictamen queda registrado a nombre de quien lo emite.
      </p>
    </div>
  );
};

export default LoginView;
