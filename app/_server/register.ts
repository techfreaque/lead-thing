'use server';

import { v4 as uuidv4 } from 'uuid';
import { encryptPassword } from '@/app/_lib/helpers';
import { prisma } from '@/app/_server/prisma';

export async function register({
    email,
    password,
    company,
    name,
    website,
    address,
    zipCode,
    country,
}: {
    name: string;
    email: string;
    company: string;
    password: string;
    website: string;
    address: string;
    zipCode: string;
    country: string;
}): Promise<boolean> {
    const existingUser = await prisma.user.findUnique({
        select: { email: true },
        where: { email },
    });
    if (existingUser) {
        return false;
    }
    await prisma.user.create({
        data: {
            name,
            email,
            company,
            password: encryptPassword(password),
            website,
            address,
            zipCode,
            country,
            apiKey: uuidv4(),
        },
    });
    return true;
}
