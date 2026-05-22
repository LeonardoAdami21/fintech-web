// src/utils/format.ts

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(
  iso: string,
  opts?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...opts,
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (mins < 1) return "agora";
  if (mins < 60) return `há ${mins}min`;
  if (hours < 24) return `há ${hours}h`;
  if (days === 1) return "ontem";
  if (days < 7) return `há ${days} dias`;
  return formatDate(iso);
}

export function maskAccountNumber(num: string): string {
  return num.replace(/(\d{4})(\d{4})/, "$1 $2");
}

export function pixKeyLabel(type: string): string {
  const map: Record<string, string> = {
    CPF: "CPF",
    CNPJ: "CNPJ",
    EMAIL: "E-mail",
    PHONE: "Telefone",
    RANDOM: "Chave aleatória",
  };
  return map[type] ?? type;
}

export function paymentStatusLabel(status: string): string {
  const map: Record<string, string> = {
    PENDING: "Pendente",
    PROCESSING: "Processando",
    COMPLETED: "Concluído",
    FAILED: "Falhou",
    REFUNDED: "Estornado",
  };
  return map[status] ?? status;
}

export function getAxiosError(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as any).response;
    const msg = res?.data?.message;
    if (Array.isArray(msg)) return msg[0];
    if (typeof msg === "string") return msg;
    if (typeof res?.data?.error === "string") return res.data.error;
  }
  if (err instanceof Error) return err.message;
  return "Erro inesperado";
}
