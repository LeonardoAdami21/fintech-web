// src/api/payments.ts
import { api } from './client'
import type { ApiResponse, Payment, PaymentDetail, InitiatePaymentPayload, InitiatePaymentResult } from '../types'

export const paymentsApi = {
  list: (limit = 30) =>
    api.get<ApiResponse<Payment[]>>('/payments', { params: { limit } }),

  getById: (id: string) =>
    api.get<ApiResponse<PaymentDetail>>(`/payments/${id}`),

  initiate: (payload: InitiatePaymentPayload) =>
    api.post<ApiResponse<InitiatePaymentResult>>('/payments', payload),
}
