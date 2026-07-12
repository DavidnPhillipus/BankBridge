import { CategoryType, ConsentScope, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Stable id for the first-party dashboard application so re-seeds are idempotent.
const DEMO_APP_ID = '00000000-0000-4000-8000-000000000001';
const DAY_MS = 24 * 60 * 60 * 1000;

// The four simulated Namibian banks. `adapterKey` links each to its mock
// adapter implementation (built in Step 6).
// logoUrl points at /public/banks/<slug>.<ext> in the web app. The bank logo
// images live there (named by slug) and render automatically.
const BANKS = [
  {
    adapterKey: 'bank_windhoek',
    name: 'Bank Windhoek',
    slug: 'bank-windhoek',
    primaryColor: '#0033A0',
    logoUrl: '/banks/bank-windhoek.png',
  },
  {
    adapterKey: 'bank_of_namibia',
    name: 'Bank of Namibia',
    slug: 'bank-of-namibia',
    primaryColor: '#1D4E89',
    logoUrl: '/banks/bank-of-namibia.png',
  },
  {
    adapterKey: 'fnb_namibia',
    name: 'FNB Namibia',
    slug: 'fnb-namibia',
    primaryColor: '#008752',
    logoUrl: '/banks/fnb-namibia.png',
  },
  {
    adapterKey: 'nampost',
    name: 'NamPost',
    slug: 'nampost',
    primaryColor: '#E4002B',
    logoUrl: '/banks/nampost.jpg',
  },
  {
    adapterKey: 'standard_bank_namibia',
    name: 'Standard Bank Namibia',
    slug: 'standard-bank-namibia',
    primaryColor: '#0033A1',
    logoUrl: '/banks/standard-bank-namibia.png',
  },
  {
    adapterKey: 'nedbank_namibia',
    name: 'Nedbank Namibia',
    slug: 'nedbank-namibia',
    primaryColor: '#006A4D',
    logoUrl: '/banks/nedbank-namibia.png',
  },
] as const;

const CATEGORIES: Array<{ name: string; type: CategoryType; icon: string; color: string }> = [
  { name: 'Salary', type: CategoryType.INCOME, icon: 'wallet', color: '#22c55e' },
  { name: 'Transfers', type: CategoryType.TRANSFER, icon: 'repeat', color: '#64748b' },
  { name: 'Groceries', type: CategoryType.EXPENSE, icon: 'shopping-cart', color: '#f59e0b' },
  { name: 'Restaurants', type: CategoryType.EXPENSE, icon: 'utensils', color: '#ef4444' },
  { name: 'Transport', type: CategoryType.EXPENSE, icon: 'car', color: '#3b82f6' },
  { name: 'Utilities', type: CategoryType.EXPENSE, icon: 'zap', color: '#eab308' },
  { name: 'Subscriptions', type: CategoryType.EXPENSE, icon: 'tv', color: '#a855f7' },
  { name: 'Healthcare', type: CategoryType.EXPENSE, icon: 'heart-pulse', color: '#ec4899' },
  { name: 'Entertainment', type: CategoryType.EXPENSE, icon: 'film', color: '#14b8a6' },
  { name: 'Other', type: CategoryType.EXPENSE, icon: 'circle-dashed', color: '#94a3b8' },
];

async function upsertUser(params: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}): Promise<void> {
  const passwordHash = await bcrypt.hash(params.password, 12);
  await prisma.user.upsert({
    where: { email: params.email },
    update: {},
    create: {
      email: params.email,
      passwordHash,
      firstName: params.firstName,
      lastName: params.lastName,
      role: params.role,
    },
  });
  // eslint-disable-next-line no-console
  console.log(`Seeded ${params.role}: ${params.email}`);
}

