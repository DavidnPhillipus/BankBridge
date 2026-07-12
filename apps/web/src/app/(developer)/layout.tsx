'use client';

import { AuthGuard } from '@/components/layout/auth-guard';
import { RoleGuard } from '@/components/layout/role-guard';
import { DeveloperShell } from '@/components/layout/developer-shell';

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <AuthGuard>
      <RoleGuard allowed={['DEVELOPER', 'ADMIN']}>
        <DeveloperShell>{children}</DeveloperShell>
      </RoleGuard>
    </AuthGuard>
  );
}
