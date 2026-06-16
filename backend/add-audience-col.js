const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "audience" TEXT DEFAULT 'all'`
  );
  console.log('Column added (or already exists).');
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
