// src/api/accounts.ts
import { api } from './client'
import type { ApiResponse, Account, PixKey, StatementResult } from '../types'

export const accountsApi = {
  open: () =>
    api.post<ApiResponse<{ accountId: string; accountNumber: string; agency: string }>>('/accounts'),

  getMe: () =>
    api.get<ApiResponse<Account>>('/accounts/me'),

  registerPixKey: (keyType: PixKey['type'], keyValue: string) =>
    api.post<ApiResponse<PixKey>>('/accounts/me/pix-keys', { keyType, keyValue }),

  removePixKey: (keyValue: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/accounts/me/pix-keys/${encodeURIComponent(keyValue)}`),

  getStatement: (params: { page?: number; limit?: number; from?: string; to?: string } = {}) =>
    api.get<ApiResponse<StatementResult>>('/accounts/me/statement', { params }),
}
