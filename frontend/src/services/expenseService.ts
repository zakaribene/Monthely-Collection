import api from './api';

export const getExpenses = () => api.get('/expenses');
export const createExpense = (data: any) => api.post('/expenses', data);
export const updateExpense = (id: string, data: any) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id: string) => api.delete(`/expenses/${id}`);
