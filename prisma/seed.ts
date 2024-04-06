import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const aYearFromNow: Date = new Date();
    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
    const user = await prisma.user.upsert({
        where: { email: "admin@admin.com" },
        update: {},
        create: {
            name: "Admin",
            email: "admin@admin.com",
            company: "test",
            address: "nopestreet 1",
            zipCode: "12345",
            country: "Germany",
            website: "https://nope.com",
            password: "1231",
            apiKeyValidUntil: aYearFromNow,
            apiKey: "1234",
        }
    });

    console.log({ user });
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit();
    });