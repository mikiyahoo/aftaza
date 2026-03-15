import { PrismaClient } from "@prisma/client";
import { performanceMiddleware } from './performanceLogger';

const client = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

const extendedClient = client.$extends(performanceMiddleware);

export const prisma = extendedClient;

declare global {
  // eslint-disable-next-line no-var
  var prisma: typeof extendedClient | undefined;
}

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
