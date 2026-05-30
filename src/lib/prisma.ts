import { PrismaClient } from "../generated/prisma";

// its not good to do it like this becaues nextjs restarts a lot and this could cause a lot of database calls
// const prisma = new PrismaClient();
// export default prisma;

//globals persist through reloads, this is how you cast as global in TS
const globalForPrisma = global as unknown as { prisma: PrismaClient };

//"If a prisma instance alr exists, use that one otherwise make a new one" || means or
const prisma = globalForPrisma.prisma || new PrismaClient();

//Save the prisma instance to the global object so you can reuse it next cycle
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
