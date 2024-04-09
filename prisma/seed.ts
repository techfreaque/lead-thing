import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const aYearFromNow: Date = new Date();
  aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
  const user = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      name: 'payeduser',
      email: 'admin@admin.com',
      company: 'test',
      address: 'nopestreet 1',
      zipCode: '12345',
      country: 'Germany',
      website: 'https://nope.com',
      password: '1231',
      apiKeyValidUntil: aYearFromNow,
      apiKey: '1234',
      billingPeriodDay: 7,
      apiCallsPerMonth: 1000,
    },
  });
  console.log({ user });
  const freeUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'freeuser',
      email: 'user@example.com',
      company: 'test',
      address: 'nopestreet 1',
      zipCode: '12345',
      country: 'Germany',
      website: 'https://nope.com',
      password: '1231',
      apiKey: '12345',
      billingPeriodDay: 7,
      apiCallsPerMonth: 100,
    },
  });

  console.log({ freeUser });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit();
  });
