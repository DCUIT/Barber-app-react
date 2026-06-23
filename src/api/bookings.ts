import client from './client';
import type { CreateBookingRequest, CalendarSlotsResponse } from '../types/api';
import type { Booking } from '../types/models';

export const bookingsApi = {
  getAll() { return client.get<{ bookings: Booking[]; totalCount: number }>('/bookings'); },
  create(data: CreateBookingRequest) { return client.post<Booking>('/bookings', data); },
  getCalendar(barberId: string, date: string) { return client.get<CalendarSlotsResponse>('/bookings/calendar', { params: { barberId, date } }); },
  updateStatus(id: string, status: string) { return client.put<Booking>(`/bookings/${id}/status`, { status }); },
  delete(id: string) { return client.delete(`/bookings/${id}`); },
  getTodayBookings(date: string) { return client.get<{ bookings: Booking[] }>('/barber/bookings/today', { params: { date } }); },
  getStats() { return client.get<{ date: string; count: number; revenue: number }[]>('/bookings/stats'); },
};
