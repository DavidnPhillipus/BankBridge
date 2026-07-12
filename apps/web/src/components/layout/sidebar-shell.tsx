'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { LogOut } from 'lucide-react';
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
  title: string;
  subtitle: string;
  icon: LucideIcon;
  navItems: NavItem[];
  children: React.ReactNode;
}

export function SidebarShell({
  title,
  subtitle,
  icon: BrandIcon,
  navItems,
  children,
}: SidebarShellProps): React.ReactElement {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  async function logout(): Promise<void> {
    try {
      await authApi.logout();
    } catch {
      /* token may already be invalid */
    }
    clearAuth();
    router.push('/login');
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card/40 lg:flex lg:flex-col">
        <div className="flex h-16 flex-col justify-center border-b border-border px-6">
          <div className="flex items-center gap-2">
            <BrandIcon className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">{title}</span>
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                  active
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
                {badge && badge > 0 ? (
                  <Badge variant="default" className="ml-auto">
                    {badge}
                  </Badge>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <div className="mb-3 px-3">
            <p className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            {user ? (
              <Badge variant="secondary" className="mt-2">
                {roleLabel(user.role)}
              </Badge>
            ) : null}
          </div>
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => void logout()}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-6 lg:hidden">
          <span className="font-semibold">{title}</span>
          <Button variant="ghost" size="sm" onClick={() => void logout()}>
            Sign out
          </Button>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
