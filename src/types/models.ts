export type UserRole = 'user' | 'barber' | 'admin';
export type BookingStatus = 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';
export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface User {
  _id: string;
  name: string;
  username: string;
  role: UserRole;
  avatar: string;
  phone: string;
  isBlocked: boolean;
  createdAt: string;
}

export interface Barber {
  _id: string;
  userId?: string;
  name: string;
  avatar: string;
  experienceYears: number;
  specialty: string;
  workingHours: Record<WeekDay, { start: string; end: string }[]>;
  dayOff: Record<WeekDay, boolean>;
  rating: number;
  reviewCount: number;
}

export interface Service {
  _id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
  image: string;
  category: string;
}

export interface Booking {
  _id: string;
  userId: Pick<User, '_id' | 'name' | 'username'>;
  barberId: Pick<Barber, '_id' | 'name' | 'avatar'>;
  serviceId: Pick<Service, '_id' | 'name' | 'price'>;
  bookingDate: string;
  bookingTime: string;
  note: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Review {
  _id: string;
  userId: Pick<User, '_id' | 'name' | 'username'>;
  barberId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  receiverId: string;
  receiverRole: UserRole;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}
