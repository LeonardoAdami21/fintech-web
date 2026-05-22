// src/components/ui/StatusBadge.tsx
import type { PaymentStatus, PaymentDirection } from "../../types";
import { paymentStatusLabel } from "../../utils/format";

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    COMPLETED: "badge-success",
    FAILED: "badge-danger",
    REFUNDED: "badge-warn",
    PENDING: "badge-gray",
    PROCESSING: "badge-info",
  };
  return <span className={styles[status]}>{paymentStatusLabel(status)}</span>;
}

export function DirectionBadge({
  direction,
  amount,
}: {
  direction: PaymentDirection;
  amount: number;
}) {
  const isOut = direction === "OUTGOING";
  return (
    <span
      className={
        isOut
          ? "text-danger font-medium amount"
          : "text-success font-medium amount"
      }
    >
      {isOut ? "−" : "+"}{" "}
      {new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount)}
    </span>
  );
}

export function FraudDecisionBadge({
  decision,
  score,
}: {
  decision: string;
  score: number;
}) {
  if (decision === "APPROVED")
    return <span className="badge-success">Aprovado · {score}/100</span>;
  if (decision === "REVIEW")
    return <span className="badge-warn">Revisão · {score}/100</span>;
  return <span className="badge-danger">Bloqueado · {score}/100</span>;
}
