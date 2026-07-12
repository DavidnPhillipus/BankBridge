'use client';

import type { AuthUser } from '@bankbridge/contracts';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { homePathForRole } from '@/lib/routing';

interface RoleGuardProps {
  allowed: AuthUser['role'][];
  children: React.ReactNode;
}

export function RoleGuard({ allowed, children }: RoleGuardProps): React.ReactElement | null {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user && !allowed.includes(user.role)) {
      router.replace(homePathForRole(user.role));
    }
  }, [user, allowed, router]);

  if (!user || !allowed.includes(user.role)) return null;

  return <>{children}</>;
}
