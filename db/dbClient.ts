
import {PrismaClient} from "@prisma/client"

export const DbClient = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV==="development"){
    globalThis.prisma = DbClient;
}