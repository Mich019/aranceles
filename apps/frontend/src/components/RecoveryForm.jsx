import React, { useState } from 'react';
import { Mail, ArrowLeft, KeyRound, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import RecessedInput from './RecessedInput';
import SoftButton from './SoftButton';

export default function RecoveryForm({ onBackToLogin }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('Ingrese un correo electrónico válido');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 700);
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    setError('');
    if (!otpCode.trim() || otpCode.length < 4) {
      setError('Ingrese el código de verificación recibido');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 700);
  };

  const handleStep3Submit = (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 800);
  };

  return (
    <div className="space-y-4">
      {/* Back Link */}
      <div className="flex items-center justify-between pb-1">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
          {error}
        </div>
      )}

      {/* STEP 1: Request Email */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-3.5">
          <div className="text-left space-y-1">
            <h3 className="text-sm font-bold text-slate-800">Recuperar Contraseña</h3>
            <p className="text-xs text-slate-500">
              Ingrese su correo institucional registrado para recibir el enlace de restablecimiento.
            </p>
          </div>

          <RecessedInput
            id="recovery-email"
            label="Correo Institucional"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@aranceles.gob.ec"
            icon={Mail}
            required
          />

          <SoftButton type="submit" loading={loading} icon={Mail}>
            Enviar Enlace de Recuperación
          </SoftButton>
        </form>
      )}

      {/* STEP 2: Verification Code */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-3.5">
          <div className="text-left space-y-1">
            <h3 className="text-sm font-bold text-slate-800">Código de Verificación</h3>
            <p className="text-xs text-slate-500">
              Hemos enviado un código a <span className="font-semibold text-slate-700">{email}</span>.
            </p>
          </div>

          <RecessedInput
            id="otp-code"
            label="Código de Verificación"
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="123456"
            icon={KeyRound}
            required
          />

          <SoftButton type="submit" loading={loading} icon={ShieldCheck}>
            Verificar Código
          </SoftButton>
        </form>
      )}

      {/* STEP 3: Set New Password */}
      {step === 3 && (
        <form onSubmit={handleStep3Submit} className="space-y-3.5">
          <div className="text-left space-y-1">
            <h3 className="text-sm font-bold text-slate-800">Nueva Contraseña</h3>
            <p className="text-xs text-slate-500">
              Establezca su nueva contraseña de acceso al sistema.
            </p>
          </div>

          <RecessedInput
            id="new-password"
            label="Nueva Contraseña"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••••••"
            icon={Lock}
            required
          />

          <RecessedInput
            id="confirm-password"
            label="Confirmar Contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••••"
            icon={Lock}
            required
          />

          <SoftButton type="submit" loading={loading} icon={ShieldCheck}>
            Restablecer Contraseña
          </SoftButton>
        </form>
      )}

      {/* STEP 4: Success Message */}
      {step === 4 && (
        <div className="p-5 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">¡Contraseña Actualizada!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Su clave de acceso ha sido actualizada correctamente. Ya puede iniciar sesión.
            </p>
          </div>
          <SoftButton onClick={onBackToLogin} variant="primary">
            Iniciar Sesión
          </SoftButton>
        </div>
      )}
    </div>
  );
}
