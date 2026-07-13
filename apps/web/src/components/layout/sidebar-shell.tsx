'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { FinConnectLogo } from '@/components/brand/finconnect-logo';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth-store';
import { authApi } from '@/lib/api';
import { roleLabel } from '@/lib/routing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface SidebarShellProps {
  subtitle: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export function SidebarShell({
  subtitle,
  navItems,
  children,
}: SidebarShellProps): React.ReactElement {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout(): Promise<void> {
    try {
      await authApi.logout();
    } catch {
      /* token may already be invalid */
    }
    clearAuth();
    router.push('/login');
  }

  function navLinkClass(active: boolean): string {
    return cn(
      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
      active
        ? 'bg-[#5A39E1]/25 text-white shadow-sm'
        : 'text-white/65 hover:bg-white/8 hover:text-white',
    );
  }

  const navContent = (
    <>
      {navItems.map(({ href, label, icon: Icon, badge }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={navLinkClass(active)}
          >
            <Icon className="h-4 w-4" />
            {label}
            {badge && badge > 0 ? (
              <Badge className="ml-auto bg-[#5A39E1] text-white">{badge}</Badge>
            ) : null}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex min-h-screen bg-[hsl(var(--fc-surface))]">
      <aside className="hidden w-64 shrink-0 flex-col bg-[hsl(var(--fc-navy))] lg:flex">
        <div className="border-b border-white/10 px-6 py-5">
          <FinConnectLogo href="/" size={36} theme="dark" />
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-[hsl(var(--fc-gold))]">
            {subtitle}
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-4">{navContent}</nav>
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-lg bg-white/5 px-3 py-3">
            <p className="text-sm font-medium text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-white/50">{user?.email}</p>
            {user ? (
              <Badge variant="secondary" className="mt-2 bg-white/10 text-white/90 hover:bg-white/10">
                {roleLabel(user.role)}
              </Badge>
            ) : null}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-white/70 hover:bg-white/10 hover:text-white"
            onClick={() => void logout()}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 lg:hidden">
          <FinConnectLogo href="/" size={32} theme="light" showWordmark={false} />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen((o) => !o)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        {mobileOpen ? (
          <div className="border-b border-border bg-[hsl(var(--fc-navy))] p-4 lg:hidden">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[hsl(var(--fc-gold))]">
              {subtitle}
            </p>
            <nav className="space-y-1">{navContent}</nav>
            <div className="mt-4 border-t border-white/10 pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-white/70 hover:bg-white/10 hover:text-white"
                onClick={() => void logout()}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        ) : null}

        <main className="flex-1 overflow-auto p-6">
          <div className="app-page">{children}</div>
        </main>
      </div>
    </div>
  );
}
