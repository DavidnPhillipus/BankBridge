'use client';

import { BookOpen, KeyRound, LayoutDashboard, Layers } from 'lucide-react';
import { SidebarShell } from '@/components/layout/sidebar-shell';

const navItems = [
  { href: '/developer', label: 'Overview', icon: LayoutDashboard },
  { href: '/developer/applications', label: 'Applications', icon: Layers },
  { href: '/developer/api-keys', label: 'API Keys', icon: KeyRound },
  { href: '/docs', label: 'API Docs', icon: BookOpen },
];

export function DeveloperShell({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <SidebarShell subtitle="Developer portal" navItems={navItems}>
      {children}
    </SidebarShell>
  );
}
