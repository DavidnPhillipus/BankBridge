'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { accountsApi } from '@/lib/api';
import { BankLogo } from '@/components/banks/bank-logo';
import { PageHeader } from '@/components/layout/page-header';
import { formatMoney } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountsPage(): React.ReactElement {
  const qc = useQueryClient();
  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsApi.list(),
  });

  const sync = useMutation({
    mutationFn: () => accountsApi.sync(),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['accounts'] }),
  });

  const total = accounts?.reduce((sum, a) => sum + a.balance, 0) ?? 0;

  return (
    <>
      <PageHeader
        title="Accounts"
        description={
          accounts ? `${accounts.length} linked · ${formatMoney(total)} total` : 'Your linked bank accounts'
        }
      >
        <Button variant="outline" onClick={() => sync.mutate()} disabled={sync.isPending}>
          <RefreshCw className={`mr-2 h-4 w-4 ${sync.isPending ? 'animate-spin' : ''}`} />
          Sync
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {accounts?.map((account) => (
            <Card key={account.id} className="overflow-hidden">
              <div className="h-1 bg-primary" />
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{account.name}</CardTitle>
                  <CardDescription>{account.bankName}</CardDescription>
                </div>
                {account.bankName ? (
                  <div className="rounded-lg border border-border bg-white p-1.5">
                    <BankLogo name={account.bankName} size={40} />
                  </div>
                ) : null}
              </CardHeader>
              <CardContent>
                <p className="font-display text-2xl font-bold">{formatMoney(account.balance, account.currency)}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Available {formatMoney(account.availableBalance, account.currency)}
                </p>
                <div className="mt-3 flex gap-2">
                  <Badge variant="secondary">{account.accountType}</Badge>
                  {account.mask ? <Badge variant="outline">•••• {account.mask}</Badge> : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
