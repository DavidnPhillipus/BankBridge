import type { UserRole } from '@bankbridge/contracts';

/** Shape attached to `request.user` by the JWT strategy. */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}
