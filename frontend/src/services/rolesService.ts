import api from './api';

export const getRoles = () => api.get('/roles');
export const getRoleById = (id: string) => api.get(`/roles/${id}`);
export const createRole = (roleData: any) => api.post('/roles', roleData);
export const updateRole = (id: string, roleData: any) => api.put(`/roles/${id}`, roleData);
export const deleteRole = (id: string) => api.delete(`/roles/${id}`);
