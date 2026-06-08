// src/pages/Dashboard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  TrendingUp,
  RefreshCw,
  FileText,
  Building2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAccount } from "../hooks/useAccount";
import { usePayments } from "../hooks/usePayments";
import { Spinner, Empty } from "../components/ui/index";
import {
  PaymentStatusBadge,
  DirectionBadge,
} from "../components/ui/StatusBadge";
import { SendPixModal } from "../components/SendPixModal";
import { OpenAccountModal } from "../components/OpenAccountModal";
import { formatBRL, formatRelative } from "../utils/format";

export function Dashboard() {
  const { user } = useAuth();
  const { account, loading: aLoad, refetch: refetchAcc } = useAccount();
  const { payments, loading: pLoad, refetch: refetchPay } = usePayments(5);
  const navigate = useNavigate();
  const [showPix, setShowPix] = useState(false);
  const [showOpen, setShowOpen] = useState(false);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  function handleSuccess() {
    refetchAcc();
    refetchPay();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm">{greeting()},</p>
          <h1 className="text-2xl font-semibold text-navy">
            {user?.email?.split("@")[0]}
          </h1>
        </div>
        <button onClick={handleSuccess} className="btn-ghost gap-1.5 text-xs">
          <RefreshCw size={13} /> Atualizar
        </button>
      </div>

      {/* No account banner */}
      {!aLoad && !account && (
        <div className="card p-6 border-dashed border-2 border-navy/20 bg-navy-faint flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center flex-shrink-0">
            <Building2 size={20} className="text-navy" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-navy text-sm">
              Abra sua conta corrente
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              Necessário para fazer transferências e usar chaves PIX.
            </p>
          </div>
          <button
            onClick={() => setShowOpen(true)}
            className="btn-primary text-xs"
          >
            <Plus size={14} /> Abrir conta
          </button>
        </div>
      )}

      {/* Balance card */}
      {aLoad ? (
        <div className="navy-card rounded-2xl p-7 flex items-center justify-center h-40">
          <Spinner size="md" />
        </div>
      ) : account ? (
        <div className="navy-card rounded-2xl p-7 text-white shadow-navy">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-blue-200 text-xs uppercase tracking-widest mb-1">
                Saldo disponível
              </p>
              <p className="text-4xl font-semibold amount">
                {formatBRL(account.balance)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-[11px]">Ag. {account.agency}</p>
              <p className="text-blue-200 text-[11px] font-mono">
                {account.accountNumber}
              </p>
              <span
                className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  account.status === "ACTIVE"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {account.status === "ACTIVE" ? "Ativa" : account.status}
              </span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowPix(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium py-2.5 rounded-xl transition-all"
            >
              <ArrowUpRight size={16} /> Transferir PIX
            </button>
            <button
              onClick={() => navigate("/statement")}
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2.5 rounded-xl transition-all"
            >
              <FileText size={16} /> Ver extrato
            </button>
          </div>
        </div>
      ) : null}

      {/* Stats row */}
      {account && !aLoad && (
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Saídas (mês)",
              icon: ArrowUpRight,
              color: "text-danger",
              bg: "bg-danger-bg",
              value: formatBRL(
                payments
                  .filter(
                    (p) =>
                      p.direction === "OUTGOING" && p.status === "COMPLETED",
                  )
                  .reduce((s, p) => s + p.amountBRL, 0),
              ),
            },
            {
              label: "Entradas (mês)",
              icon: ArrowDownLeft,
              color: "text-success",
              bg: "bg-success-bg",
              value: formatBRL(
                payments
                  .filter(
                    (p) =>
                      p.direction === "INCOMING" && p.status === "COMPLETED",
                  )
                  .reduce((s, p) => s + p.amountBRL, 0),
              ),
            },
            {
              label: "Transações",
              icon: TrendingUp,
              color: "text-navy",
              bg: "bg-navy-faint",
              value: String(payments.length),
            },
          ].map(({ label, icon: Icon, color, bg, value }) => (
            <div key={label} className="stat-card">
              <div
                className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}
              >
                <Icon size={16} className={color} />
              </div>
              <p className={`text-lg font-semibold amount ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent transactions */}
      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
          <h2 className="font-semibold text-navy text-sm">
            Transações recentes
          </h2>
          <button
            onClick={() => navigate("/payments")}
            className="text-xs text-accent hover:text-accent-dark font-medium"
          >
            Ver todas →
          </button>
        </div>

        {pLoad ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : payments.length === 0 ? (
          <Empty message="Nenhuma transação ainda" />
        ) : (
          <ul className="divide-y divide-surface-border">
            {payments.map((p) => (
              <li
                key={p.paymentId}
                onClick={() => navigate(`/payments/${p.paymentId}`)}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-muted cursor-pointer transition-colors"
              >
                {/* Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    p.direction === "OUTGOING"
                      ? "bg-danger-bg"
                      : "bg-success-bg"
                  }`}
                >
                  {p.direction === "OUTGOING" ? (
                    <ArrowUpRight size={16} className="text-danger" />
                  ) : (
                    <ArrowDownLeft size={16} className="text-success" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy truncate">
                    {p.description ||
                      (p.direction === "OUTGOING"
                        ? "Transferência enviada"
                        : "Transferência recebida")}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">
                      {formatRelative(p.createdAt)}
                    </span>
                    <span className="text-slate-200">·</span>
                    <PaymentStatusBadge status={p.status} />
                  </div>
                </div>

                {/* Amount */}
                <DirectionBadge direction={p.direction} amount={p.amountBRL} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modals */}
      <SendPixModal
        open={showPix}
        onClose={() => setShowPix(false)}
        onSuccess={handleSuccess}
      />
      <OpenAccountModal
        open={showOpen}
        onClose={() => setShowOpen(false)}
        onSuccess={refetchAcc}
      />
    </div>
  );
}
