import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import path from 'path';
import * as fs from 'fs';


const prisma = new PrismaClient();

async function main() {
  // Vérifier si l'admin existe déjà
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@admin.com' },
  });

  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@admin.com',
        username: 'admin',
        firstname: 'Admin',
        password: hashedPassword,
      },
    });
    console.log(' Admin créé');
  }

  // Vérifier si l'utilisateur existe déjà
  const user = await prisma.user.findUnique({
    where: { email: 'user@example.com' },
  });

  if (!user) {
    const hashedPassword = await bcrypt.hash('user123', 10);
    await prisma.user.create({
      data: {
        email: 'user@example.com',
        username: 'user',
        firstname: 'Utilisateur',
        password: hashedPassword,
      },
    });
    console.log(' Utilisateur standard créé');
  }
      const dataPath = './prisma/products.json';

  const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  for (const product of products) {
    const exists = await prisma.product.findUnique({ where: { id: product.id } });
    if (!exists) {
      await prisma.product.create({
        data: {
          ...product,
            quantity: product.quantity ?? 10,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
        },
      });
    }
  }

  console.log(`${products.length} produits insérés`);
}



main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
