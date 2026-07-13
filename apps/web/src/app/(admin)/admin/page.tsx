'use client';

import Link from 'next/link';
import { ScrollText, Shield, Users } from 'lucide-react';
import { PageHeader, QuickLinkCard } from '@/components/layout/page-header';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const RESPONSIBILITIES = [
  'Review platform-wide audit logs for security and compliance',
  'Monitor consent grants, API key usage, and authentication events',
  'Oversee registered developer applications',
  'Manage platform configuration (coming soon)',
];

export default function AdminDashboardPage(): React.ReactElement {
  return (
    <>
      <PageHeader
        title="Admin dashboard"
        description="Platform operations — not a personal banking or developer workspace."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="h-1 bg-primary" />
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="fc-icon-box">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Platform security</CardTitle>
              <CardDescription>Audit trail and access monitoring</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/admin/audit-logs" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
              View audit logs
            </Link>
          </CardContent>
        </Card>
        <Card className="overflow-hidden opacity-90">
          <div className="h-1 bg-[hsl(var(--fc-gold))]" />
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="fc-icon-box bg-[hsl(var(--fc-gold))]/15 text-[hsl(var(--fc-gold))]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">User management</CardTitle>
              <CardDescription>Roles and accounts (coming soon)</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Administrator responsibilities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {RESPONSIBILITIES.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <QuickLinkCard
        href="/admin/audit-logs"
        icon={ScrollText}
        title="Audit logs"
        description="Review platform-wide activity"
      />
    </>
  );
}
