import Image from 'next/image';
import { bankLogoUrlByName, bankLogoUrlBySlug } from '@/lib/banks';
import { cn } from '@/lib/utils';

interface BankLogoProps {
  name?: string;
  slug?: string;
  size?: number;
  className?: string;
}

export function BankLogo({
  name,
  slug,
  size = 40,
  className,
}: BankLogoProps): React.ReactElement {
  const src = slug ? bankLogoUrlBySlug(slug) : name ? bankLogoUrlByName(name) : undefined;
  const alt = name ?? slug ?? 'Bank';

  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-slate-100 text-xs font-medium text-slate-600',
          className,
        )}
        style={{ width: size, height: size }}
      >
        {alt[0]}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn('rounded-lg object-contain bg-white p-1', className)}
    />
  );
}
