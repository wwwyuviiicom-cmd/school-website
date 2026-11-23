import { useState } from 'react';
import { AlertCircle, Eye, EyeOff, Lock, X } from 'lucide-react';
import { authenticate } from '@/utils/whatsappAlert';

interface PasswordModalProps {
  description: string;
  onClose: () => void;
  onAuthenticated: () => void;
}

export default function PasswordModal({ description, onClose, onAuthenticated }: PasswordModalProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = () => {
    if (!authenticate(passwordInput)) {
      setPasswordError('गलत पासवर्ड! आप संदेश नहीं भेज सकते।');
      return;
    }
    onAuthenticated();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn" />

      <div
        className="relative w-full max-w-sm p-7 rounded-2xl bg-ink-800 border border-ink-600/50 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-ink-700/60 border border-ink-600/40 flex items-center justify-center text-slate-400 hover:text-white hover:border-ink-500/60 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
            <Lock className="w-7 h-7 text-amber-500" />
          </div>
        </div>

        <h3 className="font-devanagari font-bold text-lg text-white text-center mb-2">
          सुरक्षा पासवर्ड
        </h3>
        <p className="text-sm text-slate-400 text-center mb-6">{description}</p>

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            autoFocus
            placeholder="पासवर्ड दर्ज करें"
            className="w-full px-4 py-3 pr-11 rounded-xl bg-ink-900/60 border border-ink-600/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
          />
          <button
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {passwordError && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4 animate-slideDown">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-400">{passwordError}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-xl bg-amber-500 text-ink-950 font-semibold text-sm hover:bg-amber-400 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 glow-amber"
        >
          <Lock className="w-4 h-4" />
          प्रमाणित करें
        </button>
      </div>
    </div>
  );
}
