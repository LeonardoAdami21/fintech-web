// src/hooks/usePayments.ts
import { useState, useEffect, useCallback } from "react";
import { paymentsApi } from "../api/payments";
import type { Payment } from "../types";

export function usePayments(limit = 30) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await paymentsApi.list(limit);
      setPayments(data.data);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "Erro ao carregar pagamentos";
      setError(typeof msg === "string" ? msg : msg[0]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { payments, loading, error, refetch: fetch };
}
