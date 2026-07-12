Bank logo images go here.

Name each file by the bank slug so it matches the seeded Bank.logoUrl:

  bank-windhoek.png
  bank-of-namibia.png
  fnb-namibia.png
  nampost.jpg
  standard-bank-namibia.png
  nedbank-namibia.png

These are served by Next.js at /banks/<filename> and referenced by
Bank.logoUrl in the database (see apps/api/prisma/seed.ts).

The web app resolves logos via apps/web/src/lib/banks.ts.
