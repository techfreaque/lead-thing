import sha1 from 'crypto-js/sha1';
import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

import executeIfAuthenticated from '../../_server/apiHelpers';
import type { FreshmailPostRequest } from '../requestTypes';

const apiUrl = 'https://api.freshmail.com';
const apiContactsPath = '/rest/subscriber/add';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    email,
    // ip,
    // gender,
    // countryCode,
    // salutation,
    subscriptionMode,
    // tag,
    listHash,
    freshmailApiKey,
    freshmailApiSecret,
  }: FreshmailPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    try {
      const requestPayload = JSON.stringify({
        email,
        list: listHash,
        state: subscriptionMode === 'FORCE_OPT_IN' ? 1 : 2,
      });
      const requestSha = sha1(
        `${freshmailApiKey}${apiContactsPath}${requestPayload}${freshmailApiSecret}`
      ).toString();
      const response: Response = await fetch(apiUrl + apiContactsPath, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Rest-ApiKey': freshmailApiKey,
          'X-Rest-ApiSign': requestSha,
        },
        body: requestPayload,
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
          email,
          subscriptionMode,
          listHash,
        })}`,
        500
      );
    } catch (error) {
      return ApiResponse(
        `Failed to add the contact with an unknown error. Error: ${error} ${formatApiCallDetails({
          email,
          subscriptionMode,
          listHash,
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}

// async function getSubscribers(
//   listHash: string,
//   email: string,
//   freshmailApiKey: string,
//   freshmailApiSecret: string
// ) {
//   const getPath = `/rest/subscriber/get/${listHash}/${email}`;
//   const t = JSON.stringify({});
//   const requestSha = sha1(
//     `${freshmailApiKey}${apiContactsPath}${t}${freshmailApiSecret}`
//   ).toString();
//   const response: Response = await fetch(apiUrl + getPath, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-Rest-ApiKey': freshmailApiKey,
//       'X-Rest-ApiSign': requestSha,
//       body: t,
//     },
//   });
//   const data = await response.json();
//   return data;
// }
