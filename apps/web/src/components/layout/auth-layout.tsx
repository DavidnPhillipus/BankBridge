import Image from 'next/image';
import Link from 'next/link';
import { FinConnectLogo } from '@/components/brand/finconnect-logo';

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, description, children }: AuthLayoutProps): React.ReactElement {
  return (
    <div className="flex min-h-screen">
      <aside className="relative hidden w-[45%] overflow-hidden bg-[hsl(var(--fc-navy))] lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,hsl(252_74%_55%/0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,hsl(var(--fc-gold)/0.12),transparent_50%)]" />

        <div className="relative z-10 p-10">
          <FinConnectLogo href="/" size={44} theme="dark" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-10 pb-16">
          <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-white">
            Connect.{' '}
            <span className="text-[hsl(var(--fc-gold))]">Innovate.</span>{' '}
            <span className="text-[hsl(var(--fc-gold))]">Transform.</span>
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-white/70">
            Namibia&apos;s open finance platform — secure data sharing between banks, fintechs, and
            businesses with your consent.
          </p>
          <div className="relative mt-10 aspect-[4/3] max-w-sm overflow-hidden rounded-2xl">
            <Image
              src="/landing/hero-ecosystem.png"
              alt=""
              fill
              className="object-contain"
              sizes="400px"
              priority
            />
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 px-10 py-6 text-sm text-white/50">
          © {new Date().getFullYear()} FinConnect · Open Banking for Namibia
        </div>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center bg-[hsl(var(--fc-surface))] p-6">
        <div className="mb-8 lg:hidden">
          <FinConnectLogo href="/" size={40} theme="light" />
        </div>

        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 text-muted-foreground">{description}</p>
          </div>

          <div className="fc-card overflow-hidden">
            <div className="hidden border-b border-border bg-white px-6 py-5 lg:block">
              <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="p-6">{children}</div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground lg:hidden">
            <Link href="/" className="text-primary hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
