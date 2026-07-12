import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Briefcase,
  Calculator,
  ChartLine,
  CheckCircle2,
  Database,
  Landmark,
  Lock,
  PiggyBank,
  Shield,
  ShieldCheck,
  Smartphone,
  User,
  Wallet,
  FileText,
  Eye,
  KeyRound,
} from 'lucide-react';
import { BankLogo } from '@/components/banks/bank-logo';
import { FinConnectLogo } from '@/components/brand/finconnect-logo';
import { SUPPORTED_BANKS } from '@/lib/banks';
import { cn } from '@/lib/utils';

const AUDIENCE_CARDS = [
  {
    icon: Landmark,
    title: 'Banks',
    description: 'Expand your ecosystem and drive innovation.',
  },
  {
    icon: Smartphone,
    title: 'Fintechs',
    description: 'Build powerful products faster and smarter.',
  },
  {
    icon: Briefcase,
    title: 'Businesses',
    description: 'Automate financial operations and grow.',
  },
  {
    icon: User,
    title: 'Consumers',
    description: 'Take control of your financial life.',
  },
  {
    icon: ShieldCheck,
    title: 'Government',
    description: 'Enable inclusive and transparent services.',
  },
] as const;

const POSSIBILITIES = [
  { icon: Wallet, label: 'Budgeting Apps', color: 'bg-violet-500/20 text-violet-400' },
  { icon: PiggyBank, label: 'Loan Platforms', color: 'bg-emerald-500/20 text-emerald-400' },
  { icon: ChartLine, label: 'Investment Apps', color: 'bg-fuchsia-500/20 text-fuchsia-400' },
  { icon: Calculator, label: 'Accounting Tools', color: 'bg-orange-500/20 text-orange-400' },
  { icon: Shield, label: 'Insurance Services', color: 'bg-cyan-500/20 text-cyan-400' },
  { icon: Building2, label: 'Payroll Systems', color: 'bg-blue-500/20 text-blue-400' },
] as const;

const HOW_IT_WORKS = [
  { icon: User, title: 'Connect', description: 'User connects their bank securely.' },
  { icon: Shield, title: 'Authenticate', description: 'The bank authenticates the user.' },
  { icon: CheckCircle2, title: 'Authorize', description: 'User grants permission for data access.' },
  { icon: Database, title: 'Access', description: 'FinConnect securely retrieves the data.' },
  { icon: ChartLine, title: 'Empower', description: 'Apps deliver insights and experiences.' },
] as const;

const DEV_FEATURES = [
  'Easy integration',
  'Comprehensive API docs',
  'Sandbox environment',
  'Real-time monitoring',
  'Enterprise grade security',
] as const;

const SECURITY_FEATURES = [
  { icon: Lock, title: 'End-to-End Encryption', side: 'left' },
  { icon: CheckCircle2, title: 'User Consent', side: 'left' },
  { icon: KeyRound, title: 'Strong Authentication', side: 'left' },
  { icon: FileText, title: 'Audit Logs', side: 'right' },
  { icon: Eye, title: 'Data Privacy', side: 'right' },
  { icon: ShieldCheck, title: 'Compliance First', side: 'right' },
] as const;

