import MD5 from 'crypto-js/md5';
import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

import executeIfAuthenticated from '../../_server/apiHelpers';
import type { SailthruPostRequest } from '../requestTypes';

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
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
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
      const requestBody = new URLSearchParams();
      requestBody.append('api_key', sailthruApiKey);
      requestBody.append('sig', requestMd5);
      requestBody.append('format', 'json');
      requestBody.append('json', requestPayload);
      const response: Response = await fetch(apiContactsPath, {
        method: 'post',
        headers,
        body: requestBody.toString(),
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
