import { NextRequest, NextResponse } from 'next/server';
import type { CleverreachPostRequest } from '../requestTypes';
import executeIfAuthenticated from '../../_server/apiHelpers';
import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

const apiContactsUrl = 'https://rest.cleverreach.com/groups/{group_id}/receivers';
const oAuthUrl = 'https://rest.cleverreach.com/oauth/token.php';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    // ip,
    gender,
    // countryCode,
    // salutation,
    subscriptionMode,
    cleverreachListId,
    cleverreachSource,
    cleverreachClientId,
    cleverreachClientSecret,
  }: CleverreachPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    try {
      const authResponse = await fetch(oAuthUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${cleverreachClientId}:${cleverreachClientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
        }),
      });
      const authData = await authResponse.json();
      if (authResponse.ok) {
        return await createLead(authData.access_token);
      }
      return ApiResponse(
        `Failed to get authentication token. Error: ${JSON.stringify(authData)} ${formatApiCallDetails(
          {
            firstname,
            lastname,
            email,
            subscriptionMode,
            cleverreachListId,
            cleverreachSource,
          }
        )}`,
        500
      );
    } catch (error) {
      return ApiResponse(
        `Failed to get authentication token. Error: ${JSON.stringify(error)} ${formatApiCallDetails(
          {
            firstname,
            lastname,
            email,
            subscriptionMode,
            cleverreachListId,
            cleverreachSource,
          }
        )}`,
        500
      );
    }
  }
  async function createLead(authToken: string): Promise<NextResponse> {
    try {
      const response: Response = await fetch(
        apiContactsUrl.replace('{group_id}', cleverreachListId),
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            email,
            ...(cleverreachSource ? { source: cleverreachSource } : {}),
            global_attributes: {
              firstname,
              lastname,
              ...(gender ? { gender: gender.toLowerCase() } : {}),
            },
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
          subscriptionMode,
          cleverreachListId,
          cleverreachSource,
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
          cleverreachListId,
          cleverreachSource,
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
