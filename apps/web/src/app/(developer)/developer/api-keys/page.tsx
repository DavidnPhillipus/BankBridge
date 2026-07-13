'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { developerApi } from '@/lib/api';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function DeveloperApiKeysPage(): React.ReactElement {
  const qc = useQueryClient();
  const [selectedApp, setSelectedApp] = useState('');
  const [keyName, setKeyName] = useState('');
  const [newSecret, setNewSecret] = useState<string | null>(null);

  const { data: apps } = useQuery({
    queryKey: ['developer', 'apps'],
    queryFn: () => developerApi.applications(),
  });

  const appId = selectedApp || apps?.[0]?.id || '';

  const { data: keys } = useQuery({
    queryKey: ['developer', 'keys', appId],
    queryFn: () => developerApi.apiKeys(appId),
    enabled: !!appId,
  });

  const createKey = useMutation({
    mutationFn: () =>
      developerApi.createApiKey({
        applicationId: appId,
        name: keyName,
        scopes: ['ACCOUNTS_READ', 'BALANCES_READ', 'TRANSACTIONS_READ'],
      }),
    onSuccess: (data) => {
      setKeyName('');
      setNewSecret(data.secret);
      void qc.invalidateQueries({ queryKey: ['developer', 'keys', appId] });
    },
  });

  const revokeKey = useMutation({
    mutationFn: (id: string) => developerApi.revokeApiKey(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['developer', 'keys', appId] }),
  });

  return (
    <>
      <PageHeader
        title="API keys"
        description={
          <>
            Keys authenticate your server when calling{' '}
            <code className="rounded bg-primary/10 px-1.5 py-0.5 text-sm text-primary">
              /api/v1/public/*
            </code>{' '}
            endpoints.
          </>
        }
      />

      {apps && apps.length > 0 ? (
        <div className="space-y-2">
          <Label>Application</Label>
          <div className="flex flex-wrap gap-2">
            {apps.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedApp(a.id)}
                className={cn('fc-chip', appId === a.id ? 'fc-chip-active' : 'hover:bg-secondary/60')}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Create an application first before issuing API keys.
        </p>
      )}

      <div className="fc-card-dark overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-white/40">Issue new key</span>
        </div>
        <div className="space-y-3 p-5">
          <Input
            placeholder="Key name (e.g. Production server)"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            className="max-w-md border-white/15 bg-white/5 text-white placeholder:text-white/40"
          />
          <Button onClick={() => createKey.mutate()} disabled={!keyName || !appId || createKey.isPending}>
            Generate key
          </Button>
          {newSecret ? (
            <div className="rounded-lg border border-[hsl(var(--fc-gold))]/40 bg-[hsl(var(--fc-gold))]/10 p-4">
              <p className="text-sm font-medium text-[hsl(var(--fc-gold))]">
                Copy now — shown once only
              </p>
              <code className="mt-2 block break-all font-mono text-xs text-white/90">{newSecret}</code>
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {keys?.map((k) => (
          <Card key={k.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-semibold">{k.name}</p>
                <p className="font-mono text-sm text-muted-foreground">{k.keyPrefix}…</p>
                <p className="text-xs text-muted-foreground">{k.scopes.join(', ')}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={k.revokedAt ? 'destructive' : 'success'}>
                  {k.revokedAt ? 'Revoked' : 'Active'}
                </Badge>
                {!k.revokedAt ? (
                  <Button size="sm" variant="destructive" onClick={() => revokeKey.mutate(k.id)}>
                    Revoke
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
