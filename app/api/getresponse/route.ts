import { NextRequest, NextResponse } from 'next/server';
import type { GetresponsePostRequest } from '../types';
import executeIfAuthenticated, { ApiResponse, formatApiCallDetails } from '../apiHelpers';

const apiContactsPath = 'https://api.getresponse.com/v3/contacts';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    ip,
    // gender,
    // countryCode,
    // salutation,
    listId,
    // subscriptionMode,
    tagId,
    getresponseApiKey,
  }: GetresponsePostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    try {
      const response: Response = await fetch(apiContactsPath, {
        method: 'post',
        headers: {
          'X-Auth-Token': 'api-key ' + getresponseApiKey,
        },
        body: JSON.stringify({
          name: `${firstname} ${lastname}`,
          campaign: {
            campaignId: listId,
          },
          email: email,
          ipAddress: ip,
          ...(tagId
            ? {
                tags: [
                  {
                    tagId: tagId,
                  },
                ],
              }
            : {}),
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
            ip,
            listId,
            tagId,
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
          ip,
          listId,
          tagId,
        })}`,
        500
      );
    }
  }
  return await executeIfAuthenticated(request, forwardToNewsletterSystem);
}
