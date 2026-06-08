// src/pages/Statement.tsx
import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useStatement } from "../hooks/useStatement";
import { useAccount } from "../hooks/useAccount";
import { Spinner, Empty } from "../components/ui/index";
import { formatBRL, formatDateTime } from "../utils/format";

export function Statement() {
  const { data, loading, fetch } = useStatement();
  const { account, loading: aLoad } = useAccount();
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    fetch({ page, limit: 20, from: from || undefined, to: to || undefined });
  }, [page]);

  function applyFilter() {
    setPage(1);
    fetch({ page: 1, limit: 20, from: from || undefined, to: to || undefined });
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-navy">Extrato</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Movimentações detalhadas da conta
        </p>
      </div>

      {/* Balance summary */}
      {!aLoad && account && (
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
              Saldo atual
            </p>
            <p className="text-2xl font-semibold amount text-navy">
              {formatBRL(account.balance)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Ag. {account.agency} · Cc. {account.accountNumber}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
              Total de lançamentos
            </p>
            <p className="text-2xl font-semibold text-navy">
              {data?.pagination.total ?? "—"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              No período selecionado
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card px-5 py-4 flex items-end gap-4 flex-wrap">
        <div>
          <label className="label">De</label>
          <input
            type="date"
            className="input h-9 text-xs"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Até</label>
          <input
            type="date"
            className="input h-9 text-xs"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <button onClick={applyFilter} className="btn-primary h-9 text-xs">
          Filtrar
        </button>
        {(from || to) && (
          <button
            onClick={() => {
              setFrom("");
              setTo("");
              setPage(1);
              fetch({ page: 1, limit: 20 });
            }}
            className="btn-ghost h-9 text-xs"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Entries */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : !data || data.entries.length === 0 ? (
          <Empty message="Nenhum lançamento no período" />
        ) : (
          <>
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
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Valor
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Saldo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {data.entries.map((e) => (
                  <tr
                    key={e.entryId}
                    className="hover:bg-surface-muted transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          e.type === "DEBIT" ? "bg-danger-bg" : "bg-success-bg"
                        }`}
                      >
                        {e.type === "DEBIT" ? (
                          <TrendingDown size={14} className="text-danger" />
                        ) : (
                          <TrendingUp size={14} className="text-success" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-navy text-sm truncate max-w-56">
                        {e.description}
                      </p>
                      {e.paymentType && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {e.paymentType}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      {formatDateTime(e.createdAt)}
                    </td>
                    <td
                      className={`px-5 py-3.5 text-right font-medium amount ${
                        e.type === "DEBIT" ? "text-danger" : "text-success"
                      }`}
                    >
                      {e.type === "DEBIT" ? "−" : "+"} {formatBRL(e.amountBRL)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-xs text-slate-600">
                      {formatBRL(e.balanceBRL)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-surface-border">
                <p className="text-xs text-slate-500">
                  Página {data.pagination.page} de {data.pagination.totalPages}{" "}
                  · {data.pagination.total} lançamentos
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={!data.pagination.hasPrev}
                    onClick={() => setPage((p) => p - 1)}
                    className="btn-ghost h-8 w-8 p-0 disabled:opacity-40"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    disabled={!data.pagination.hasNext}
                    onClick={() => setPage((p) => p + 1)}
                    className="btn-ghost h-8 w-8 p-0 disabled:opacity-40"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
