'use client';

import { AuthGuard } from '@/components/layout/auth-guard';
import { RoleGuard } from '@/components/layout/role-guard';
import { AdminShell } from '@/components/layout/admin-shell';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <AuthGuard>
      <RoleGuard allowed={['ADMIN']}>
        <AdminShell>{children}</AdminShell>
      </RoleGuard>
    </AuthGuard>
  );
}
