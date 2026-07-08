import { CategoryType, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// The four simulated Namibian banks. `adapterKey` links each to its mock
// adapter implementation (built in Step 6).
const BANKS = [
  {
    adapterKey: 'bank_windhoek',
    name: 'Bank Windhoek',
    slug: 'bank-windhoek',
    primaryColor: '#0033A0',
  },
  {
    adapterKey: 'fnb_namibia',
    name: 'FNB Namibia',
    slug: 'fnb-namibia',
    primaryColor: '#008752',
  },
  {
    adapterKey: 'standard_bank_namibia',
    name: 'Standard Bank Namibia',
    slug: 'standard-bank-namibia',
    primaryColor: '#0033A1',
  },
  {
    adapterKey: 'nedbank_namibia',
    name: 'Nedbank Namibia',
    slug: 'nedbank-namibia',
    primaryColor: '#006A4D',
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
      update: { name: bank.name, slug: bank.slug, primaryColor: bank.primaryColor },
      create: { ...bank, country: 'NA', isActive: true },
    });
  }
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

async function main(): Promise<void> {
  await upsertUser({
    email: 'admin@bankbridge.na',
    password: 'Admin123!',
    firstName: 'Platform',
    lastName: 'Admin',
    role: Role.ADMIN,
  });
  await upsertUser({
    email: 'dev@bankbridge.na',
    password: 'Dev123!',
    firstName: 'Demo',
    lastName: 'Developer',
    role: Role.DEVELOPER,
  });
  await upsertUser({
    email: 'customer@bankbridge.na',
    password: 'Customer123!',
    firstName: 'Demo',
    lastName: 'Customer',
    role: Role.CUSTOMER,
  });

  await seedBanks();
  await seedCategories();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
