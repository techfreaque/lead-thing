import sha1 from 'crypto-js/sha1';
import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

import executeIfAuthenticated from '../../_server/apiHelpers';
import type { FreshmailPostRequest } from '../requestTypes';

const apiContactsUrl = 'https://api.freshmail.com/rest/subscriber/add';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
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
        `${freshmailApiKey}${apiContactsUrl}${requestPayload}${freshmailApiSecret}`
      ).toString();
      const response: Response = await fetch(apiContactsUrl, {
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
          firstname,
          lastname,
          email,
          subscriptionMode,
          listHash,
        })}`,
        500
      );
    } catch (error) {
      return ApiResponse(
        `Failed to add the contact with an unknown error. Error: ${error} ${formatApiCallDetails({
          firstname,
          lastname,
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
