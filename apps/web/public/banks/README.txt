Bank logo images go here.

Name each file by the bank slug so it matches the seeded Bank.logoUrl:

  bank-windhoek.svg
  bank-of-namibia.svg
  fnb-namibia.svg
  nampost.svg
  standard-bank-namibia.svg
  nedbank-namibia.svg

These are served by Next.js at /banks/<slug>.svg and referenced by
Bank.logoUrl in the database (see apps/api/prisma/seed.ts).

Replace the placeholder SVGs with official bank logos when available.
