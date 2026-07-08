export default function LandingPage(): React.ReactElement {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--primary)/0.18),transparent)]" />
      <div className="container relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <span className="mb-6 inline-flex items-center rounded-full border border-border bg-secondary/40 px-4 py-1.5 text-sm text-muted-foreground">
          Open Banking Platform · Namibia
        </span>
        <h1 className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-6xl">
          One API for every bank in Namibia
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          BankBridge securely connects banks, customers, and fintech apps through a
          single standardized API — consent-driven, auditable, and developer-first.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/login"
            className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Get started
          </a>
          <a
            href="/docs"
            className="rounded-lg border border-border px-6 py-3 font-medium text-foreground transition hover:bg-secondary/40"
          >
            API docs
          </a>
        </div>
        <p className="mt-16 text-sm text-muted-foreground">
          Scaffold ready — dashboard, analytics, and developer portal coming in
          later steps.
        </p>
      </div>
    </main>
  );
}
