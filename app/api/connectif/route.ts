import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

import executeIfAuthenticated from '../../_server/apiHelpers';
import type { ConnectifRequest } from '../requestTypes';

const apiContactsUrl = 'https://api.connectif.cloud/contacts/{email}';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { firstname, lastname, email, connectifApiKey }: ConnectifRequest = await request.json();
  async function forwardToNewsletterSystem() {
    try {
      const response: Response = await fetch(apiContactsUrl.replace('{email}', email), {
        method: 'PATCH',
        headers: {
          Authorization: `apiKey ${connectifApiKey}`,
        },
        body: JSON.stringify({
          _emailStatus: 'active',
          _name: firstname,
          _surname: lastname,
          _newsletterSubscriptionStatus: 'subscribed',
        }),
      });
      const data = await response.text();
      if (response.ok) {
        return ApiResponse(
          `Contact successfully added and subscribed! Response: ${JSON.stringify(data)}`,
          200
        );
      }
      return ApiResponse(
        `Failed to add the contact. Error: ${JSON.stringify(data)} ${formatApiCallDetails({
          firstname,
          lastname,
          email,
        })}`,
        500
      );
    } catch (error) {
      return ApiResponse(
        `Failed to add the contact with an unknown error. Error: ${error} ${formatApiCallDetails({
          firstname,
          lastname,
          email,
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
