import { NextRequest, NextResponse } from 'next/server';
import { markAsPaidBody, markOrderAsPaid } from '@/app/_server/orders';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const payload: markAsPaidBody = await request.json();
  await markOrderAsPaid(payload);
  return new NextResponse('success', {
    status: 200,
  });
}
