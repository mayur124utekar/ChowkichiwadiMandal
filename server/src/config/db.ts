import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const DEFAULT_DATABASE_URL =
  'mysql://a95759_chowkichiwadi:P%40ssw0rd112233@mysql9001.site4now.net:3306/db_a95759_chowkichiwadi?charset=utf8mb4&collation=utf8mb4_unicode_ci';

const dbUrl = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: dbUrl,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
