import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";
export const database = new PrismaClient();