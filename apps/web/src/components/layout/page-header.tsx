import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps): React.ReactElement {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {description ? (
          <div className="mt-2 text-base text-muted-foreground">{description}</div>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function StatCard({
  title,
  value,
  highlight,
  accent,
}: {
  title: string;
  value: string;
  highlight?: boolean;
  accent?: 'purple' | 'gold' | 'default';
}): React.ReactElement {
  const accentBar =
    accent === 'gold'
      ? 'bg-[hsl(var(--fc-gold))]'
      : accent === 'purple'
        ? 'bg-primary'
        : 'bg-primary/60';

  return (
    <div className="fc-card overflow-hidden">
      <div className={cn('h-1 w-full', accentBar)} />
      <div className="p-6">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p
          className={cn(
            'mt-2 font-display text-2xl font-bold tracking-tight',
            highlight === false && 'text-destructive',
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export function QuickLinkCard({
  href,
  icon: Icon,
  title,
  description,
  external,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  external?: boolean;
}): React.ReactElement {
  const className =
    'fc-card flex items-center gap-4 p-5 hover:border-primary/30 hover:bg-primary/[0.02]';

  const inner = (
    <>
      <div className="fc-icon-box">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
