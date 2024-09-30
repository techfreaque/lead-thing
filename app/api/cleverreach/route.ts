import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

import executeIfAuthenticated from '../../_server/apiHelpers';
import type { CleverreachPostRequest } from '../requestTypes';

const apiContactsUrl = 'https://rest.cleverreach.com/v3/groups.json/{group_id}/receivers';
const apiDOIMailUrl = 'https://rest.cleverreach.com/v3/forms.json/{form_id}/send/activate';
const oAuthUrl = 'https://rest.cleverreach.com/oauth/token.php';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    // ip,
    // countryCode,
    // salutation,
    subscriptionMode,
    cleverreachListId,
    cleverreachFormId,
    cleverreachSource,
    cleverreachClientId,
    cleverreachClientSecret,
  }: CleverreachPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    try {
      const authResponse = await fetch(oAuthUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${cleverreachClientId}:${cleverreachClientSecret}`
          ).toString('base64')}`,
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
        `Failed to get authentication token. Error: ${JSON.stringify(
          authData
        )} ${formatApiCallDetails({
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
    // return await subscribeToList(authToken);

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
            deactivated: '1',
            registered: String(Date.now() / 1000),
            email,
            ...(cleverreachSource ? { source: cleverreachSource } : {}),
            global_attributes: {
              firstname,
              lastname,
              // ...(gender ? { gender: gender.toLowerCase() } : {}),
            },
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        if (!cleverreachFormId) {
          return ApiResponse(
            `Contact successfully added and subscribed, BUT NO DOI MAIL WAS SENT! Response: ${JSON.stringify(
              data
            )}`,
            200
          );
        }
        return await subscribeToList(authToken);
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
  async function subscribeToList(authToken: string): Promise<NextResponse> {
    try {
      const response: Response = await fetch(
        apiDOIMailUrl.replace('{form_id}', cleverreachFormId),
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            email,
            doidata: {
              user_ip: '130.0.76.152',
              referer: 'leadthing.dev',
              user_agent: 'Linux',
            },
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        return ApiResponse(
          `Contact successfully added, subscribed and DOI mail sent! Response: ${JSON.stringify(
            data
          )}`,
          200
        );
      }
      return ApiResponse(
        `Contact added, but failed to send DOI mail. Error: ${JSON.stringify(
          data
        )} ${formatApiCallDetails({
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
        `Contact added, but failed to send DOI mail with an unknown error. Error: ${error} ${formatApiCallDetails(
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
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
