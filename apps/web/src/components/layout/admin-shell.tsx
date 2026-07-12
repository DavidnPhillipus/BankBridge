'use client';

import { LayoutDashboard, ScrollText } from 'lucide-react';
import { SidebarShell } from '@/components/layout/sidebar-shell';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/audit-logs', label: 'Audit logs', icon: ScrollText },
];

export function AdminShell({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <SidebarShell subtitle="Platform admin" navItems={navItems}>
      {children}
    </SidebarShell>
  );
}
