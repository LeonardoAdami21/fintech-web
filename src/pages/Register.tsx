// src/pages/Register.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Alert, Spinner } from "../components/ui/index";
import { getAxiosError } from "../utils/format";

function PwdRule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li
      className={`flex items-center gap-1.5 text-xs ${ok ? "text-success-text" : "text-slate-400"}`}
    >
      {ok ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
      {label}
    </li>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    match: password === confirm && confirm.length > 0,
  };
  const allValid = Object.values(rules).every(Boolean);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!allValid) return;
    setError(null);
    setLoading(true);
    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(getAxiosError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-navy rounded-xl flex items-center justify-center shadow-navy">
            <Building2 size={18} className="text-white" />
          </div>
          <span className="font-semibold text-navy text-lg">FinTech Bank</span>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-semibold text-navy mb-1">Criar conta</h2>
          <p className="text-slate-500 text-sm mb-6">
            Preencha seus dados para começar.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">E-mail</label>
              <input
                type="email"
                className="input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <ul className="mt-2 space-y-1 pl-1">
                  <PwdRule ok={rules.length} label="Mínimo 8 caracteres" />
                  <PwdRule ok={rules.uppercase} label="Uma letra maiúscula" />
                  <PwdRule ok={rules.number} label="Um número" />
                </ul>
              )}
            </div>

            <div>
              <label className="label">Confirmar senha</label>
              <input
                type={showPwd ? "text" : "password"}
                className="input"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              {confirm && !rules.match && (
                <p className="text-xs text-danger mt-1">
                  As senhas não coincidem
                </p>
              )}
            </div>

            {error && <Alert type="error" message={error} />}

            <button
              type="submit"
              disabled={loading || !allValid}
              className="btn-primary w-full mt-2"
            >
              {loading ? <Spinner size="sm" /> : "Criar conta"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          Já tem conta?{" "}
          <Link
            to="/login"
            className="text-navy font-medium hover:text-navy-light"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
