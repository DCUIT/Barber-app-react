import type { User, Barber, Booking } from './models';

export interface LoginRequest { username: string; password: string }
export interface LoginResponse {
  access_token: string;
  name: string;
  role: string;
  user?: User;
}
export interface RegisterRequest { name: string; username: string; password: string }
export interface CreateBookingRequest {
  barberId: string; serviceId: string; bookingDate: string; bookingTime: string; note?: string;
}
export interface UpdateProfileRequest { name?: string; avatar?: string; phone?: string }
export interface ChangePasswordRequest { currentPassword: string; newPassword: string }
export interface CreateReviewRequest { bookingId: string; rating: number; comment?: string }
export interface CreateServiceRequest { name: string; price: number; duration: number; image?: string; description?: string }
export interface CreateBarberRequest { name: string; specialty?: string; experience?: number; avatar?: string }
export interface CalendarSlotsResponse { slots: string[] }
export interface UpdateUserRoleRequest { role: string }
export interface BlockUserRequest { isBlocked: boolean }
export interface ApiError { msg: string }
