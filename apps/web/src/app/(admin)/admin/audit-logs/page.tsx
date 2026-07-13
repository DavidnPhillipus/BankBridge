'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { PageHeader } from '@/components/layout/page-header';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminAuditLogsPage(): React.ReactElement {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'audit-logs', page],
    queryFn: () => adminApi.auditLogs(page),
  });

  return (
    <>
      <PageHeader
        title="Audit logs"
        description="Platform-wide activity across all users and resources."
      />

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : null}

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
    </>
  );
}
