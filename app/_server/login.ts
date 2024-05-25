'use server';

import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import getConfig from 'next/config';

import { UserType } from '@/app/_context/authentication';
import { prisma } from '@/app/_server/prisma';

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
