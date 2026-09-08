import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to format errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Public API
export const PublicAPI = {
  getMandalInfo: () => api.get('/public/mandal').then(res => res.data.data),
  getMembers: (groupCode?: string) => api.get('/public/members', { params: { groupCode } }).then(res => res.data.data),
  getFinancialSummary: (year?: number, month?: number) => api.get('/public/monthly-summary', { params: { year, month } }).then(res => res.data.data),
  getEvents: () => api.get('/public/events').then(res => res.data.data),
  getExpenses: (limit?: number) => api.get('/public/expenses', { params: { limit } }).then(res => res.data.data),
  getMeetings: () => api.get('/public/meetings').then(res => res.data.data),
};

// Admin Auth API
export const AuthAPI = {
  login: (credentials: { email: string; password: string }) => api.post('/auth/login', credentials).then(res => res.data.data),
  logout: () => api.post('/auth/logout').then(res => res.data.data),
  getMe: () => api.get('/auth/me').then(res => res.data.data),
  changePassword: (data: { currentPassword: string; newPassword: string }) => api.post('/auth/change-password', data).then(res => res.data.data),
};

// Admin Members API
export const MembersAPI = {
  getMeta: () => api.get('/members/meta').then(res => res.data.data),
  getAll: (params?: any) => api.get('/members', { params }).then(res => res.data.data),
  getById: (id: number) => api.get(`/members/${id}`).then(res => res.data.data),
  create: (formData: FormData) => api.post('/members', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data.data),
  update: (id: number, formData: FormData) => api.patch(`/members/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data.data),
  delete: (id: number) => api.delete(`/members/${id}`).then(res => res.data.data),
};

// Admin Contributions API
export const ContributionsAPI = {
  getMonthly: (params?: any) => api.get('/contributions/monthly', { params }).then(res => res.data.data),
  createMonthly: (data: any) => api.post('/contributions/monthly', data).then(res => res.data.data),
  voidMonthly: (id: number, reason: string) => api.post(`/contributions/monthly/${id}/void`, { reason }).then(res => res.data.data),
  getFestival: (params?: any) => api.get('/contributions/festival', { params }).then(res => res.data.data),
  createFestival: (data: any) => api.post('/contributions/festival', data).then(res => res.data.data),
  voidFestival: (id: number, reason: string) => api.post(`/contributions/festival/${id}/void`, { reason }).then(res => res.data.data),
};

// Admin Events API
export const EventsAPI = {
  getAll: (params?: any) => api.get('/events', { params }).then(res => res.data.data),
  getById: (id: number) => api.get(`/events/${id}`).then(res => res.data.data),
  create: (data: any) => api.post('/events', data).then(res => res.data.data),
  update: (id: number, data: any) => api.patch(`/events/${id}`, data).then(res => res.data.data),
};

// Admin Expenses API
export const ExpensesAPI = {
  getCategories: () => api.get('/expenses/categories').then(res => res.data.data),
  getAll: (params?: any) => api.get('/expenses', { params }).then(res => res.data.data),
  create: (formData: FormData) => api.post('/expenses', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data.data),
  void: (id: number, reason: string) => api.post(`/expenses/${id}/void`, { reason }).then(res => res.data.data),
};

// Admin Meetings API
export const MeetingsAPI = {
  getAll: (params?: any) => api.get('/meetings', { params }).then(res => res.data.data),
  create: (formData: FormData) => api.post('/meetings', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data.data),
  update: (id: number, formData: FormData) => api.patch(`/meetings/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data.data),
  delete: (id: number) => api.delete(`/meetings/${id}`).then(res => res.data.data),
};

// Admin Reports API
export const ReportsAPI = {
  getDashboard: () => api.get('/reports/dashboard').then(res => res.data.data),
  getFinancialSummary: (year?: number) => api.get('/reports/financial-summary', { params: { year } }).then(res => res.data.data),
  getMonthlyMatrix: (year?: number, groupId?: number) => api.get('/reports/monthly-matrix', { params: { year, groupId } }).then(res => res.data.data),
};

// Admin Settings API
export const SettingsAPI = {
  get: () => api.get('/settings').then(res => res.data.data),
  update: (formData: FormData) => api.patch('/settings', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data.data),
};

// Admin Audit Logs API
export const AuditAPI = {
  getAll: (params?: any) => api.get('/audit-logs', { params }).then(res => res.data.data),
};
