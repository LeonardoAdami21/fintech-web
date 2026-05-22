// src/hooks/useAccount.ts
import { useState, useEffect, useCallback } from "react";
import { accountsApi } from "../api/accounts";
import type { Account } from "../types";

export function useAccount() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await accountsApi.getMe();
      setAccount(data.data);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "Erro ao carregar conta";
      setError(typeof msg === "string" ? msg : msg[0]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { account, loading, error, refetch: fetch };
}
