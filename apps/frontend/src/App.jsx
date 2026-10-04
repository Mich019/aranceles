import React, { useState } from 'react';
import SkeuomorphicPanel from './components/SkeuomorphicPanel';
import LoginForm from './components/LoginForm';
import RecoveryForm from './components/RecoveryForm';
import DashboardContextPanel from './components/DashboardContextPanel';
import { LayoutDashboard, Lock } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState('LOGIN'); // 'LOGIN' | 'RECOVERY' | 'AUTHENTICATED'
  const [userSession, setUserSession] = useState(null);

  const handleLoginSuccess = (user) => {
    setUserSession(user);
    setMode('AUTHENTICATED');
  };

  const handleLogout = () => {
    setUserSession(null);
    setMode('LOGIN');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      {/* Top Preview Switcher Bar */}
      <div className="w-full max-w-3xl mb-4 flex items-center justify-between text-xs font-semibold text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
        <span className="flex items-center gap-1.5 text-slate-700">
          <LayoutDashboard className="w-4 h-4 text-blue-600" />
          <span>Sistema Nacional de Aranceles</span>
        </span>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('LOGIN')}
            className={`px-3 py-1 rounded-md transition-all ${
              mode === 'LOGIN' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Formulario de Acceso
          </button>
          <button
            type="button"
            onClick={() => {
              if (!userSession) {
                setUserSession({ username: 'diego.ramirez@aranceles.gob.ec', timestamp: new Date().toLocaleTimeString() });
              }
              setMode('AUTHENTICATED');
            }}
            className={`px-3 py-1 rounded-md transition-all ${
              mode === 'AUTHENTICATED' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tablero de Control
          </button>
        </div>
      </div>

      {/* Main View Render */}
      <main className="w-full">
        {mode === 'AUTHENTICATED' ? (
          <DashboardContextPanel userSession={userSession} onLogout={handleLogout} />
        ) : (
          <SkeuomorphicPanel mode={mode} onTabChange={(newMode) => setMode(newMode)}>
            {mode === 'LOGIN' && (
              <LoginForm
                onSwitchToRecovery={() => setMode('RECOVERY')}
                onLoginSuccess={handleLoginSuccess}
              />
            )}

            {mode === 'RECOVERY' && (
              <RecoveryForm onBackToLogin={() => setMode('LOGIN')} />
            )}
          </SkeuomorphicPanel>
        )}
      </main>

      {/* Production Footer Info */}
      <footer className="mt-8 text-center text-xs font-normal text-slate-500 space-y-1">
        <p>© 2026 República del Ecuador • Todos los derechos reservados</p>
        <p className="text-[11px] text-slate-400">Sistema Nacional de Gestión y Control Arancelario</p>
      </footer>
    </div>
  );
}