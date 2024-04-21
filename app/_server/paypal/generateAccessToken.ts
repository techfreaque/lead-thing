'use server';

import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export async function generateAccessToken() {
  try {
    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || !serverRuntimeConfig.PAYPAL_CLIENT_SECRET) {
      throw new Error('MISSING_API_CREDENTIALS');
    }
    const auth = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${serverRuntimeConfig.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');
    const response = await fetch(`${serverRuntimeConfig.PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    throw new Error(`Failed to generate Access Token: ${error}`);
  }
  return undefined;
}
