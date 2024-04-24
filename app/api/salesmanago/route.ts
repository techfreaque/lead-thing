import { NextRequest, NextResponse } from 'next/server';
import type { SalesmanagoPostRequest } from '../requestTypes';
import executeIfAuthenticated from '../../_server/apiHelpers';
import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

const apiContactsUrl = 'https://{salesManagoDomain}/api/contact/upsert';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    // ip,
    // gender,
    countryCode,
    // salutation,
    // listId,
    subscriptionMode,
    tag,
    salesManagoClientId,
    salesManagoApiKey,
    salesManagoSha,
    salesManagoDomain,
    salesManagoOwner,
  }: SalesmanagoPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    try {
      const response: Response = await fetch(
        apiContactsUrl.replace('{salesManagoDomain}', salesManagoDomain),
        {
          method: 'post',
          headers,
          body: JSON.stringify({
            clientId: salesManagoClientId,
            apiKey: salesManagoApiKey,
            requestTime: Date.now(),
            sha: salesManagoSha,

            owner: salesManagoOwner,
            contact: {
              email,
              name: `${firstname} ${lastname}`,
              address: {
                country: countryCode,
              },
            },

            forceOptIn: subscriptionMode === 'FORCE_OPT_IN',
            ...(tag ? { tags: [tag] } : {}),
          }),
        }
      );
      const data = await response.json();
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
          countryCode,
          subscriptionMode,
          tag,
        })}`,
        500
      );
    } catch (error) {
      return ApiResponse(
        `Failed to add the contact with an unknown error. Error: ${error} ${formatApiCallDetails({
          firstname,
          lastname,
          email,
          countryCode,
          subscriptionMode,
          tag,
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
