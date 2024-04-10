import getConfig from 'next/config';
import { NextRequest, NextResponse } from 'next/server';
import { handleResponse } from '@/app/api/apiHelpers';
import { generateAccessToken } from '@/app/lib/paypal';
import { subscriptionTierType } from '@/app/constants';
import { createOrder, updateToPaypalOrderId } from '@/app/lib/orders';

const { serverRuntimeConfig } = getConfig();

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { subscription, email }: { subscription: subscriptionTierType; email: string } =
    await request.json();
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { jsonResponse, httpStatusCode } = await _createOrder(subscription, email);
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

const _createOrder = async (
  subscription: subscriptionTierType,
  email: string
): Promise<{
  jsonResponse: any;
  httpStatusCode: number;
}> => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  const order = await createOrder(
    email,
    subscription.productId,
    Number((subscription.price * 12).toFixed(2))
  );
  const accessToken = await generateAccessToken();
  const url = `${serverRuntimeConfig.PAYPAL_API_URL}/v2/checkout/orders`;
  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: `${(subscription.price * 12).toFixed(2)}`,
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
  const _response = await handleResponse(response);
  await updateToPaypalOrderId(email, order.id, _response.jsonResponse.id);
  return _response;
};
