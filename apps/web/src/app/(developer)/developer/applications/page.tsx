'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { developerApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function DeveloperApplicationsPage(): React.ReactElement {
  const qc = useQueryClient();
  const [appName, setAppName] = useState('');

  const { data: apps, isLoading } = useQuery({
    queryKey: ['developer', 'apps'],
    queryFn: () => developerApi.applications(),
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Applications</h1>
        <p className="text-muted-foreground">
          Register apps that request customer consent and call the FinConnect API.
        </p>
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
        {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
        {apps?.map((app) => (
          <Card key={app.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <p className="font-medium">{app.name}</p>
                <p className="text-sm text-muted-foreground">{app.description ?? 'No description'}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{app.id}</p>
              </div>
              <Badge variant="secondary">{app.environment}</Badge>
            </CardContent>
          </Card>
        ))}
        {apps?.length === 0 ? (
          <p className="text-sm text-muted-foreground">No applications yet. Create one above.</p>
        ) : null}
      </div>
    </div>
  );
}
