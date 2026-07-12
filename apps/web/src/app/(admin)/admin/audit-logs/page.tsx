'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminAuditLogsPage(): React.ReactElement {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'audit-logs', page],
    queryFn: () => adminApi.auditLogs(page),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Audit logs</h1>
        <p className="text-muted-foreground">Platform-wide activity across all users and resources.</p>
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}

      <div className="space-y-2">
        {data?.data.map((log) => (
          <Card key={log.id}>
            <CardContent className="flex flex-wrap items-start justify-between gap-4 p-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{log.action}</Badge>
                  <span className="text-sm text-muted-foreground">{log.resourceType}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Actor: {log.actorId ?? 'system'} · {formatDate(log.createdAt)}
                </p>
                {log.resourceId ? (
                  <p className="font-mono text-xs text-muted-foreground">Resource: {log.resourceId}</p>
                ) : null}
              </div>
              {log.ip ? <span className="text-xs text-muted-foreground">{log.ip}</span> : null}
            </CardContent>
          </Card>
        ))}
      </div>

      {data && data.meta.totalPages > 1 ? (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {data.meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
