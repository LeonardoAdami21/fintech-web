// src/pages/PaymentDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, CheckCheck } from "lucide-react";
import { paymentsApi } from "../api/payments";
import { Spinner } from "../components/ui/index";
import {
  PaymentStatusBadge,
  DirectionBadge,
  FraudDecisionBadge,
} from "../components/ui/StatusBadge";
import { formatDateTime, formatBRL } from "../utils/format";
import type { PaymentDetail as PD } from "../types";

export function PaymentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<PD | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    paymentsApi
      .getById(id)
      .then(({ data }) => setPayment(data.data))
      .catch(() => navigate("/payments"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  function copyId() {
    if (!payment) return;
    navigator.clipboard.writeText(payment.paymentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  if (!payment) return null;

  const rows = [
    {
      label: "ID do pagamento",
      value: payment.paymentId,
      mono: true,
      copy: true,
    },
    {
      label: "Chave de idempotência",
      value: payment.idempotencyKey,
      mono: true,
    },
    { label: "Tipo", value: payment.type },
    { label: "Data/hora", value: formatDateTime(payment.createdAt) },
    {
      label: "Processado em",
      value: payment.processedAt ? formatDateTime(payment.processedAt) : "—",
    },
    { label: "Conta origem", value: payment.senderAccountId, mono: true },
    { label: "Conta destino", value: payment.receiverAccountId, mono: true },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy transition-colors"
      >
        <ArrowLeft size={15} /> Voltar
      </button>

      <div>
        <h1 className="text-2xl font-semibold text-navy">
          Detalhe do pagamento
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {payment.description || "Sem descrição"}
        </p>
      </div>

      {/* Summary card */}
      <div className="navy-card rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <PaymentStatusBadge status={payment.status} />
          <DirectionBadge
            direction={payment.direction}
            amount={payment.amountBRL}
          />
        </div>
        <p className="text-4xl font-semibold amount mb-1">
          {formatBRL(payment.amountBRL)}
        </p>
        <p className="text-blue-200 text-sm">
          {payment.direction === "OUTGOING"
            ? "Transferência enviada"
            : "Transferência recebida"}
        </p>
        {payment.failureReason && (
          <div className="mt-3 bg-red-500/20 rounded-lg px-3 py-2 text-red-200 text-xs">
            Motivo da falha: {payment.failureReason}
          </div>
        )}
      </div>

      {/* Details table */}
      <div className="card divide-y divide-surface-border">
        {rows.map(({ label, value, mono, copy }) => (
          <div
            key={label}
            className="flex items-center justify-between px-5 py-3.5 gap-4"
          >
            <span className="text-xs text-slate-500 uppercase tracking-wide font-medium flex-shrink-0">
              {label}
            </span>
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`text-sm text-navy truncate ${mono ? "font-mono text-xs" : ""}`}
              >
                {value}
              </span>
              {copy && (
                <button
                  onClick={copyId}
                  className="text-slate-400 hover:text-navy transition-colors flex-shrink-0"
                >
                  {copied ? (
                    <CheckCheck size={13} className="text-success" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fraud analysis */}
      {payment.fraudAnalysis && (
        <div className="card p-5">
          <h2 className="font-semibold text-navy text-sm mb-4 flex items-center justify-between">
            Análise antifraude
            <FraudDecisionBadge
              decision={payment.fraudAnalysis.decision}
              score={payment.fraudAnalysis.riskScore}
            />
          </h2>

          {/* Risk score bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Score de risco</span>
              <span>{payment.fraudAnalysis.riskScore}/100</span>
            </div>
            <div className="h-2 bg-surface rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  payment.fraudAnalysis.riskScore >= 75
                    ? "bg-danger"
                    : payment.fraudAnalysis.riskScore >= 50
                      ? "bg-warn"
                      : "bg-success"
                }`}
                style={{ width: `${payment.fraudAnalysis.riskScore}%` }}
              />
            </div>
          </div>

          {payment.fraudAnalysis.factors.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                Fatores de risco
              </p>
              {payment.fraudAnalysis.factors.map((f) => (
                <div
                  key={f.code}
                  className="flex items-center justify-between bg-surface-muted rounded-lg px-3 py-2"
                >
                  <div>
                    <p className="text-xs font-medium text-navy">{f.code}</p>
                    <p className="text-xs text-slate-500">{f.description}</p>
                  </div>
                  <span className="text-xs font-mono font-medium text-warn-text">
                    +{f.weight}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Nenhum fator de risco identificado.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
