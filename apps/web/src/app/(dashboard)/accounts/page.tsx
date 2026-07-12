'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { accountsApi } from '@/lib/api';
import { BankLogo } from '@/components/banks/bank-logo';
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Accounts</h1>
          <p className="text-muted-foreground">
            {accounts ? `${accounts.length} linked · ${formatMoney(total)} total` : 'Loading…'}
          </p>
        </div>
        <Button variant="outline" onClick={() => sync.mutate()} disabled={sync.isPending}>
          <RefreshCw className={`mr-2 h-4 w-4 ${sync.isPending ? 'animate-spin' : ''}`} />
          Sync
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {accounts?.map((account) => (
            <Card key={account.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{account.name}</CardTitle>
                  <CardDescription>{account.bankName}</CardDescription>
                </div>
                {account.bankName ? <BankLogo name={account.bankName} /> : null}
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{formatMoney(account.balance, account.currency)}</p>
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
    </div>
  );
}