function PurpleButton({
  href,
  children,
  className,
  variant = 'solid',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'solid' | 'ghost';
}): React.ReactElement {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold transition',
        variant === 'solid'
          ? 'bg-[#5A39E1] text-white hover:bg-[#4A2FD0]'
          : 'border border-white/25 bg-transparent text-white hover:bg-white/10',
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function LandingPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-white font-sans text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[hsl(222_48%_8%)]">
        <header className="relative z-20 mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <FinConnectLogo href="/" size={40} theme="dark" />
          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#platform" className="transition hover:text-white">
              Platform
            </a>
            <a href="#solutions" className="transition hover:text-white">
              Solutions
            </a>
            <a href="#developers" className="transition hover:text-white">
              Developers
            </a>
            <a href="#about" className="transition hover:text-white">
              About Us
            </a>
          </nav>
          <PurpleButton href="/register">Get Started</PurpleButton>
        </header>

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 pb-20 pt-10 lg:grid-cols-2 lg:gap-16 lg:pb-28 lg:pt-16">
          <div className="relative z-10">
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Connect.{' '}
              <span className="text-[hsl(42_92%_52%)]">Innovate.</span>{' '}
              <span className="text-[hsl(42_92%_52%)]">Transform.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              FinConnect is Namibia&apos;s open finance platform enabling secure data sharing between
              banks, fintechs and businesses — with your consent.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PurpleButton href="/register">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </PurpleButton>
              <a
                href="/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-lg border border-white/25 px-5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Explore Docs
              </a>
            </div>
          </div>

          <div className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(260_70%_50%/0.25),transparent_70%)]" />
            <Image
              src="/landing/hero-ecosystem.png"
              alt="FinConnect ecosystem connecting banks, fintechs, businesses, government and consumers"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Powering the Future */}
      <section id="platform" className="bg-[hsl(220_16%_96%)] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
            Powering the Future of Finance
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {AUDIENCE_CARDS.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-xl border border-border bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#5A39E1]/10 text-[#5A39E1]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Endless Possibilities */}
      <section id="solutions" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-3xl bg-[hsl(222_48%_10%)] px-6 py-14 md:px-12 md:py-16">
            <h2 className="text-center font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              Endless Possibilities
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-white/65">
              FinConnect enables a new generation of financial products and services.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {POSSIBILITIES.map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm"
                >
                  <div className={cn('flex h-14 w-14 items-center justify-center rounded-xl', color)}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="text-sm font-medium text-white/90">{label}</span>
                </div>
              ))}
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 p-5 text-center">
                <span className="text-2xl tracking-widest text-white/50">•••</span>
                <span className="text-sm font-medium text-white/70">And More…</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How FinConnect Works */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
            How FinConnect Works
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {HOW_IT_WORKS.map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="relative flex flex-col items-center text-center">
                {index < HOW_IT_WORKS.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute left-[calc(50%+2rem)] top-7 hidden h-px w-[calc(100%-4rem)] border-t border-dashed border-[#5A39E1]/30 lg:block"
                  />
                )}
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#5A39E1]/30 bg-[#5A39E1]/10 text-[#5A39E1]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Banks */}
      <section id="banks" className="border-y border-border bg-[hsl(220_16%_97%)] py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
            Supported Namibian Banks
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Dedicated adapters for Namibia&apos;s major institutions — normalized into one schema.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {SUPPORTED_BANKS.map((bank) => (
              <div key={bank.slug} className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-20 w-full items-center justify-center rounded-xl border border-border bg-white p-3 shadow-sm">
                  <BankLogo slug={bank.slug} name={bank.name} size={64} className="max-h-14 w-auto" />
                </div>
                <span className="text-xs font-medium leading-tight text-foreground/80">{bank.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Developers */}
      <section id="developers" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-3xl bg-[hsl(222_48%_10%)]">
            <div className="grid items-center gap-10 p-8 md:p-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Built for Developers
                </h2>
                <p className="mt-4 text-lg text-white/65">One API. Endless possibilities.</p>
                <ul className="mt-8 space-y-4">
                  {DEV_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-white/85">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#5A39E1]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <PurpleButton href="/register">Create Developer Account</PurpleButton>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/10 bg-[hsl(222_48%_6%)] shadow-2xl">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-white/40">api.finconnect.na</span>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-emerald-300/90">
                  <code>{`GET /api/v1/public/accounts
X-API-Key: fc_live.xxxxxxxx

{
  "accounts": [{
    "id": "acc_001",
    "name": "Checking Account",
    "balance": "12500.50",
    "currency": "NAD"
  }]
}`}</code>
                </pre>
                <div className="border-t border-white/10 p-4">
                  <button
                    type="button"
                    className="w-full rounded-lg bg-[#5A39E1] py-2.5 text-sm font-semibold text-white"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="bg-[hsl(220_16%_96%)] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
            Security &amp; Trust at the Core
          </h2>
          <div className="relative mt-14 grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-8">
              {SECURITY_FEATURES.filter((f) => f.side === 'left').map(({ icon: Icon, title }) => (
                <div key={title} className="flex items-start gap-4 lg:flex-row-reverse lg:text-right">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#5A39E1]/30 bg-[#5A39E1]/10 text-[#5A39E1]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Built into every connection and data exchange.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mx-auto aspect-square w-56 sm:w-72 lg:w-80">
              <Image
                src="/landing/security-shield.png"
                alt="Security shield protecting financial data"
                fill
                className="object-contain"
                sizes="320px"
              />
            </div>

            <div className="space-y-8">
              {SECURITY_FEATURES.filter((f) => f.side === 'right').map(({ icon: Icon, title }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#5A39E1]/30 bg-[#5A39E1]/10 text-[#5A39E1]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Built into every connection and data exchange.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="about" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                One Connection. All Your Finances.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Aggregate your accounts, track spending, set goals and get AI-powered insights — all
                in one place.
              </p>
              <div className="mt-8">
                <Link
                  href="/register"
                  className="inline-flex h-11 items-center rounded-lg bg-[#5A39E1] px-6 text-sm font-semibold text-white transition hover:bg-[#4A2FD0]"
                >
                  Learn More
                </Link>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Demo:{' '}
                <code className="font-medium text-foreground">customer@finconnect.na</code> /{' '}
                <code className="font-medium text-foreground">Customer123!</code>
              </p>
            </div>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-[hsl(220_16%_97%)] shadow-lg">
              <Image
                src="/landing/dashboard-mockup.png"
                alt="FinConnect mobile and web dashboard showing spending overview and transactions"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <FinConnectLogo size={28} theme="light" />
            <span>© {new Date().getFullYear()}</span>
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
