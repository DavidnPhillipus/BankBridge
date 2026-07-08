'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { developerApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function DeveloperPage(): React.ReactElement {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [appName, setAppName] = useState('');
  const [selectedApp, setSelectedApp] = useState('');
  const [keyName, setKeyName] = useState('');
  const [newSecret, setNewSecret] = useState<string | null>(null);

  const { data: apps } = useQuery({
    queryKey: ['developer', 'apps'],
    queryFn: () => developerApi.applications(),
    enabled: user?.role === 'DEVELOPER' || user?.role === 'ADMIN',
  });

  const appId = selectedApp || apps?.[0]?.id || '';

  const { data: keys } = useQuery({
    queryKey: ['developer', 'keys', appId],
    queryFn: () => developerApi.apiKeys(appId),
    enabled: !!appId,
  });

  const createApp = useMutation({
    mutationFn: () =>
      developerApi.createApplication({
        name: appName,
        environment: 'SANDBOX',
        redirectUris: [],
      }),
    onSuccess: () => {
      setAppName('');
      void qc.invalidateQueries({ queryKey: ['developer', 'apps'] });
    },
  });

  const createKey = useMutation({
    mutationFn: () =>
      developerApi.createApiKey({
        applicationId: appId,
        name: keyName,
        scopes: ['ACCOUNTS_READ', 'TRANSACTIONS_READ'],
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

  if (user?.role !== 'DEVELOPER' && user?.role !== 'ADMIN') {
    return <p className="text-muted-foreground">Developer portal requires a DEVELOPER or ADMIN account.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Developer Portal</h1>
        <p className="text-muted-foreground">Register apps and manage API keys</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create application</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Input
            placeholder="App name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={() => createApp.mutate()} disabled={!appName || createApp.isPending}>
            Create
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Label>Your applications</Label>
        <div className="flex flex-wrap gap-2">
          {apps?.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelectedApp(a.id)}
              className={`rounded-lg border px-4 py-2 text-sm ${
                appId === a.id ? 'border-primary bg-primary/10' : 'border-border'
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Issue API key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Key name (e.g. Production server)"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            className="max-w-md"
          />
          <Button onClick={() => createKey.mutate()} disabled={!keyName || !appId || createKey.isPending}>
            Generate key
          </Button>
          {newSecret ? (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
              <p className="text-sm font-medium text-amber-400">Copy now — shown once only</p>
              <code className="mt-2 block break-all text-xs">{newSecret}</code>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {keys?.map((k) => (
          <Card key={k.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium">{k.name}</p>
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
    </div>
  );
}
