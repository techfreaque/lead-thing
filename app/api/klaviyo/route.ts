import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

import executeIfAuthenticated from '../../_server/apiHelpers';
import type { KlaviyoPostRequest } from '../requestTypes';

const apiContactsUrl = 'https://a.klaviyo.com/api/profiles/';
const apiListUrl = 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    listId,
    ip,
    tag,
    country,
    additionalProperties,
    klaviyoApiKey,
  }: KlaviyoPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    try {
      let parsedAdditionalProperties = {};
      try {
        if (additionalProperties) {
          parsedAdditionalProperties = JSON.parse(`{${additionalProperties.replace(/ /g, '')}}`);
        }
      } catch (e) {
        return ApiResponse(`Failed to parse additional properties: ${additionalProperties}`, 200);
      }
      const response: Response = await fetch(apiContactsUrl, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          revision: '2024-06-15',
          Authorization: `Klaviyo-API-Key ${klaviyoApiKey}`,
        },
        body: JSON.stringify({
          data: {
            type: 'profile',
            attributes: {
              email,
              first_name: firstname,
              last_name: lastname,
              location: {
                ...(country ? { country } : {}),
                ...(ip ? { ip } : {}),
              },
              properties: parsedAdditionalProperties,
            },
          },
        }),
      });
      const data = await response.json();
      if (response.ok) {
        const subscribeResponse: Response = await fetch(apiListUrl, {
          method: 'post',
          headers: {
            'content-type': 'application/json',
            accept: 'application/json',
            revision: '2023-08-15',
            Authorization: `Klaviyo-API-Key ${klaviyoApiKey}`,
          },
          body: JSON.stringify({
            data: {
              type: 'profile-subscription-bulk-create-job',
              attributes: {
                ...(tag ? { custom_source: tag } : {}),
                profiles: {
                  data: [
                    {
                      type: 'profile',
                      attributes: {
                        email,
                      },
                    },
                  ],
                },
              },
              relationships: {
                list: {
                  data: {
                    id: listId,
                  },
                },
              },
            },
          }),
        });
        const subscribeData = await subscribeResponse.json();
        if (subscribeResponse.ok) {
          return ApiResponse(
            `Contact successfully added and subscribed! Response: ${JSON.stringify(data)}`,
            200
          );
        }
        return ApiResponse(
          `Contact added but failed to subscribe. Error: ${JSON.stringify(
            subscribeData
          )} ${formatApiCallDetails({
            firstname,
            lastname,
            email,
            ip,
            listId,
          })}`,
          500
        );
      }
      return ApiResponse(
        `Failed to add the contact. Error: ${JSON.stringify(data)} ${formatApiCallDetails({
          firstname,
          lastname,
          email,
          ip,
          listId,
        })}`,
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
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
