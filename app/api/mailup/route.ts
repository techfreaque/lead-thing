import { NextRequest, NextResponse } from 'next/server';
import type { MailupPostRequest } from '../requestTypes';
import executeIfAuthenticated from '../../_server/apiHelpers';
import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

const apiContactsUrl =
  'https://services.mailup.com/API/v1.1/Rest/ConsoleService.svc/Console/List/{list_id}/Recipient';
const oAuthUrl = 'https://services.mailup.com/Authorization/OAuth/Token';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    // ip,
    // countryCode,
    // salutation,
    gender,
    subscriptionMode,
    mailupListId,
    mailupClientId,
    mailupClientSecret,
    mailupUsername,
    mailupPassword,
  }: MailupPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    try {
      const authResponse = await fetch(oAuthUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${mailupClientId}:${mailupClientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=password&username=${mailupUsername}&password=${mailupPassword}`,
      });
      const authDataRaw = await authResponse.text();
      if (authResponse.ok) {
        const authData = JSON.parse(authDataRaw);
        return await createLead(authData.access_token);
      }
      return ApiResponse(
        `Failed to get authentication token. Error: ${JSON.stringify(authDataRaw)} ${formatApiCallDetails(
          {
            firstname,
            lastname,
            email,
            subscriptionMode,
            mailupListId,
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
            mailupListId,
          }
        )}`,
        500
      );
    }
  }
  async function createLead(authToken: string): Promise<NextResponse> {
    try {
      const response: Response = await fetch(
        `${apiContactsUrl.replace('{list_id}', mailupListId)}?ConfirmEmail=${subscriptionMode === 'FORCE_OPT_IN'}`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            Name: `${firstname} ${lastname}`,
            Email: email,
            Fields: [
              {
                Description: 'FirstName',
                Id: 1,
                Value: firstname,
              },
              {
                Description: 'LastName',
                Id: 2,
                Value: lastname,
              },
              ...(gender
                ? [
                    {
                      Description: 'Gender',
                      Id: 10,
                      Value: gender,
                    },
                  ]
                : []),
            ],
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
          mailupListId,
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
          mailupListId,
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
