import api from './api';

export const getMembers = () => api.get('/members');
export const getMemberDetails = (id: string) => api.get(`/members/${id}`);
export const createMember = (data: any) => api.post('/members', data);
export const updateMember = (id: string, data: any) => api.put(`/members/${id}`, data);
export const deleteMember = (id: string) => api.delete(`/members/${id}`);
