import { NextRequest, NextResponse } from 'next/server';
import SendSupportMail from '@/app/lib/mail/sendSupportMail';
interface SupportRequest {
  name: string;
  company: string | null;
  country: string | null;
  website: string | null;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { name, company, subject, country, website, email, message }: SupportRequest =
    await request.json();
  const transporter = await SendSupportMail(
    name,
    company,
    subject,
    country,
    website,
    email,
    message
  );
  if (
    transporter.customerMessageTransporter.accepted &&
    transporter.supportMessageTransporter.accepted
  ) {
    return new NextResponse('Success', {
      status: 200,
    });
  }
  return new NextResponse('Failed', {
    status: 500,
  });
}
