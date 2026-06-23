import client from './client';
import type { Barber } from '../types/models';
import type { CreateBarberRequest } from '../types/api';

export const barbersApi = {
  getAll() { return client.get<Barber[]>('/barbers'); },
  create(data: CreateBarberRequest) { return client.post<Barber>('/barbers', data); },
  update(id: string, data: Partial<CreateBarberRequest>) { return client.put<Barber>(`/barbers/${id}`, data); },
  delete(id: string) { return client.delete(`/barbers/${id}`); },
  getMyProfile() { return client.get<Barber>('/barber/me'); },
  updateMyProfile(data: Partial<Barber>) { return client.put<Barber>('/barber/me', data); },
};
