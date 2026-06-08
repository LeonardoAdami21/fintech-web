// src/pages/PixKeys.tsx
import { useState } from "react";
import { Key, Plus, Trash2, Copy, CheckCheck } from "lucide-react";
import { useAccount } from "../hooks/useAccount";
import { accountsApi } from "../api/accounts";
import { Spinner, Alert, Modal, Empty } from "../components/ui/index";
import { getAxiosError, pixKeyLabel } from "../utils/format";
import type { PixKey } from "../types";

const PIX_KEY_TYPES: PixKey["type"][] = [
  "CPF",
  "CNPJ",
  "EMAIL",
  "PHONE",
  "RANDOM",
];

const TYPE_PLACEHOLDERS: Record<PixKey["type"], string> = {
  CPF: "00000000000 (11 dígitos)",
  CNPJ: "00000000000000 (14 dígitos)",
  EMAIL: "seu@email.com",
  PHONE: "+5511999999999",
  RANDOM: "Deixe em branco para gerar automaticamente",
};

export function PixKeys() {
  const { account, loading, refetch } = useAccount();
  const [showModal, setShowModal] = useState(false);
  const [keyType, setKeyType] = useState<PixKey["type"]>("EMAIL");
  const [keyValue, setKeyValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function handleCopy(value: string) {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const value =
        keyType === "RANDOM" && !keyValue.trim()
          ? crypto.randomUUID()
          : keyValue.trim();
      await accountsApi.registerPixKey(keyType, value);
      await refetch();
      setShowModal(false);
      setKeyValue("");
    } catch (err) {
      setError(getAxiosError(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(keyValue: string) {
    if (!confirm(`Remover chave "${keyValue}"?`)) return;
    setDeleting(keyValue);
    try {
      await accountsApi.removePixKey(keyValue);
      await refetch();
    } catch (err) {
      alert(getAxiosError(err));
    } finally {
      setDeleting(null);
    }
  }

  const TYPE_COLORS: Record<PixKey["type"], string> = {
    CPF: "bg-blue-50 text-blue-700",
    CNPJ: "bg-purple-50 text-purple-700",
    EMAIL: "bg-navy-faint text-navy",
    PHONE: "bg-green-50 text-green-700",
    RANDOM: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Chaves PIX</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {account
              ? `${account.pixKeys.length}/5 chaves cadastradas`
              : "Gerencie suas chaves PIX"}
          </p>
        </div>
        {account && account.pixKeys.length < 5 && (
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={15} /> Adicionar chave
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : !account ? (
        <div className="card p-8 text-center text-slate-400">
          <Key size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            Abra uma conta corrente para cadastrar chaves PIX.
          </p>
        </div>
      ) : account.pixKeys.length === 0 ? (
        <div className="card">
          <Empty message="Nenhuma chave PIX cadastrada" />
          <div className="pb-6 flex justify-center">
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary text-sm"
            >
              <Plus size={14} /> Cadastrar primeira chave
            </button>
          </div>
        </div>
      ) : (
        <div className="card divide-y divide-surface-border">
          {account.pixKeys.map((pk) => (
            <div key={pk.value} className="flex items-center gap-4 px-5 py-4">
              <div
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ${TYPE_COLORS[pk.type]}`}
              >
                {pixKeyLabel(pk.type)}
              </div>
              <p className="flex-1 font-mono text-sm text-navy truncate">
                {pk.value}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopy(pk.value)}
                  className="p-1.5 rounded-lg hover:bg-surface text-slate-400 hover:text-navy transition-colors"
                  title="Copiar"
                >
                  {copied === pk.value ? (
                    <CheckCheck size={14} className="text-success" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(pk.value)}
                  disabled={deleting === pk.value}
                  className="p-1.5 rounded-lg hover:bg-danger-bg text-slate-400 hover:text-danger transition-colors disabled:opacity-40"
                  title="Remover"
                >
                  {deleting === pk.value ? (
                    <Spinner size="sm" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add key modal */}
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setError(null);
          setKeyValue("");
        }}
        title="Adicionar chave PIX"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Tipo de chave</label>
            <select
              className="input"
              value={keyType}
              onChange={(e) => {
                setKeyType(e.target.value as any);
                setKeyValue("");
              }}
            >
              {PIX_KEY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {pixKeyLabel(t)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Valor da chave</label>
            <input
              className="input font-mono"
              placeholder={TYPE_PLACEHOLDERS[keyType]}
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              required={keyType !== "RANDOM"}
            />
            {keyType === "RANDOM" && (
              <p className="text-xs text-slate-400 mt-1">
                Uma chave aleatória (UUID) será gerada automaticamente.
              </p>
            )}
          </div>
          {error && <Alert type="error" message={error} />}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-ghost flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1"
            >
              {saving ? <Spinner size="sm" /> : "Cadastrar"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
