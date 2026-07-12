'use client';

import { BookOpen, Code2, KeyRound, LayoutDashboard, Layers } from 'lucide-react';
import { SidebarShell } from '@/components/layout/sidebar-shell';

const navItems = [
  { href: '/developer', label: 'Overview', icon: LayoutDashboard },
  { href: '/developer/applications', label: 'Applications', icon: Layers },
  { href: '/developer/api-keys', label: 'API Keys', icon: KeyRound },
  { href: '/docs', label: 'API Docs', icon: BookOpen },
];

export function DeveloperShell({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <SidebarShell
      title="FinConnect"
      subtitle="Developer portal"
      icon={Code2}
      navItems={navItems}
    >
      {children}
    </SidebarShell>
  );
}
