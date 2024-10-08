import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

import executeIfAuthenticated from '../../_server/apiHelpers';
import type { AcumbamailPostRequest } from '../requestTypes';

const apiContactsUrl = 'https://acumbamail.com/api/1/addSubscriber/';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    listId,
    acumbamailApiKey,
    subscriptionMode,
  }: AcumbamailPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    try {
      const doubleOptin = subscriptionMode === 'DOUBLE_OPT_IN' ? '1' : '0';
      const welcomeEmail = '1';

      const payload = new URLSearchParams();
      payload.append('auth_token', acumbamailApiKey);
      payload.append('response_type', 'json');
      payload.append('list_id', listId);
      payload.append('double_optin', doubleOptin);
      payload.append('welcome_email', welcomeEmail);

      const mergeFields = {
        email,
        nombre: `${firstname} ${lastname}`,
      };

      for (const [key, value] of Object.entries(mergeFields)) {
        payload.append(`merge_fields[${key}]`, value);
      }

      const response: Response = await fetch(apiContactsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload.toString(),
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
          listId,
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
