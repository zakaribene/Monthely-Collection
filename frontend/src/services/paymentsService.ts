import api from './api';

export const getPayments = (params: any) => api.get('/payments', { params });
export const markAsPaid = (id: string, data: any) => api.put(`/payments/${id}/paid`, data);
export const getPaymentMethods = () => api.get('/payment-methods');
