import client from './client';
import type { Service } from '../types/models';
import type { CreateServiceRequest } from '../types/api';

export const servicesApi = {
  getAll() { return client.get<Service[]>('/services'); },
  create(data: CreateServiceRequest) { return client.post<Service>('/services', data); },
  update(id: string, data: Partial<CreateServiceRequest>) { return client.put<Service>(`/services/${id}`, data); },
  delete(id: string) { return client.delete(`/services/${id}`); },
};
