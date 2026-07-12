import type { AuthUser } from '@bankbridge/contracts';

/** Default landing path after sign-in for each role. */
export function homePathForRole(role: AuthUser['role']): string {
  switch (role) {
    case 'DEVELOPER':
      return '/developer';
    case 'ADMIN':
      return '/admin';
    case 'CUSTOMER':
    default:
      return '/dashboard';
  }
}

export function roleLabel(role: AuthUser['role']): string {
  switch (role) {
    case 'DEVELOPER':
      return 'Developer';
    case 'ADMIN':
      return 'Administrator';
    case 'CUSTOMER':
    default:
      return 'Customer';
  }
}
