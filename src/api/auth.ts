import client from './client';
import type { LoginRequest, LoginResponse, RegisterRequest, UpdateProfileRequest, ChangePasswordRequest, UpdateUserRoleRequest, BlockUserRequest } from '../types/api';
import type { User } from '../types/models';

export const authApi = {
  login(data: LoginRequest) { return client.post<LoginResponse>('/auth/login', data); },
  register(data: RegisterRequest) { return client.post<{ msg: string }>('/auth/register', data); },
  getMe() { return client.get<{ user: User }>('/auth/me'); },
  updateProfile(data: UpdateProfileRequest) { return client.put<User>('/auth/me', data); },
  changePassword(data: ChangePasswordRequest) { return client.put<{ msg: string }>('/auth/change-password', data); },
  getUsers() { return client.get<User[]>('/auth/users'); },
  updateUserRole(userId: string, data: UpdateUserRoleRequest) { return client.put(`/auth/users/${userId}/role`, data); },
  blockUser(userId: string, data: BlockUserRequest) { return client.put(`/auth/users/${userId}/block`, data); },
  deleteUser(userId: string) { return client.delete(`/auth/users/${userId}`); },
};
