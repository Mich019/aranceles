import React, { useState, useEffect } from 'react';
import {
  Key,
  Clock,
  Search,
  Plus,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  Monitor,
  Globe,
  Lock,
  X,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

// Sample mock data for audit logs
const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-8901',
    timestamp: '2026-10-04 01:42:15',
    ip: '190.152.204.14',
    device: 'Chrome 128 (Windows 11)',
    location: 'Quito, Ecuador',
    method: 'SSO Corporativo',
    status: 'Exitoso',
  },
  {
    id: 'LOG-8900',
    timestamp: '2026-10-03 21:15:40',
    ip: '190.152.204.14',
    device: 'Firefox 125 (macOS)',
    location: 'Quito, Ecuador',
    method: 'Base Local',
    status: 'Exitoso',
  },
  {
    id: 'LOG-8899',
    timestamp: '2026-10-03 18:02:11',
    ip: '181.198.85.92',
    device: 'Safari (iOS 17)',
    location: 'Guayaquil, Ecuador',
    method: 'Base Local',
    status: 'Fallido',
  },
  {
    id: 'LOG-8898',
    timestamp: '2026-10-02 14:30:00',
    ip: '190.152.204.14',
    device: 'Chrome 128 (Windows 11)',
    location: 'Quito, Ecuador',
    method: 'SSO Corporativo',
    status: 'Exitoso',
  },
  {
    id: 'LOG-8897',
    timestamp: '2026-10-01 09:12:44',
    ip: '200.25.198.5',
    device: 'Edge 126 (Windows 10)',
    location: 'Tulcán, Ecuador',
    method: 'SSO Corporativo',
    status: 'Exitoso',
  }
];

// Sample mock data for active API keys
const INITIAL_API_KEYS = [
  {
    id: 'KEY-001',
    name: 'Servicio de Consultas Aduaneras',
    prefix: 'ar_live_9f82...3b1a',
    fullSecret: 'ar_live_9f82a10c7b9e4d2f80112233b1a',
    createdAt: '2026-08-15',
    lastUsed: 'Hace 10 minutos',
    environment: 'Producción',
    scope: 'Consultas & Lectura',
    status: 'Activa',
  },
  {
    id: 'KEY-002',
    name: 'Sistema de Trámites Comex',
    prefix: 'ar_live_5d3e...7a9c',
    fullSecret: 'ar_live_5d3e2189a00f1462bc99887a9c',
    createdAt: '2026-09-01',
    lastUsed: 'Ayer, 16:45',
    environment: 'Producción',
    scope: 'Captura & Confirmación',
    status: 'Activa',
  }
];

