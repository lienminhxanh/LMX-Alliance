const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const p = await prisma.project.findMany();
  console.log(JSON.stringify(p.map(x => ({ id: x.id, images: x.images })), null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