async function seedBanks(): Promise<void> {
  for (const bank of BANKS) {
    await prisma.bank.upsert({
      where: { adapterKey: bank.adapterKey },
      update: {
        name: bank.name,
        slug: bank.slug,
        primaryColor: bank.primaryColor,
        logoUrl: bank.logoUrl,
      },
      create: { ...bank, country: 'NA', isActive: true },
    });
  }
  // Remove any banks that are no longer part of the supported set.
  await prisma.bank.deleteMany({
    where: { adapterKey: { notIn: BANKS.map((b) => b.adapterKey) } },
  });
  // eslint-disable-next-line no-console
  console.log(`Seeded ${BANKS.length} banks`);
}

async function seedCategories(): Promise<void> {
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { type: category.type, icon: category.icon, color: category.color },
      create: category,
    });
  }
  // eslint-disable-next-line no-console
  console.log(`Seeded ${CATEGORIES.length} categories`);
}

async function seedApplication(ownerId: string): Promise<string> {
  await prisma.application.upsert({
    where: { id: DEMO_APP_ID },
    update: { name: 'FinConnect Dashboard', ownerId },
    create: {
      id: DEMO_APP_ID,
      ownerId,
      name: 'FinConnect Dashboard',
      description: 'First-party dashboard application',
      environment: 'SANDBOX',
      redirectUris: [],
    },
  });
  // eslint-disable-next-line no-console
  console.log('Seeded demo application: FinConnect Dashboard');
  return DEMO_APP_ID;
}

async function seedConsents(userId: string, applicationId: string): Promise<void> {
  const targetKeys = ['bank_windhoek', 'fnb_namibia', 'nedbank_namibia'];
  const banks = await prisma.bank.findMany({
    where: { adapterKey: { in: targetKeys } },
  });
  // Idempotent: clear this user's consents for the demo app, then recreate.
  await prisma.consent.deleteMany({ where: { userId, applicationId } });
  const scopes: ConsentScope[] = [
    ConsentScope.ACCOUNTS_READ,
    ConsentScope.BALANCES_READ,
    ConsentScope.TRANSACTIONS_READ,
  ];
  const expiresAt = new Date(Date.now() + 90 * DAY_MS);
  for (const bank of banks) {
    await prisma.consent.create({
      data: { userId, applicationId, bankId: bank.id, scopes, status: 'ACTIVE', expiresAt },
    });
  }
  // eslint-disable-next-line no-console
  console.log(`Seeded ${banks.length} consents for demo customer`);
}

async function migrateDemoEmails(): Promise<void> {
  const renames = [
    ['admin@bankbridge.na', 'admin@finconnect.na'],
    ['dev@bankbridge.na', 'dev@finconnect.na'],
    ['customer@bankbridge.na', 'customer@finconnect.na'],
  ] as const;
  for (const [from, to] of renames) {
    const existing = await prisma.user.findUnique({ where: { email: from } });
    if (!existing) continue;
    const taken = await prisma.user.findUnique({ where: { email: to } });
    if (taken) {
      await prisma.user.delete({ where: { email: from } });
    } else {
      await prisma.user.update({ where: { email: from }, data: { email: to } });
    }
  }
}

async function main(): Promise<void> {
  await migrateDemoEmails();

  await upsertUser({
    email: 'admin@finconnect.na',
    password: 'Admin123!',
    firstName: 'Platform',
    lastName: 'Admin',
    role: Role.ADMIN,
  });
  await upsertUser({
    email: 'dev@finconnect.na',
    password: 'Dev123!',
    firstName: 'Demo',
    lastName: 'Developer',
    role: Role.DEVELOPER,
  });
  await upsertUser({
    email: 'customer@finconnect.na',
    password: 'Customer123!',
    firstName: 'Demo',
    lastName: 'Customer',
    role: Role.CUSTOMER,
  });

  await seedBanks();
  await seedCategories();

  const [dev, customer] = await Promise.all([
    prisma.user.findUnique({ where: { email: 'dev@finconnect.na' } }),
    prisma.user.findUnique({ where: { email: 'customer@finconnect.na' } }),
  ]);
  if (dev && customer) {
    const appId = await seedApplication(dev.id);
    await seedConsents(customer.id, appId);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
