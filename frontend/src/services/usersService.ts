import api from './api';

export const getUsers = () => api.get('/users');
export const deleteUser = (id: string) => api.delete(`/users/${id}`);
export const registerUser = (data: any) => api.post('/users', data);
export const updateUser = (id: string, data: any) => api.put(`/users/${id}`, data);
export const updateProfile = (data: any) => api.put('/users/profile', data);
