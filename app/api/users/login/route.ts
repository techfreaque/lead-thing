import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import getConfig from 'next/config';
import { sign } from 'jsonwebtoken';
import { prisma } from '@/app/lib/prisma';
import { UserType } from '@/app/lib/authentication';

interface LoginPostRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserType;
}

const { serverRuntimeConfig } = getConfig();

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { email, password }: LoginPostRequest = await request.json();
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!(user && bcrypt.compareSync(password, user.password))) {
    return new NextResponse(JSON.stringify({ error: 'Email or password is incorrect!' }), {
      status: 401,
    });
  }

  const token = sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '2d' });

  return new NextResponse(
    JSON.stringify({
      user: {
        token,
        name: user.name,
        company: user.company,
        address: user.address,
        zipCode: user.zipCode,
        country: user.country,
        website: user.website,
        email: user.email,
        apiKeyValidUntil: user.apiKeyValidUntil,
        apiKey: user.apiKey,
      },
    } as LoginResponse),
    {
      status: 200,
    }
  );
}
