'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

export function AuthGuard({ children }: { children: React.ReactNode }): React.ReactElement | null {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken || !user) {
      router.replace('/login');
    }
  }, [accessToken, user, router]);

  if (!accessToken || !user) return null;

  return <>{children}</>;
}
