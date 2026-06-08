// src/pages/Settings.tsx
import { useState, useEffect } from "react";
import { Eye, EyeOff, Monitor, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth";
import { Spinner, Alert } from "../components/ui/index";
import { getAxiosError, formatDateTime } from "../utils/format";
import type { Session } from "../types";

export function Settings() {
  const { user, logout } = useAuth();

  // ── Change password state ──
  const [current, setCurrent] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pwdLoad, setPwdLoad] = useState(false);
  const [pwdErr, setPwdErr] = useState<string | null>(null);
  const [pwdOk, setPwdOk] = useState(false);

  // ── Sessions state ──
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessLoad, setSessLoad] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    authApi
      .sessions()
      .then(({ data }) => setSessions(data.data))
      .catch(() => {})
      .finally(() => setSessLoad(false));
  }, []);

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      setPwdErr("As senhas não coincidem");
      return;
    }
    setPwdErr(null);
    setPwdOk(false);
    setPwdLoad(true);
    try {
      await authApi.changePassword(current, newPwd);
      setPwdOk(true);
      setCurrent("");
      setNewPwd("");
      setConfirmPwd("");
      // After 2s, logout (all sessions revoked by backend)
      setTimeout(() => logout(), 2500);
    } catch (err) {
      setPwdErr(getAxiosError(err));
    } finally {
      setPwdLoad(false);
    }
  }

  async function revokeSession(sessionId: string) {
    setRevoking(sessionId);
    try {
      await authApi.logout(sessionId);
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
    } catch (err) {
      alert(getAxiosError(err));
    } finally {
      setRevoking(null);
    }
  }

  async function revokeAll() {
    if (!confirm("Deseja encerrar todas as sessões? Você será desconectado."))
      return;
    try {
      await authApi.logout();
      logout();
    } catch {}
  }

  const pwdRules = {
    length: newPwd.length >= 8,
    uppercase: /[A-Z]/.test(newPwd),
    number: /[0-9]/.test(newPwd),
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-navy">Configurações</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Gerencie sua conta e segurança
        </p>
      </div>

      {/* Account info */}
      <div className="card p-5">
        <h2 className="font-semibold text-navy text-sm mb-4">
          Informações da conta
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-surface-border">
            <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
              E-mail
            </span>
            <span className="text-sm font-medium text-navy">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
              Perfil
            </span>
            <span className="badge-info">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="card p-5">
        <h2 className="font-semibold text-navy text-sm mb-4">Alterar senha</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="label">Senha atual</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                className="input pr-10"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="label">Nova senha</label>
            <input
              type={showPwd ? "text" : "password"}
              className="input"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              required
              placeholder="••••••••"
            />
            {newPwd && (
              <ul className="mt-2 space-y-1">
                {[
                  { ok: pwdRules.length, text: "Mínimo 8 caracteres" },
                  { ok: pwdRules.uppercase, text: "Uma letra maiúscula" },
                  { ok: pwdRules.number, text: "Um número" },
                ].map(({ ok, text }) => (
                  <li
                    key={text}
                    className={`text-xs flex items-center gap-1.5 ${ok ? "text-success-text" : "text-slate-400"}`}
                  >
                    <span>{ok ? "✓" : "○"}</span> {text}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="label">Confirmar nova senha</label>
            <input
              type={showPwd ? "text" : "password"}
              className="input"
              value={confirm.toString()}
              onChange={(e) => setConfirmPwd(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          {pwdErr && <Alert type="error" message={pwdErr} />}
          {pwdOk && (
            <Alert
              type="success"
              message="Senha alterada! Redirecionando para login…"
            />
          )}
          <button
            type="submit"
            disabled={pwdLoad || !Object.values(pwdRules).every(Boolean)}
            className="btn-primary"
          >
            {pwdLoad ? <Spinner size="sm" /> : "Alterar senha"}
          </button>
        </form>
      </div>

      {/* Sessions */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-navy text-sm">Sessões ativas</h2>
          {sessions.length > 1 && (
            <button
              onClick={revokeAll}
              className="btn-danger text-xs py-1.5 px-3"
            >
              Encerrar todas
            </button>
          )}
        </div>

        {sessLoad ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">
            Nenhuma sessão ativa
          </p>
        ) : (
          <ul className="divide-y divide-surface-border">
            {sessions.map((s) => (
              <li key={s.sessionId} className="flex items-center gap-3 py-3">
                <div className="w-8 h-8 bg-navy-faint rounded-lg flex items-center justify-center flex-shrink-0">
                  <Monitor size={14} className="text-navy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-slate-500 truncate">
                    {s.sessionId}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Criada {formatDateTime(s.createdAt)} · Expira{" "}
                    {formatDateTime(s.expiresAt)}
                  </p>
                </div>
                <button
                  onClick={() => revokeSession(s.sessionId)}
                  disabled={revoking === s.sessionId}
                  className="p-1.5 rounded-lg hover:bg-danger-bg text-slate-400 hover:text-danger transition-colors disabled:opacity-40"
                  title="Encerrar sessão"
                >
                  {revoking === s.sessionId ? (
                    <Spinner size="sm" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
