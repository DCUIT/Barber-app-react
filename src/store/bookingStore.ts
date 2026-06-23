import { create } from 'zustand';
import type { Barber, Service, Booking } from '../types/models';

interface BookingDraft {
  service: Service | null;
  barber: Barber | null;
  date: string;
  time: string;
  note: string;
}

interface BookingState {
  draft: BookingDraft;
  bookings: Booking[];
  isLoading: boolean;
  setService: (s: Service) => void;
  setBarber: (b: Barber) => void;
  setDate: (d: string) => void;
  setTime: (t: string) => void;
  setNote: (n: string) => void;
  resetDraft: () => void;
  setBookings: (b: Booking[]) => void;
  setLoading: (l: boolean) => void;
}

const initialDraft: BookingDraft = { service: null, barber: null, date: '', time: '', note: '' };

export const useBookingStore = create<BookingState>((set) => ({
  draft: initialDraft,
  bookings: [],
  isLoading: false,
  setService: (service) => set((s) => ({ draft: { ...s.draft, service } })),
  setBarber: (barber) => set((s) => ({ draft: { ...s.draft, barber } })),
  setDate: (date) => set((s) => ({ draft: { ...s.draft, date, time: '' } })),
  setTime: (time) => set((s) => ({ draft: { ...s.draft, time } })),
  setNote: (note) => set((s) => ({ draft: { ...s.draft, note } })),
  resetDraft: () => set({ draft: initialDraft }),
  setBookings: (bookings) => set({ bookings }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

export const selectDraft = (s: BookingState) => s.draft;
export const selectBookingService = (s: BookingState) => s.draft.service;
export const selectBookingBarber = (s: BookingState) => s.draft.barber;
export const selectBookingDate = (s: BookingState) => s.draft.date;
export const selectBookingTime = (s: BookingState) => s.draft.time;
