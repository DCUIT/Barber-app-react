import client from './client';
import type { Notification } from '../types/models';

export const notificationsApi = {
  getAll(limit = 20) { return client.get<{ notifications: Notification[] }>('/notifications', { params: { limit } }); },
  markAsRead(id: string) { return client.patch(`/notifications/${id}/read`); },
  markAllAsRead() { return client.patch('/notifications/read-all'); },
};
