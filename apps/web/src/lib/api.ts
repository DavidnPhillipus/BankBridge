import type {
  Account,
  AiInsightsResponse,
  AnalyticsOverview,
  Application,
  AuditLog,
  AuthResponse,
  Bank,
  Consent,
  CreatedApiKey,
  CreateApplicationInput,
  CreateConsentInput,
  LoginInput,
  NotificationPage,
  PaginationMeta,
  RegisterInput,
  TransactionPage,
  UnreadCount,
} from '@bankbridge/contracts';
import { apiClient } from './api-client';

export interface PublicApplication {
  id: string;
  name: string;
  description: string | null;
}

export const authApi = {
  login: (input: LoginInput) => apiClient.post<AuthResponse>('/auth/login', input),
  register: (input: RegisterInput) => apiClient.post<AuthResponse>('/auth/register', input),
  logout: () => apiClient.post<void>('/auth/logout'),
};

export const accountsApi = {
  list: () => apiClient.get<Account[]>('/accounts'),
  sync: () => apiClient.post<Account[]>('/accounts/sync'),
  balance: (id: string) => apiClient.get<{ accountId: string; balance: number; availableBalance: number; currency: string }>(`/accounts/${id}/balance`),
};

export const transactionsApi = {
  list: (accountId: string, params?: { page?: number; pageSize?: number }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.pageSize) q.set('pageSize', String(params.pageSize));
    const qs = q.toString();
    return apiClient.get<TransactionPage>(`/accounts/${accountId}/transactions${qs ? `?${qs}` : ''}`);
  },
};

export const consentsApi = {
  list: () => apiClient.get<Consent[]>('/consents'),
  grant: (input: CreateConsentInput) => apiClient.post<Consent>('/consents', input),
  revoke: (id: string) => apiClient.delete(`/consents/${id}`),
};

export const analyticsApi = {
  overview: (months = 6) => apiClient.get<AnalyticsOverview>(`/analytics/overview?months=${months}`),
};

export const insightsApi = {
  list: (months = 6) => apiClient.get<AiInsightsResponse>(`/ai-insights?months=${months}`),
};

export const notificationsApi = {
  list: (page = 1) => apiClient.get<NotificationPage>(`/notifications?page=${page}&pageSize=20`),
  unreadCount: () => apiClient.get<UnreadCount>('/notifications/unread-count'),
  markRead: (id: string) => apiClient.patch<void>(`/notifications/${id}/read`),
  markAllRead: () => apiClient.post<{ marked: number }>('/notifications/read-all'),
};

export const banksApi = {
  list: () => apiClient.get<Bank[]>('/banks'),
};

export const catalogApi = {
  applications: () => apiClient.get<PublicApplication[]>('/applications/catalog'),
};

export const developerApi = {
  applications: () => apiClient.get<Application[]>('/applications'),
  createApplication: (input: CreateApplicationInput) =>
    apiClient.post<Application>('/applications', input),
  apiKeys: (applicationId: string) =>
    apiClient.get<import('@bankbridge/contracts').ApiKey[]>(`/api-keys?applicationId=${applicationId}`),
  createApiKey: (input: import('@bankbridge/contracts').CreateApiKeyInput) =>
    apiClient.post<CreatedApiKey>('/api-keys', input),
  revokeApiKey: (id: string) => apiClient.delete(`/api-keys/${id}`),
};

export interface AuditLogPage {
  data: AuditLog[];
  meta: PaginationMeta;
}

export const adminApi = {
  auditLogs: (page = 1, pageSize = 20) =>
    apiClient.get<AuditLogPage>(`/audit-logs/admin?page=${page}&pageSize=${pageSize}`),
};
