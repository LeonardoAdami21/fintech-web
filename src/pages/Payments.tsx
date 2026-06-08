// src/pages/Payments.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownLeft, Plus, Search } from "lucide-react";
import { usePayments } from "../hooks/usePayments";
import { Spinner, Empty } from "../components/ui/index";
import {
  PaymentStatusBadge,
  DirectionBadge,
} from "../components/ui/StatusBadge";
import { SendPixModal } from "../components/SendPixModal";
import { formatDateTime } from "../utils/format";

export function Payments() {
  const { payments, loading, refetch } = usePayments(50);
  const navigate = useNavigate();
  const [showPix, setShowPix] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | "INCOMING" | "OUTGOING">("ALL");

  const filtered = payments.filter((p) => {
    const matchDir = filter === "ALL" || p.direction === filter;
    const matchQ =
      !query ||
      (p.description ?? "").toLowerCase().includes(query.toLowerCase());
    return matchDir && matchQ;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Pagamentos</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Histórico completo de transferências
          </p>
        </div>
        <button onClick={() => setShowPix(true)} className="btn-primary">
          <Plus size={15} /> Nova transferência
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="input pl-9 h-9 text-xs"
            placeholder="Buscar por descrição…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex rounded-lg border border-surface-border bg-white overflow-hidden shadow-card">
          {(["ALL", "OUTGOING", "INCOMING"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-navy text-white"
                  : "text-slate-500 hover:bg-surface-muted"
              }`}
            >
              {f === "ALL"
                ? "Todos"
                : f === "OUTGOING"
                  ? "Enviados"
                  : "Recebidos"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <Empty message="Nenhuma transação encontrada" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-surface-muted">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Tipo
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Descrição
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Data
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((p) => (
                <tr
                  key={p.paymentId}
                  onClick={() => navigate(`/payments/${p.paymentId}`)}
                  className="hover:bg-surface-muted cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        p.direction === "OUTGOING"
                          ? "bg-danger-bg"
                          : "bg-success-bg"
                      }`}
                    >
                      {p.direction === "OUTGOING" ? (
                        <ArrowUpRight size={14} className="text-danger" />
                      ) : (
                        <ArrowDownLeft size={14} className="text-success" />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-navy truncate max-w-48">
                      {p.description ||
                        (p.direction === "OUTGOING"
                          ? "Transferência enviada"
                          : "Transferência recebida")}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{p.type}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">
                    {formatDateTime(p.createdAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <PaymentStatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <DirectionBadge
                      direction={p.direction}
                      amount={p.amountBRL}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <SendPixModal
        open={showPix}
        onClose={() => setShowPix(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
