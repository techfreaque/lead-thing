import { handleResponse } from '@/app/api/apiHelpers';
import { generateAccessToken } from '@/app/lib/paypal';
import getConfig from 'next/config';
import { NextRequest, NextResponse } from 'next/server';

const { serverRuntimeConfig } = getConfig();

interface OrdersPostRequest {
  cart;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { cart }: OrdersPostRequest = await request.json();
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    console.log('fsdfsd', cart);
    const { jsonResponse, httpStatusCode } = await createOrder({ cart });
    console.log('fsdfsd', cart, jsonResponse, httpStatusCode);
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

const createOrder = async ({ cart }: OrdersPostRequest) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log('shopping cart information passed from the frontend createOrder() callback:', cart);

  const accessToken = await generateAccessToken();
  const url = `${serverRuntimeConfig.PAYPAL_API_URL}/v2/checkout/orders`;
  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: '100.00',
        },
      },
    ],
  };

  const response: Response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};
