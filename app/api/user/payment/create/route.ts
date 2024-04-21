import { NextRequest, NextResponse } from 'next/server';
import { subscriptionTierType } from '@/app/_lib/constants';
import { createSubscription } from '@/app/_server/paypal/subscription';

export interface startPaymentBody {
    product: subscriptionTierType;
    email: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const {
        product,
        email,
    }: startPaymentBody = await request.json();
    const data = await createSubscription(product, email);
    return new NextResponse(
        JSON.stringify(data),
        {
            status: 200,
        }
    );
}
