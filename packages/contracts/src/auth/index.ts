import { z } from 'zod';
import { userRoleSchema, UserRole } from '../common/roles';

/** Self-service registration account types (ADMIN is never self-service). */
export const registerAccountTypeSchema = z.enum([UserRole.CUSTOMER, UserRole.DEVELOPER]);
export type RegisterAccountType = z.infer<typeof registerAccountTypeSchema>;

/** Registration payload. Password policy enforced here so API + Web agree. */
export const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'), // bcrypt input limit
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  accountType: registerAccountTypeSchema.default(UserRole.CUSTOMER),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshInput = z.infer<typeof refreshSchema>;

/** Public representation of a user (never includes password hash). */
export const authUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: userRoleSchema,
});
export type AuthUser = z.infer<typeof authUserSchema>;

export const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.literal('Bearer'),
  expiresIn: z.number(), // access token lifetime in seconds
});
export type AuthTokens = z.infer<typeof authTokensSchema>;

export const authResponseSchema = z.object({
  user: authUserSchema,
  tokens: authTokensSchema,
});
export type AuthResponse = z.infer<typeof authResponseSchema>;
