'use client';

import Link from 'next/link';
import { ScrollText, Shield, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const RESPONSIBILITIES = [
  'Review platform-wide audit logs for security and compliance',
  'Monitor consent grants, API key usage, and authentication events',
  'Oversee registered developer applications',
  'Manage platform configuration (coming soon)',
];

export default function AdminDashboardPage(): React.ReactElement {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Admin dashboard</h1>
        <p className="text-muted-foreground">
          Platform operations — not a personal banking or developer workspace.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <Shield className="h-8 w-8 text-primary" />
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
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <Users className="h-8 w-8 text-primary" />
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
          <ul className="space-y-2 text-sm text-muted-foreground">
            {RESPONSIBILITIES.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
