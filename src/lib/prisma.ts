import { PrismaClient } from "generated/prisma";
import { env } from "src/env";

export const prisma = new PrismaClient({
    log: env.NODE_ENV === 'dev' ? ['query'] : [],
})