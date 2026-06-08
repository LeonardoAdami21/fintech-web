// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Alert, Spinner } from "../components/ui/index";
import { getAxiosError } from "../utils/format";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(getAxiosError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 navy-card flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg">FinTech Bank</span>
        </div>

        <div>
          <h1 className="text-4xl font-semibold text-white leading-tight mb-4">
            Serviços financeiros
            <br />
            com segurança e agilidade.
          </h1>
          <p className="text-blue-200 text-base leading-relaxed">
            Transferências PIX instantâneas, controle de saldo em tempo real e
            proteção antifraude em todas as operações.
          </p>
        </div>

        <div className="flex gap-8">
          {[
            { label: "Transferências", value: "PIX & TED" },
            { label: "Proteção", value: "Anti-fraude" },
            { label: "Disponível", value: "24h / 7 dias" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-white font-semibold text-sm">{value}</p>
              <p className="text-blue-300 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            <span className="font-semibold text-navy">FinTech Bank</span>
          </div>

          <h2 className="text-2xl font-semibold text-navy mb-1">
            Acesse sua conta
          </h2>
          <p className="text-slate-500 text-sm mb-7">
            Insira suas credenciais para continuar.
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
                autoComplete="email"
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
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <Alert type="error" message={error} />}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? <Spinner size="sm" /> : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Não tem conta?{" "}
            <Link
              to="/register"
              className="text-navy font-medium hover:text-navy-light transition-colors"
            >
              Criar conta
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-navy-faint rounded-xl border border-navy/10">
            <p className="text-xs font-medium text-navy mb-2">
              Credenciais de demonstração
            </p>
            <div className="space-y-1 text-xs text-slate-600 font-mono">
              <p>alice@example.com · Alice@123456</p>
              <p>bob@example.com · Bob@123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
