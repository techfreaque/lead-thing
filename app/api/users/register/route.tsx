import { encryptPassword } from '@/app/lib/helpers';
import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

interface RegisterPostRequest {
  name: string;
  email: string;
  company: string;
  password: string;
  website: string;
  address: string;
  zipCode: string;
  country: string;
}
export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    name,
    email,
    company,
    password,
    website,
    address,
    zipCode,
    country,
  }: RegisterPostRequest = await request.json();
  const existingUser = await prisma.user.findUnique({
    select: { email: true },
    where: { email },
  });
  if (existingUser) {
    return new NextResponse(JSON.stringify({ error: 'User with this email already exists' }), {
      status: 409,
    });
  }
  const data = {
    name,
    email,
    company,
    password: encryptPassword(password),
    website,
    address,
    zipCode,
    country,
    apiKey: uuidv4(),
    billingPeriodDay: new Date().getDate(),
  };
  await prisma.user.create({
    data,
  });

  return new NextResponse('Successfully signed up, you can log in now', {
    status: 200,
  });
}
