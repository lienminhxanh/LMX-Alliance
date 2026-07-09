const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany();
  console.log('Project images type:', typeof projects[0].images);
  console.log('Is Array?', Array.isArray(projects[0].images));
  console.log('Content:', projects[0].images);
}

main().finally(() => prisma.$disconnect());
