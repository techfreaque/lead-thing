import { NextRequest, NextResponse } from 'next/server';
import type { GetresponsePostRequest } from '../requestTypes';
import executeIfAuthenticated from '../../_server/apiHelpers';
import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

const apiContactsPath = 'https://api.getresponse.com/v3/contacts';
const apiListsPath = 'https://api.getresponse.com/v3/campaigns';

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
      const headers = {
        'X-Auth-Token': `api-key ${getresponseApiKey}`,
        'content-type': 'application/json',
      };
      const response: Response = await fetch(apiContactsPath, {
        method: 'post',
        headers,
        body: JSON.stringify({
          name: `${firstname} ${lastname}`,
          campaign: {
            campaignId: listId,
          },
          email,
          ipAddress: ip,
          ...(tagId
            ? {
              tags: [
                {
                  tagId,
                },
              ],
            }
            : {}),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        return ApiResponse(
          `Contact successfully added and subscribed! Response: ${JSON.stringify(data)}`,
          200
        );
      }
      let additionalInfo = '';
      if (data.code === 1001) {
        // wrong listid
        try {
          const listResponse = await fetch(apiListsPath, {
            method: 'get',
            headers,
          });
          additionalInfo = `\nAvailable Lists: ${JSON.stringify(
            (
              (await listResponse.json()) as {
                campaignId: string;
                name: string;
                description: string;
              }[]
            ).map((list) => ({
              campaignId: list.campaignId,
              name: list.name,
              description: list.description,
            }))
          )}`;
        } catch (e) { /* empty */ }
      }
      return ApiResponse(
        `Failed to add the contact. Error: ${JSON.stringify(data)}${additionalInfo} ${formatApiCallDetails(
          {
            firstname,
            lastname,
            email,
            ip,
            listId,
            tagId,
          }
        )}`,
        500
      );
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
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
