// src/components/SendPixModal.tsx
import { useState } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Modal, Alert, Spinner } from "./ui/index";
import { paymentsApi } from "../api/payments";
import { getAxiosError, formatBRL } from "../utils/format";
import type { InitiatePaymentResult } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "form" | "success" | "blocked";

export function SendPixModal({ open, onClose, onSuccess }: Props) {
  const [pixKey, setPixKey] = useState("");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("form");
  const [result, setResult] = useState<InitiatePaymentResult | null>(null);

  function handleClose() {
    if (loading) return;
    setPixKey("");
    setAmount("");
    setDesc("");
    setError(null);
    setStep("form");
    setResult(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const amt = parseFloat(amount.replace(",", "."));
    if (isNaN(amt) || amt <= 0) {
      setError("Valor inválido");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { data } = await paymentsApi.initiate({
        receiverPixKey: pixKey.trim(),
        amountBRL: amt,
        type: "PIX",
        description: desc || undefined,
      });
      setResult(data.data);
      if (data.data.fraudAnalysis.decision === "BLOCKED") {
        setStep("blocked");
      } else {
        setStep("success");
        onSuccess();
      }
    } catch (err) {
      // Check if it's a fraud block response
      const res = (err as any)?.response;
      if (
        res?.status === 403 &&
        res?.data?.message === "Payment blocked by fraud analysis"
      ) {
        setStep("blocked");
      } else {
        setError(getAxiosError(err));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Transferência PIX">
      {step === "form" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Chave PIX do destinatário</label>
            <input
              className="input"
              placeholder="E-mail, CPF, CNPJ, telefone ou chave aleatória"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Valor (R$)</label>
            <input
              className="input font-mono"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Descrição (opcional)</label>
            <input
              className="input"
              placeholder="Ex: Aluguel, pagamento de conta…"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={100}
            />
          </div>
          {error && <Alert type="error" message={error} />}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="btn-ghost flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? <Spinner size="sm" /> : "Confirmar PIX"}
            </button>
          </div>
        </form>
      )}

      {step === "success" && result && (
        <div className="text-center py-2">
          <div className="w-14 h-14 bg-success-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-success" />
          </div>
          <h3 className="font-semibold text-navy text-lg mb-1">
            Transferência realizada!
          </h3>
          <p className="text-slate-500 text-sm mb-4">
            Seu PIX foi processado com sucesso.
          </p>
          <div className="bg-surface-muted rounded-xl p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Valor</span>
              <span className="font-medium amount text-navy">
                {formatBRL(result.amountBRL)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className="font-medium text-success-text">Concluído</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Risco fraude</span>
              <span className="font-medium">
                {result.fraudAnalysis.riskScore}/100
              </span>
            </div>
          </div>
          <button onClick={handleClose} className="btn-primary w-full">
            Fechar
          </button>
        </div>
      )}

      {step === "blocked" && (
        <div className="text-center py-2">
          <div className="w-14 h-14 bg-danger-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-danger" />
          </div>
          <h3 className="font-semibold text-navy text-lg mb-1">
            Transferência bloqueada
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            Nosso sistema de antifraude identificou um risco elevado nesta
            operação. Entre em contato com o suporte se necessário.
          </p>
          <button onClick={handleClose} className="btn-ghost w-full">
            Fechar
          </button>
        </div>
      )}
    </Modal>
  );
}
