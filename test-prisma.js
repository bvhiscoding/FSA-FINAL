const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

// PrismaLibSql is a factory, not a direct adapter
async function main() {
  try {
    const dbUrl = 'file:C:/Users/NCPC/Desktop/Frontend FSA/finsight-ai/dev.db';
    const adapter = new PrismaLibSql({ url: dbUrl });
    console.log('Adapter provider:', adapter.provider);
    const prisma = new PrismaClient({ adapter });
    console.log('PrismaClient created');
    const count = await prisma.user.count();
    console.log('User count:', count);
    await prisma.$disconnect();
  } catch (e) {
    console.error('ERROR:', e.message);
  }
}

main();
