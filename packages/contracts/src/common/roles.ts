import { z } from 'zod';

/**
 * Platform roles. Shared between API (authorization guards) and Web (route
 * guards / UI), so there is a single source of truth.
 */
export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  DEVELOPER: 'DEVELOPER',
  ADMIN: 'ADMIN',
} as const;

export const userRoleSchema = z.enum([
  UserRole.CUSTOMER,
  UserRole.DEVELOPER,
  UserRole.ADMIN,
]);

export type UserRole = z.infer<typeof userRoleSchema>;
