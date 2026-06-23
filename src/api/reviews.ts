import client from './client';
import type { CreateReviewRequest } from '../types/api';
import type { Review } from '../types/models';

export const reviewsApi = {
  getByBarber(barberId: string) { return client.get<Review[]>(`/reviews/barbers/${barberId}`); },
  create(data: CreateReviewRequest) { return client.post<Review>('/reviews', data); },
};
