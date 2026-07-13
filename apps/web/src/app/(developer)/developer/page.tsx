'use client';

import { useQuery } from '@tanstack/react-query';
import { BookOpen, KeyRound, Layers, ShieldCheck } from 'lucide-react';
import { developerApi } from '@/lib/api';
import { PageHeader, QuickLinkCard, StatCard } from '@/components/layout/page-header';
import { buttonVariants } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <>
      <PageHeader
        title="Developer dashboard"
        description="Build fintech apps on FinConnect — separate from the customer banking experience."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Applications" value={String(appCount)} accent="purple" />
        <StatCard title="Active API keys" value={String(activeKeys)} accent="gold" />
        <div className="fc-card overflow-hidden">
          <div className="h-1 bg-primary/60" />
          <div className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Environment</p>
            <p className="mt-2 font-display text-2xl font-bold">Sandbox</p>
            <a
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mt-4')}
            >
              View API docs
            </a>
          </div>
        </div>
      </div>

      <div className="fc-card-dark p-6 md:p-8">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-white">What you can do as a developer</CardTitle>
          <CardDescription className="text-white/60">
            Unlike customers, you do not link personal bank accounts here.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="space-y-3">
            {CAPABILITIES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#5A39E1]" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <QuickLinkCard
          href="/developer/applications"
          icon={Layers}
          title="Applications"
          description="Register your fintech app"
        />
        <QuickLinkCard
          href="/developer/api-keys"
          icon={KeyRound}
          title="API keys"
          description="Authenticate API requests"
        />
        <QuickLinkCard
          href="/docs"
          icon={BookOpen}
          title="API reference"
          description="OpenAPI / Swagger"
          external
        />
      </div>
    </>
  );
}
