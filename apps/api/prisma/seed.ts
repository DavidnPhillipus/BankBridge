import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
