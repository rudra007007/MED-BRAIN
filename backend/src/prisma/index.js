/**
 * Prisma Client Instance
 * 
 * Singleton pattern ensures single database connection across the application.
 * Handles connection lifecycle and graceful shutdown.
 */

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

/**
 * Declaring global type for Prisma client to avoid hot-reload issues in development
 * @type {ReturnType<typeof prismaClientSingleton>}
 */
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

// Hot reload fix: in development, store client in global to prevent recreation
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown handler
 * Ensures database connections are properly closed on process termination
 */
const gracefulShutdown = async () => {
  console.log('🛑 Received termination signal, closing database connections...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
