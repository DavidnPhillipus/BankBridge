'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { accountsApi, transactionsApi } from '@/lib/api';
import { PageHeader } from '@/components/layout/page-header';
import { formatDate, formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function TransactionsPage(): React.ReactElement {
  const [accountId, setAccountId] = useState<string>('');

  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsApi.list(),
  });

  const selected = accountId || accounts?.[0]?.id || '';

  const { data: txns, isLoading } = useQuery({
    queryKey: ['transactions', selected],
    queryFn: () => transactionsApi.list(selected, { page: 1, pageSize: 30 }),
    enabled: !!selected,
  });

  return (
    <>
      <PageHeader title="Transactions" description="Recent activity across your accounts" />

      <div className="flex flex-wrap gap-2">
        {accounts?.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAccountId(a.id)}
            className={cn(
              'fc-chip',
              selected === a.id ? 'fc-chip-active' : 'hover:bg-secondary/60',
            )}
          >
            {a.bankName} · {a.name}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {txns ? `${txns.meta.total} transactions` : 'Transactions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {txns?.data.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-4 py-4 first:pt-0">
                  <div>
                    <p className="font-medium">{t.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(t.bookedAt)}
                      {t.category ? ` · ${t.category.name}` : ''}
                      {t.merchant ? ` · ${t.merchant.name}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={t.type === 'CREDIT' ? 'font-semibold text-emerald-600' : 'font-semibold'}>
                      {t.type === 'CREDIT' ? '+' : '-'}
                      {formatMoney(t.amount, t.currency)}
                    </p>
                    <Badge variant={t.type === 'CREDIT' ? 'success' : 'secondary'}>{t.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
