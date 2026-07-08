import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Building2,
  KeyRound,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BANKS = [
  { name: 'Bank Windhoek', slug: 'bank-windhoek', color: '#0033A0' },
  { name: 'Bank of Namibia', slug: 'bank-of-namibia', color: '#1D4E89' },
  { name: 'FNB Namibia', slug: 'fnb-namibia', color: '#008752' },
  { name: 'NamPost', slug: 'nampost', color: '#E4002B' },
  { name: 'Standard Bank', slug: 'standard-bank-namibia', color: '#0033A1' },
  { name: 'Nedbank Namibia', slug: 'nedbank-namibia', color: '#006A4D' },
] as const;

const FEATURES = [
  {
    icon: Building2,
    title: 'Unified bank connections',
    description:
      'Connect once to BankBridge and access accounts across every major Namibian bank through one standardized API.',
  },
  {
    icon: Lock,
    title: 'Consent-first access',
    description:
      'Customers grant granular, revocable permissions. Every data request is scoped, logged, and auditable.',
  },
  {
    icon: Zap,
    title: 'Real-time sync',
    description:
      'Balances and transactions flow through our gateway with intelligent caching — fast reads, fresh data on demand.',
  },
  {
    icon: BarChart3,
    title: 'Spending analytics',
    description:
      'Automatic categorization, monthly snapshots, and trend charts help users understand where their money goes.',
  },
  {
    icon: Sparkles,
    title: 'AI-powered insights',
    description:
      'Rule-based intelligence surfaces savings opportunities, unusual spending, and cash-flow patterns.',
  },
  {
    icon: KeyRound,
    title: 'Developer portal',
    description:
      'Register apps, issue API keys, and integrate in minutes with OpenAPI docs and a sandbox environment.',
  },
] as const;

const STEPS = [
  {
    step: '01',
    title: 'Connect your bank',
    description: 'Grant consent to link your Namibian bank account through our secure OAuth-style flow.',
  },
  {
    step: '02',
    title: 'Authorize apps',
    description: 'Choose exactly which data each fintech app can access — accounts, balances, or transactions.',
  },
  {
    step: '03',
    title: 'Build & innovate',
    description: 'Developers call one REST API to power budgeting tools, lending, payments, and more.',
  },
] as const;

export function LandingPage(): React.ReactElement {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.22),transparent)]" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-1/4 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              BB
            </span>
            BankBridge
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition hover:text-foreground">
              Features
            </a>
            <a href="#banks" className="transition hover:text-foreground">
              Banks
            </a>
            <a href="#developers" className="transition hover:text-foreground">
              Developers
            </a>
            <a
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground"
            >
              API docs
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
              Sign in
            </Link>
            <Link href="/register" className={cn(buttonVariants({ size: 'sm' }))}>
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container relative mx-auto max-w-6xl px-6 pb-20 pt-20 text-center md:pt-28">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-1.5 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Open Banking Platform · Namibia
        </span>
        <h1 className="mx-auto max-w-4xl bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold leading-tight tracking-tight text-transparent sm:text-5xl md:text-6xl">
          One API for every bank in Namibia
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          BankBridge securely connects banks, customers, and fintech apps through a single
          standardized API — consent-driven, auditable, and developer-first.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register" className={cn(buttonVariants({ size: 'lg' }))}>
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/login" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
            View demo dashboard
          </Link>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Demo account:{' '}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-primary">customer@bankbridge.na</code>{' '}
          / <code className="rounded bg-secondary px-1.5 py-0.5 text-primary">Customer123!</code>
        </p>

        {/* Stats */}
        <div className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { value: '6', label: 'Banks connected' },
            { value: '100%', label: 'Consent-driven' },
            { value: '<50ms', label: 'Cached reads' },
            { value: 'REST', label: 'OpenAPI v1' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card/50 p-4">
              <p className="text-2xl font-semibold text-primary">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/60 bg-card/30 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Everything you need to build</h2>
            <p className="mt-4 text-muted-foreground">
              From account aggregation to developer tooling — BankBridge is the infrastructure layer
              for open finance in Namibia.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-border bg-card p-6 transition hover:border-primary/40 hover:bg-card/80"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary transition group-hover:bg-primary/25">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banks */}
      <section id="banks" className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Supported banks</h2>
            <p className="mt-4 text-muted-foreground">
              Six major Namibian institutions — each with a dedicated adapter that normalizes data
              into a single schema.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {BANKS.map((bank) => (
              <div
                key={bank.slug}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/50 p-5 transition hover:border-primary/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/banks/${bank.slug}.svg`}
                  alt={bank.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full"
                />
                <span className="text-center text-xs font-medium leading-tight">{bank.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/60 bg-card/30 py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
            <p className="mt-4 text-muted-foreground">
              Open banking made simple — for customers, developers, and regulated institutions.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step} className="relative">
                <span className="text-5xl font-bold text-primary/20">{s.step}</span>
                <h3 className="mt-2 text-lg font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developers */}
      <section id="developers" className="py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-8 md:p-12">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">Built for developers</h2>
                <p className="mt-4 text-muted-foreground">
                  Register your application, generate API keys, and start pulling normalized account
                  and transaction data. Full Swagger documentation included.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    API key authentication with scoped permissions
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Zod-validated request/response contracts
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Sandbox with mock bank adapters
                  </li>
                </ul>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/register" className={cn(buttonVariants())}>
                    Create developer account
                  </Link>
                  <a
                    href="/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'outline' }))}
                  >
                    Open API docs
                  </a>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Developer demo: <code className="text-primary">dev@bankbridge.na</code> /{' '}
                  <code className="text-primary">Dev123!</code>
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 font-mono text-xs leading-relaxed text-muted-foreground">
                <p className="text-primary">GET /api/v1/public/accounts</p>
                <p className="mt-2">X-API-Key: bbk_live.xxxxxxxx</p>
                <p className="mt-4 text-foreground">{`{`}</p>
                <p className="pl-4">&quot;accounts&quot;: [</p>
                <p className="pl-8">{`{`}</p>
                <p className="pl-12">&quot;id&quot;: &quot;acc_…&quot;,</p>
                <p className="pl-12">&quot;name&quot;: &quot;Cheque Account&quot;,</p>
                <p className="pl-12">&quot;balance&quot;: 12450.00,</p>
                <p className="pl-12">&quot;currency&quot;: &quot;NAD&quot;</p>
                <p className="pl-8">{`}`}</p>
                <p className="pl-4">]</p>
                <p className="text-foreground">{`}`}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 py-24">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Ready to get started?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join the open banking ecosystem in Namibia. Connect banks, build apps, and give
            customers control over their financial data.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className={cn(buttonVariants({ size: 'lg' }))}>
              Create free account
            </Link>
            <Link href="/login" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
              Sign in to dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">
              BB
            </span>
            <span>BankBridge © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-foreground">
              Dashboard
            </Link>
            <a href="/docs" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              API docs
            </a>
            <Link href="/register" className="hover:text-foreground">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
