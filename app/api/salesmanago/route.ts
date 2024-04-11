import { NextRequest, NextResponse } from 'next/server';
import type { SalesmanagoPostRequest } from '../requestTypes';
import executeIfAuthenticated, { ApiResponse, formatApiCallDetails } from '../apiHelpers';

const apiContactsPath = 'salesmanago.com/api/contact/upsert';

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
    salesManagoSubDomain,
    salesManagoOwner,
  }: SalesmanagoPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    try {
      const response: Response = await fetch('https://' + salesManagoSubDomain + apiContactsPath, {
        method: 'post',
        headers,
        body: JSON.stringify({
          clientId: salesManagoClientId,
          apiKey: salesManagoApiKey,
          requestTime: Date.now(),
          sha: salesManagoSha,

          owner: salesManagoOwner,
          contact: {
            email: email,
            name: `${firstname} ${lastname}`,
            address: {
              country: countryCode,
            },
          },

          forceOptIn: subscriptionMode === 'FORCE_OPT_IN' ? true : false,
          ...(tag ? { tags: [tag] } : {}),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        return ApiResponse(
          'Contact successfully added and subscribed! Response: ' + JSON.stringify(data),
          200
        );
      } else {
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
      }
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
  return await executeIfAuthenticated(request, forwardToNewsletterSystem);
}
