import api from './axios';

export const getTables = () => api.get('/tables');
export const createTable = (data) => api.post('/tables', data);
export const updateTable = (id, data) => api.put(`/tables/${id}`, data);
export const deleteTable = (id) => api.delete(`/tables/${id}`);
