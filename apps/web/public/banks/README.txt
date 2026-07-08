Bank logo images go here.

Name each file by the bank slug so it matches the seeded Bank.logoUrl:

  bank-windhoek.png
  fnb-namibia.png
  standard-bank-namibia.png
  nedbank-namibia.png

These are served by Next.js at /banks/<slug>.png and referenced by
Bank.logoUrl in the database (see apps/api/prisma/seed.ts).

If your logos use a different set of banks or a different image format,
tell the assistant and the seed + adapters will be updated to match.
