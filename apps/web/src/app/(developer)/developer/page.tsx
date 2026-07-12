'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, KeyRound, Layers, ShieldCheck } from 'lucide-react';
import { developerApi } from '@/lib/api';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const CAPABILITIES = [
  'Register sandbox and production applications',
  'Issue and revoke API keys with scoped permissions',
  'Access customer data via the Public API (with user consent)',
  'Integrate using OpenAPI / Swagger documentation',
  'Build budgeting, lending, and payment products on FinConnect',
];

export default function DeveloperDashboardPage(): React.ReactElement {
  const { data: apps } = useQuery({
    queryKey: ['developer', 'apps'],
    queryFn: () => developerApi.applications(),
  });

  const appCount = apps?.length ?? 0;
  const firstAppId = apps?.[0]?.id;

  const { data: keys } = useQuery({
    queryKey: ['developer', 'keys', firstAppId],
    queryFn: () => developerApi.apiKeys(firstAppId!),
    enabled: !!firstAppId,
  });

  const activeKeys = keys?.filter((k) => !k.revokedAt).length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Developer dashboard</h1>
        <p className="text-muted-foreground">
          Build fintech apps on FinConnect — separate from the customer banking experience.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Applications</CardDescription>
            <CardTitle className="text-3xl">{appCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/developer/applications" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
              Manage apps
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active API keys</CardDescription>
            <CardTitle className="text-3xl">{activeKeys}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/developer/api-keys" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
              Manage keys
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Environment</CardDescription>
            <CardTitle className="text-lg">Sandbox</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              View API docs
            </a>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">What you can do as a developer</CardTitle>
          <CardDescription>Unlike customers, you do not link personal bank accounts here.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {CAPABILITIES.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/developer/applications"
          className="flex items-center gap-3 rounded-xl border border-border p-4 transition hover:border-primary/40 hover:bg-secondary/30"
        >
          <Layers className="h-8 w-8 text-primary" />
          <div>
            <p className="font-medium">Applications</p>
            <p className="text-sm text-muted-foreground">Register your fintech app</p>
          </div>
        </Link>
        <Link
          href="/developer/api-keys"
          className="flex items-center gap-3 rounded-xl border border-border p-4 transition hover:border-primary/40 hover:bg-secondary/30"
        >
          <KeyRound className="h-8 w-8 text-primary" />
          <div>
            <p className="font-medium">API keys</p>
            <p className="text-sm text-muted-foreground">Authenticate API requests</p>
          </div>
        </Link>
        <a
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-border p-4 transition hover:border-primary/40 hover:bg-secondary/30"
        >
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <p className="font-medium">API reference</p>
            <p className="text-sm text-muted-foreground">OpenAPI / Swagger</p>
          </div>
        </a>
      </div>
    </div>
  );
}
