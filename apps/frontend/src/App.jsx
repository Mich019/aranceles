import React, { useState } from 'react';
import SkeuomorphicPanel from './components/SkeuomorphicPanel';
import LoginForm from './components/LoginForm';
import RecoveryForm from './components/RecoveryForm';
import DashboardContextPanel from './components/DashboardContextPanel';
import SecurityAdminPanel from './components/SecurityAdminPanel';
import { LayoutDashboard, ShieldCheck } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState('SECURITY'); // Default or switcher: 'LOGIN' | 'RECOVERY' | 'AUTHENTICATED' | 'SECURITY'
  const [userSession, setUserSession] = useState({
    username: 'diego.ramirez@aranceles.gob.ec',
    timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
  });

  const handleLoginSuccess = (user) => {
    setUserSession(user);
    setMode('AUTHENTICATED');
  };

  const handleLogout = () => {
    setUserSession(null);
    setMode('LOGIN');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col items-center justify-start p-4 sm:p-6 select-none">
      {/* Top Preview Switcher Bar */}
      <div className="w-full max-w-4xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-slate-600 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <span className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <LayoutDashboard className="w-4 h-4 text-blue-600" />
          <span>Sistema Nacional de Aranceles</span>
        </span>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setMode('LOGIN')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              mode === 'LOGIN' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              mode === 'AUTHENTICATED' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tablero de Control
          </button>
          <button
            type="button"
            onClick={() => {
              if (!userSession) {
                setUserSession({ username: 'diego.ramirez@aranceles.gob.ec', timestamp: new Date().toLocaleTimeString() });
              }
              setMode('SECURITY');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'SECURITY' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Seguridad y Accesos</span>
          </button>
        </div>
      </div>

      {/* Main View Render */}
      <main className="w-full flex-1 flex flex-col justify-center items-center">
        {mode === 'SECURITY' ? (
          <SecurityAdminPanel userSession={userSession} />
        ) : mode === 'AUTHENTICATED' ? (
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
    </div>
  );
}