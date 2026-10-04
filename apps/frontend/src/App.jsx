import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkBackendHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/api/health');
      if (!response.ok) throw new Error('Error al conectar con la API');
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl font-bold tracking-wide">Sistema Aranceles</h1>
          </div>
          <button 
            onClick={checkBackendHealth}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
            title="Revisar conexión"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Estado de Conexión Backend
          </h2>

          {loading && (
            <p className="text-slate-400 animate-pulse flex items-center gap-2">
              Verificando servidor...
            </p>
          )}

          {!loading && error && (
            <div className="flex items-start gap-3 bg-red-950/50 border border-red-500/30 p-4 rounded-lg text-red-300">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Sin conexión con la API</p>
                <p className="text-xs text-red-400/80 mt-1">{error}</p>
              </div>
            </div>
          )}

          {!loading && status && (
            <div className="flex items-start gap-3 bg-emerald-950/50 border border-emerald-500/30 p-4 rounded-lg text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-sm">{status.message}</p>
                <p className="text-xs text-emerald-400/80">
                  Estado: <span className="uppercase font-mono">{status.status}</span>
                </p>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {status.timestamp}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}