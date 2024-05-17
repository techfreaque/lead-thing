'use server';

import bcrypt from 'bcryptjs';
import getConfig from 'next/config';
import { sign } from 'jsonwebtoken';
import { prisma } from '@/app/_server/prisma';
import { UserType } from '@/app/_context/authentication';

const { serverRuntimeConfig } = getConfig();

export async function getLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<UserType | false> {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  console.log('debug', user, email, password, user?.password);
  if (!(user && bcrypt.compareSync(password, user.password))) {
    return false;
  }
  const token = sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '2d' });
  return {
    token,
    name: user.name,
    company: user.company,
    address: user.address,
    zipCode: user.zipCode,
    country: user.country,
    website: user.website,
    email: user.email,
    apiKey: user.apiKey,
  } as UserType;
}
