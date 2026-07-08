'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { banksApi, catalogApi, consentsApi } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

const ALL_SCOPES = [
  'ACCOUNTS_READ',
  'BALANCES_READ',
  'TRANSACTIONS_READ',
  'IDENTITY_READ',
] as const;

export default function ConsentsPage(): React.ReactElement {
  const qc = useQueryClient();
  const [appId, setAppId] = useState('');
  const [bankId, setBankId] = useState('');
  const [scopes, setScopes] = useState<string[]>(['ACCOUNTS_READ', 'BALANCES_READ', 'TRANSACTIONS_READ']);

  const { data: consents } = useQuery({ queryKey: ['consents'], queryFn: () => consentsApi.list() });
  const { data: banks } = useQuery({ queryKey: ['banks'], queryFn: () => banksApi.list() });
  const { data: apps } = useQuery({ queryKey: ['catalog', 'apps'], queryFn: () => catalogApi.applications() });

  const grant = useMutation({
    mutationFn: () =>
      consentsApi.grant({
        applicationId: appId,
        bankId,
        scopes: scopes as ('ACCOUNTS_READ' | 'BALANCES_READ' | 'TRANSACTIONS_READ' | 'IDENTITY_READ')[],
      }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['consents'] }),
  });

  const revoke = useMutation({
    mutationFn: (id: string) => consentsApi.revoke(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['consents'] }),
  });

  function toggleScope(scope: string): void {
    setScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Consents</h1>
        <p className="text-muted-foreground">Manage which apps can access your bank data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Grant new consent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Application</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
              >
                <option value="">Select app…</option>
                {apps?.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Bank</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
              >
                <option value="">Select bank…</option>
                {banks?.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_SCOPES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleScope(s)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  scopes.includes(s) ? 'border-primary bg-primary/15 text-primary' : 'border-border'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <Button
            onClick={() => grant.mutate()}
            disabled={!appId || !bankId || scopes.length === 0 || grant.isPending}
          >
            Grant consent
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {consents?.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <p className="font-medium">
                  {c.applicationName} → {c.bankName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Expires {formatDate(c.expiresAt)} · {c.scopes.join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={c.status === 'ACTIVE' ? 'success' : 'secondary'}>{c.status}</Badge>
                {c.status === 'ACTIVE' ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => revoke.mutate(c.id)}
                    disabled={revoke.isPending}
                  >
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
