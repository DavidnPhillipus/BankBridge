'use client';

import { useQuery } from '@tanstack/react-query';
import { insightsApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const severityVariant: Record<string, 'destructive' | 'warning' | 'default' | 'success'> = {
  critical: 'destructive',
  warning: 'warning',
  info: 'default',
  positive: 'success',
};

export default function InsightsPage(): React.ReactElement {
  const { data, isLoading } = useQuery({
    queryKey: ['insights'],
    queryFn: () => insightsApi.list(6),
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">AI Insights</h1>
        <p className="text-muted-foreground">Personalized financial advice powered by your data</p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardDescription>Summary · {data.provider}</CardDescription>
          <CardTitle className="text-lg font-normal leading-relaxed">{data.summary}</CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {data.insights.map((insight) => (
          <Card key={insight.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">{insight.title}</CardTitle>
                <CardDescription className="mt-1">{insight.detail}</CardDescription>
              </div>
              <Badge variant={severityVariant[insight.severity] ?? 'default'}>
                {insight.severity}
              </Badge>
            </CardHeader>
            {insight.recommendation ? (
              <CardContent>
                <p className="text-sm text-primary">{insight.recommendation}</p>
              </CardContent>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
