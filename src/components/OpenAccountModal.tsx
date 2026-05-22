// src/components/OpenAccountModal.tsx
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Modal, Alert, Spinner } from "./ui/index";
import { accountsApi } from "../api/accounts";
import { getAxiosError } from "../utils/format";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function OpenAccountModal({ open, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [info, setInfo] = useState<{
    accountNumber: string;
    agency: string;
  } | null>(null);

  async function handleOpen() {
    setError(null);
    setLoading(true);
    try {
      const { data } = await accountsApi.open();
      setInfo({
        accountNumber: data.data.accountNumber,
        agency: data.data.agency,
      });
      setDone(true);
      onSuccess();
    } catch (err) {
      setError(getAxiosError(err));
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    setDone(false);
    setInfo(null);
    setError(null);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Abrir conta corrente">
      {!done ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Ao abrir sua conta corrente você poderá fazer transferências PIX e
            TED, consultar extrato e gerenciar chaves PIX. A abertura é
            instantânea e gratuita.
          </p>
          {error && <Alert type="error" message={error} />}
          <div className="flex gap-3">
            <button onClick={handleClose} className="btn-ghost flex-1">
              Cancelar
            </button>
            <button
              onClick={handleOpen}
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? <Spinner size="sm" /> : "Abrir conta"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-2">
          <div className="w-14 h-14 bg-success-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-success" />
          </div>
          <h3 className="font-semibold text-navy text-lg mb-1">
            Conta aberta!
          </h3>
          <p className="text-slate-500 text-sm mb-4">
            Sua conta foi criada com sucesso.
          </p>
          {info && (
            <div className="bg-surface-muted rounded-xl p-4 text-left mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Agência</span>
                <span className="font-mono font-medium">{info.agency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Conta</span>
                <span className="font-mono font-medium">
                  {info.accountNumber}
                </span>
              </div>
            </div>
          )}
          <button onClick={handleClose} className="btn-primary w-full">
            Continuar
          </button>
        </div>
      )}
    </Modal>
  );
}
