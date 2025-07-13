import { PrismaClient } from "@prisma/client";

declare global{
    //  extending the global object to have an optional prisma property.
    var prisma : PrismaClient | undefined;
}

