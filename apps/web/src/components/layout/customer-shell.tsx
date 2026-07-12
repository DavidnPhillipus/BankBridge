'use client';

import {
  ArrowLeftRight,
  Bell,
  LayoutDashboard,
  Lightbulb,
  Shield,
  Wallet,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api';
import { SidebarShell } from '@/components/layout/sidebar-shell';

export function CustomerShell({ children }: { children: React.ReactNode }): React.ReactElement {
  const { data: unread } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsApi.unreadCount(),
    refetchInterval: 60_000,
  });

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/accounts', label: 'Accounts', icon: Wallet },
    { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { href: '/consents', label: 'Consents', icon: Shield },
    { href: '/insights', label: 'AI Insights', icon: Lightbulb },
    {
      href: '/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unread?.count,
    },
  ];

  return (
    <SidebarShell subtitle="Personal banking" navItems={navItems}>
      {children}
    </SidebarShell>
  );
}
