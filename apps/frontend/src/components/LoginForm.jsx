import React, { useState } from 'react';
import { User, Lock, LogIn, AlertCircle, Check } from 'lucide-react';
import RecessedInput from './RecessedInput';
import SoftButton from './SoftButton';

export default function LoginForm({
  onSwitchToRecovery,
  onLoginSuccess,
  failedAttemptCount = 0,
}) {
  const [username, setUsername] = useState('usuario@aranceles.gob.ec');
  const [password, setPassword] = useState('Password123!');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setLoginError('');

    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Ingrese su usuario o correo';
    if (!password) newErrors.password = 'Ingrese su contraseña';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (password === 'wrong' || password === 'error') {
        setLoginError('Credenciales incorrectas. Verifique su usuario y contraseña.');
      } else {
        if (onLoginSuccess) onLoginSuccess({ username, timestamp: new Date().toLocaleTimeString() });
      }
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Clean Error Banner */}
      {loginError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{loginError}</span>
        </div>
      )}

      {/* Credentials Inputs */}
      <div className="space-y-3.5">
        <RecessedInput
          id="username"
          label="Usuario o Correo Institucional"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="usuario@aranceles.gob.ec"
          icon={User}
          error={errors.username}
          required
        />

        <RecessedInput
          id="password"
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          icon={Lock}
          error={errors.password}
          required
        />
      </div>

      {/* Remember me & Recover Password row */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => setRememberMe(!rememberMe)}
          className="flex items-center gap-2 text-xs text-slate-600 font-medium select-none group"
        >
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
              rememberMe ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
            }`}
          >
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span>Recordar sesión</span>
        </button>

        <button
          type="button"
          onClick={onSwitchToRecovery}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          ¿Olvidó su contraseña?
        </button>
      </div>

      {/* Primary Submit Button */}
      <div className="pt-2">
        <SoftButton type="submit" loading={loading} icon={LogIn}>
          Iniciar Sesión
        </SoftButton>
      </div>
    </form>
  );
}