export default function SecurityAdminPanel({ userSession }) {
  // Session Expiration Alert state
  const [sessionAlertVisible, setSessionAlertVisible] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(298); // ~5 minutes countdown
  const [sessionRenewedMessage, setSessionRenewedMessage] = useState(false);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [logFilter, setLogFilter] = useState('TODOS'); // 'TODOS' | 'EXITOSOS' | 'FALLIDOS' | 'SSO'
  const [logSearchQuery, setLogSearchQuery] = useState('');

  // API Keys state
  const [apiKeys, setApiKeys] = useState(INITIAL_API_KEYS);
  const [isCreateKeyModalOpen, setIsCreateKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpiration, setNewKeyExpiration] = useState('90d');
  const [newKeyScope, setNewKeyScope] = useState('read_only');
  const [generatedKeyResult, setGeneratedKeyResult] = useState(null);
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  // Revoke Confirmation state
  const [keyToRevoke, setKeyToRevoke] = useState(null);

  // Countdown timer effect for session warning
  useEffect(() => {
    if (!sessionAlertVisible || secondsRemaining <= 0) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionAlertVisible, secondsRemaining]);

  // Format seconds to MM:SS
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Handler: Extend session
  const handleExtendSession = () => {
    setSecondsRemaining(1800); // Reset to 30 minutes (1800s)
    setSessionRenewedMessage(true);
    setTimeout(() => {
      setSessionRenewedMessage(false);
    }, 4000);
  };

  // Handler: Create new API key
  const handleCreateApiKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomHash = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const fullSecret = `ar_live_${randomHash}`;
    const prefix = `${fullSecret.slice(0, 11)}...${fullSecret.slice(-4)}`;

    const createdKey = {
      id: `KEY-${String(apiKeys.length + 1).padStart(3, '0')}`,
      name: newKeyName.trim(),
      prefix,
      fullSecret,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Nunca',
      environment: 'Producción',
      scope: newKeyScope === 'full' ? 'Acceso Total' : 'Consultas & Lectura',
      status: 'Activa',
    };

    setApiKeys([createdKey, ...apiKeys]);
    setGeneratedKeyResult(createdKey);
    setNewKeyName('');
  };

  // Handler: Confirm key revocation
  const handleConfirmRevoke = () => {
    if (!keyToRevoke) return;
    setApiKeys(apiKeys.filter((k) => k.id !== keyToRevoke.id));
    setKeyToRevoke(null);
  };

  // Copy to clipboard helper
  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2500);
  };

  // Filtered audit logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesFilter =
      logFilter === 'TODOS' ||
      (logFilter === 'EXITOSOS' && log.status === 'Exitoso') ||
      (logFilter === 'FALLIDOS' && log.status === 'Fallido') ||
      (logFilter === 'SSO' && log.method.includes('SSO'));

    const q = logSearchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      log.ip.toLowerCase().includes(q) ||
      log.location.toLowerCase().includes(q) ||
      log.device.toLowerCase().includes(q) ||
      log.method.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-left">
      {/* 1. ELEGANT SESSION EXPIRATION ALERT BANNER */}
      {sessionAlertVisible && (
        <div className="bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-2xl p-4 sm:p-5 shadow-sm transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200 shrink-0 mt-0.5 sm:mt-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-[#0f172a]">
                    Tu sesión expirará pronto por inactividad
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {formatTime(secondsRemaining)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-normal mt-1">
                  Por razones de seguridad institucional, la sesión se cerrará automáticamente si no hay interacción.
                </p>
                {sessionRenewedMessage && (
                  <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 mt-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Sesión renovada con éxito por 30 minutos adicionales.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={handleExtendSession}
                className="clean-button-primary px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Extender Sesión</span>
              </button>

              <button
                type="button"
                onClick={() => setSessionAlertVisible(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                title="Descartar aviso"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW TITLE & OVERVIEW HEADER */}
      <div className="clean-card rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">
                Administración de Seguridad
              </h1>
              <span className="text-[11px] font-semibold bg-blue-50 text-red-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
                Control Institucional
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Usuario Activo: <strong className="text-slate-700">{userSession?.username || 'diego.ramirez@aranceles.gob.ec'}</strong> • Plataforma Institucional de Control Arancelario
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Estado de Cuenta: Protegida (MFA Activo)</span>
        </div>
      </div>

      {/* 2. SECCIÓN 1: AUDIT LOG TABLE (BITÁCORA DE INICIOS DE SESIÓN) */}
      <div className="clean-card rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Bitácora de Inicios de Sesión
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-1">
              Registro histórico de accesos a la plataforma y eventos de autenticación.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Filtrar por:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
              {['TODOS', 'EXITOSOS', 'FALLIDOS', 'SSO'].map((filterKey) => (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setLogFilter(filterKey)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    logFilter === filterKey
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:text-slate-900 text-slate-600'
                  }`}
                >
                  {filterKey.charAt(0) + filterKey.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search & Stats Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por IP, ciudad o dispositivo..."
              value={logSearchQuery}
              onChange={(e) => setLogSearchQuery(e.target.value)}
              className="w-full clean-input pl-9 pr-3 py-2 text-xs text-slate-800 rounded-xl focus:outline-none"
            />
          </div>

          <span className="text-xs text-slate-500 self-end sm:self-center font-medium">
            Mostrando {filteredLogs.length} de {auditLogs.length} registros
          </span>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[#64748b]">
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Fecha y Hora</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Dirección IP</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Dispositivo / Navegador</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Ubicación</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Origen / Método</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors text-[#1e293b]">
                    <td className="py-3.5 px-4 text-xs font-medium font-mono text-slate-700 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold font-mono text-slate-900 whitespace-nowrap">
                      {log.ip}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{log.device}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{log.location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px] border border-slate-200">
                        {log.method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-right whitespace-nowrap">
                      {log.status === 'Exitoso' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Exitoso
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Fallido
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    No se encontraron registros de inicio de sesión que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. SECCIÓN 2: GESTIÓN DE CLAVES DE API */}
      <div className="clean-card rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Gestión de Claves de API
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-1">
              Tokens de acceso para la integración de sistemas externos y servicios arancelarios corporativos.
            </p>
          </div>

          {/* Botón "Nueva Clave" - Botón Secundario (texto #dc2626, borde #cbd5e1) */}
          <button
            type="button"
            onClick={() => {
              setGeneratedKeyResult(null);
              setIsCreateKeyModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-[#dc2626] bg-white border border-[#cbd5e1] hover:bg-slate-50 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-[#dc2626]" />
            <span>Nueva Clave</span>
          </button>
        </div>

        {/* API Keys Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[#64748b]">
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Nombre de Integración</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Clave API (Prefijo)</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Alcance</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Creada El</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Último Uso</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {apiKeys.length > 0 ? (
                apiKeys.map((keyItem) => (
                  <tr key={keyItem.id} className="hover:bg-slate-50/70 transition-colors text-[#1e293b]">
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-900 whitespace-nowrap">
                      {keyItem.name}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono font-medium text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-mono text-[11px] text-slate-800">
                          {keyItem.prefix}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(keyItem.fullSecret, keyItem.id)}
                          className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded"
                          title="Copiar prefijo"
                        >
                          {copiedKeyId === keyItem.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                      <span className="bg-blue-50 text-red-700 px-2 py-0.5 rounded font-medium text-[11px] border border-blue-200">
                        {keyItem.scope}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-600 whitespace-nowrap">
                      {keyItem.createdAt}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {keyItem.lastUsed}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-right whitespace-nowrap">
                      {/* Botón "Revocar" - Botón fantasma en rojo desaturado */}
                      <button
                        type="button"
                        onClick={() => setKeyToRevoke(keyItem)}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-transparent transition-colors font-medium text-xs inline-flex items-center gap-1 cursor-pointer"
                        title="Revocar clave de API"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Revocar</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    No hay claves de API activas. Presione "Nueva Clave" para generar credenciales de integración.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: NUEVA CLAVE DE API */}
      {isCreateKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-scale-up text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Generar Nueva Clave API
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateKeyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!generatedKeyResult ? (
              <form onSubmit={handleCreateApiKey} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nombre o Propósito de la Integración <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Servicio de Integración Aduana Central"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full clean-input px-3.5 py-2.5 text-xs text-slate-800 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Vigencia
                    </label>
                    <select
                      value={newKeyExpiration}
                      onChange={(e) => setNewKeyExpiration(e.target.value)}
                      className="w-full clean-input px-3.5 py-2.5 text-xs text-slate-800 rounded-xl focus:outline-none bg-white"
                    >
                      <option value="30d">30 Días</option>
                      <option value="90d">90 Días</option>
                      <option value="1y">1 Año</option>
                      <option value="never">Sin Expiración</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Alcance / Permisos
                    </label>
                    <select
                      value={newKeyScope}
                      onChange={(e) => setNewKeyScope(e.target.value)}
                      className="w-full clean-input px-3.5 py-2.5 text-xs text-slate-800 rounded-xl focus:outline-none bg-white"
                    >
                      <option value="read_only">Consultas & Lectura</option>
                      <option value="full">Acceso Total</option>
                    </select>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    La clave secreta solo se mostrará una vez al momento de su creación. Asegúrese de guardarla en un entorno seguro.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateKeyModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="clean-button-primary px-4 py-2 text-xs font-semibold rounded-xl shadow-sm"
                  >
                    Generar Clave
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">¡Clave API generada exitosamente!</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Clave Secreta de API (Copiar inmediatamente):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedKeyResult.fullSecret}
                      className="w-full bg-slate-100 border border-slate-300 font-mono text-xs px-3 py-2 rounded-xl text-slate-900 select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyText(generatedKeyResult.fullSecret, 'MODAL_KEY')}
                      className="clean-button-primary px-3 py-2 text-xs font-semibold rounded-xl shrink-0 flex items-center gap-1"
                    >
                      {copiedKeyId === 'MODAL_KEY' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsCreateKeyModalOpen(false)}
                    className="clean-button-primary px-4 py-2 text-xs font-semibold rounded-xl"
                  >
                    Entendido y Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMAR REVOCACIÓN DE CLAVE */}
      {keyToRevoke && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-4 animate-scale-up text-left">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Revocar Clave de API
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              ¿Está seguro de que desea revocar la clave <strong className="text-slate-900">"{keyToRevoke.name}"</strong>? Los servicios vinculados a este token perderán el acceso de inmediato.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setKeyToRevoke(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-semibold rounded-xl transition-colors shadow-sm"
              >
                Confirmar Revocación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER OFICIAL INSTITUCIONAL */}
      <footer className="pt-4 border-t border-slate-200 text-center text-xs font-normal text-slate-500 space-y-1">
        <p>© 2026 FASITLAC • Todos los derechos reservados</p>
        <p className="text-[11px] text-slate-400">Sistema Nacional de Aranceles • Plataforma Institucional de Control Arancelario</p>
      </footer>
    </div>
  );
}
