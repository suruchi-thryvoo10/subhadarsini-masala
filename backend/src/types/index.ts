import { Request } from 'express';

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'MANAGER' | 'CONTENT_MANAGER' | 'INVENTORY_MANAGER';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errorCode?: string;
  meta?: Record<string, any>;
}
