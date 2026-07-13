'use client';

import { useQuery } from '@tanstack/react-query';
import { Lightbulb } from 'lucide-react';
import { insightsApi } from '@/lib/api';
import { PageHeader } from '@/components/layout/page-header';
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
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-24 rounded-xl" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="AI Insights"
        description="Personalized financial advice powered by your data"
      />

      <Card className="overflow-hidden border-primary/30">
        <div className="h-1 bg-gradient-to-r from-primary to-[hsl(var(--fc-gold))]" />
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="fc-icon-box">
              <Lightbulb className="h-5 w-5" />
            </div>
            <CardDescription>Summary · {data.provider}</CardDescription>
          </div>
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
                <p className="rounded-lg bg-primary/5 px-4 py-3 text-sm font-medium text-primary">
                  {insight.recommendation}
                </p>
              </CardContent>
            ) : null}
          </Card>
        ))}
      </div>
    </>
  );
}
