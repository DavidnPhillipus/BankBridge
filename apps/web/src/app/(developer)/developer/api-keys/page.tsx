'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { developerApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">API keys</h1>
        <p className="text-muted-foreground">
          Keys authenticate your server when calling{' '}
          <code className="text-primary">/api/v1/public/*</code> endpoints.
        </p>
      </div>

      {apps && apps.length > 0 ? (
        <div className="space-y-2">
          <Label>Application</Label>
          <div className="flex flex-wrap gap-2">
            {apps.map((a) => (
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
      ) : (
        <p className="text-sm text-muted-foreground">
          Create an application first before issuing API keys.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Issue new key</CardTitle>
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
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Copy now — shown once only
              </p>
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
