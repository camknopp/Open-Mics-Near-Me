import { PrismaClient } from '@prisma/client';

// Add prisma to the NodeJS global type to prevent multiple instances in development
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: ['query'], // Optional: logs all database queries to the console
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;