// src/types/index.ts

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: number;
  refreshExpiresAt: string;
  userId: string;
  email: string;
  role: string;
}

export interface RegisterResult {
  userId: string;
  email: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

export interface Session {
  sessionId: string;
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
}

// ── Account ───────────────────────────────────────────────────────────────────
export interface PixKey {
  type: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM";
  value: string;
}

export interface Account {
  accountId: string;
  accountNumber: string;
  agency: string;
  balance: number;
  balanceCents: string;
  currency: string;
  status: "ACTIVE" | "BLOCKED" | "CLOSED";
  pixKeys: PixKey[];
}

// ── Statement ─────────────────────────────────────────────────────────────────
export interface LedgerEntry {
  entryId: string;
  type: "DEBIT" | "CREDIT";
  amountBRL: number;
  balanceBRL: number;
  description: string;
  paymentType: string | null;
  paymentDesc: string | null;
  counterpartAccountId: string | null;
  createdAt: string;
}

export interface StatementResult {
  accountId: string;
  accountNumber: string;
  currentBalance: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  entries: LedgerEntry[];
}

// ── Payments ──────────────────────────────────────────────────────────────────
export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED";
export type PaymentType = "PIX" | "TED" | "INTERNAL";
export type PaymentDirection = "OUTGOING" | "INCOMING";

export interface Payment {
  paymentId: string;
  type: PaymentType;
  status: PaymentStatus;
  amountBRL: number;
  description: string | null;
  direction: PaymentDirection;
  senderAccountId: string;
  receiverAccountId: string;
  processedAt: string | null;
  createdAt: string;
}

export interface PaymentDetail extends Payment {
  amountCents: string;
  idempotencyKey: string;
  failureReason: string | null;
  fraudAnalysis?: {
    analysisId: string;
    riskScore: number;
    decision: string;
    factors: Array<{ code: string; description: string; weight: number }>;
  };
}

export interface InitiatePaymentPayload {
  receiverPixKey: string;
  amountBRL: number;
  type: PaymentType;
  description?: string;
  idempotencyKey?: string;
}

export interface InitiatePaymentResult {
  paymentId: string;
  status: string;
  amountBRL: number;
  idempotencyKey: string;
  fraudAnalysis: {
    analysisId: string;
    riskScore: number;
    decision: string;
    factors: Array<{ code: string; description: string; weight: number }>;
  };
}

// ── API envelope ──────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}
