import api from './axios';

export const checkAvailability = (params) =>
  api.get('/reservations/availability', { params });
export const createReservation = (data) => api.post('/reservations', data);
export const getMyReservations = () => api.get('/reservations/me');
export const cancelReservation = (id) =>
  api.patch(`/reservations/${id}/cancel`);
export const getAllReservations = (params) =>
  api.get('/reservations', { params });
export const updateReservation = (id, data) =>
  api.put(`/reservations/${id}`, data);
