// src/hooks/useStatement.ts
import { useState, useCallback } from "react";
import { accountsApi } from "../api/accounts";
import type { StatementResult } from "../types";

interface StatementFilter {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
}

export function useStatement() {
  const [data, setData] = useState<StatementResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (filter: StatementFilter = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await accountsApi.getStatement(filter);
      setData(res.data.data);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "Erro ao carregar extrato";
      setError(typeof msg === "string" ? msg : msg[0]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetch };
}
