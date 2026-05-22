// src/api/auth.ts
import { api } from './client'
import type { ApiResponse, LoginResult, RegisterResult, Session } from '../types'

export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<LoginResult>>('/auth/login', { email, password }),

  register: (email: string, password: string) =>
    api.post<ApiResponse<RegisterResult>>('/auth/register', { email, password }),

  refresh: (refreshToken: string) =>
    api.post<ApiResponse<LoginResult>>('/auth/refresh', { refreshToken }),

  logout: (sessionId?: string) =>
    api.delete<ApiResponse<{ revokedCount: number }>>('/auth/logout', { data: { sessionId } }),

  me: () =>
    api.get<ApiResponse<{ userId: string; email: string; role: string }>>('/auth/me'),

  sessions: () =>
    api.get<ApiResponse<Session[]>>('/auth/sessions'),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.patch<ApiResponse<{ message: string }>>('/auth/me/password', { currentPassword, newPassword }),
}
