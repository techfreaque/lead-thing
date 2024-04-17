import getConfig from 'next/config';
import { NextRequest, NextResponse } from 'next/server';
import { handleResponse } from '@/app/api/apiHelpers';
import { generateAccessToken } from '@/app/lib/paypal';
import { markOrderAsPaid } from '@/app/lib/orders';

const { serverRuntimeConfig } = getConfig();

export interface captureRequestBody {
  email: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string; }; }
): Promise<NextResponse> {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { email }: captureRequestBody = await request.json();
    const { jsonResponse, httpStatusCode } = await captureOrder(params.orderId, email);
    return new NextResponse(JSON.stringify(jsonResponse), {
      status: httpStatusCode,
    });
  } catch (error) {
    console.error('Failed to create order:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to create order.' }), {
      status: 500,
    });
  }
}

const captureOrder = async (orderId: string, email: string) => {
  const accessToken = await generateAccessToken();
  const url = `${serverRuntimeConfig.PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });
  await markOrderAsPaid(email, orderId);
  return handleResponse(response);
};
