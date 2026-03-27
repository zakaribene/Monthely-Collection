import api from './api';

export const getPermissions = () => api.get('/permissions');
export const getPermissionByRoleId = (roleId: string) => api.get(`/permissions/${roleId}`);
export const updatePermissionByRoleId = (roleId: string, pages: any) => api.put(`/permissions/${roleId}`, { pages });
