import { NextRequest, NextResponse } from 'next/server';
import MD5 from 'crypto-js/md5';
import type { SailthruPostRequest } from '../requestTypes';
import executeIfAuthenticated from '../../_server/apiHelpers';
import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

const apiContactsPath = 'https://api.sailthru.com/user';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    // ip,
    // gender,
    // countryCode,
    // salutation,
    listName,
    // subscriptionMode,
    // tag,
    sailthruApiKey,
    sailthruSecret,
  }: SailthruPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    const headers = {};
    try {
      const requestPayload = JSON.stringify({
        id: email,
        lists: {
          [listName]: 1,
        },
        vars: {
          FirstName: firstname,
          LastName: lastname,
        },
      });
      const requestMd5 = MD5(`${sailthruSecret + sailthruApiKey}json${requestPayload}`).toString();
      const response: Response = await fetch(apiContactsPath, {
        method: 'post',
        headers,
        body: `api_key=${sailthruApiKey}&sig=${requestMd5}&format=json&json=${requestPayload}`,
      });
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
          listName,
        })}`,
        500
      );
    } catch (error) {
      return ApiResponse(
        `Failed to add the contact with an unknown error. Error: ${error} ${formatApiCallDetails({
          firstname,
          lastname,
          email,
          listName,
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
