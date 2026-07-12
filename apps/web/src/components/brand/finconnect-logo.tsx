import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoTheme = 'light' | 'dark';

interface FinConnectLogoProps {
  /** Icon size in pixels */
  size?: number;
  showWordmark?: boolean;
  theme?: LogoTheme;
  href?: string;
  className?: string;
}

export function FinConnectLogo({
  size = 36,
  showWordmark = true,
  theme = 'dark',
  href,
  className,
}: FinConnectLogoProps): React.ReactElement {
  const wordmarkClass =
    theme === 'dark' ? 'text-white' : 'text-[hsl(222_48%_12%)]';

  const content = (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <Image
        src="/brand/logo-icon.png"
        alt=""
        width={size}
        height={size}
        className="shrink-0 object-contain"
        priority
      />
      {showWordmark ? (
        <span
          className={cn(
            'font-display text-xl font-semibold tracking-tight',
            wordmarkClass,
          )}
        >
          FinConnect
        </span>
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center" aria-label="FinConnect home">
        {content}
      </Link>
    );
  }

  return content;
}

export function FinConnectLogoMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}): React.ReactElement {
  return (
    <Image
      src="/brand/logo-icon.png"
      alt="FinConnect"
      width={size}
      height={size}
      className={cn('shrink-0 object-contain', className)}
    />
  );
}
