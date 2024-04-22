import { NextRequest, NextResponse } from 'next/server';
import executeIfAuthenticated from '../../_server/apiHelpers';
import type { SalesforcePostRequest } from '../requestTypes';
import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

const authPath = '.rest.marketingcloudapis.com/v2/token';
const apiContactsPath = '.rest.marketingcloudapis.com/contacts/v1/contacts';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    // ip,
    // gender,
    // countryCode,
    // salutation,
    listId,
    // subscriptionMode,
    // tag,
    salesforceSubDomain,
    salesforceClientId,
    salesforceClientSecret,
    salesforceAccountId,
  }: SalesforcePostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    let token: string = '';
    try {
      const response: Response = await fetch(`https://${salesforceSubDomain}${authPath}`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: salesforceClientId,
          client_secret: salesforceClientSecret,
          account_id: salesforceAccountId,
        }),
      });
      const authData = await response.json();
      token = authData.access_token;
    } catch (error) {
      return ApiResponse(`Failed to get authetication token from salesforce. Error: ${error}`, 500);
    }
    try {
      const response: Response = await fetch(`https://${salesforceSubDomain}${apiContactsPath}`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contactKey: email,
          attributeSets: [
            {
              name: 'Email Addresses',
              items: [
                {
                  values: [
                    {
                      name: 'Email Address',
                      value: email,
                    },
                    {
                      name: 'HTML Enabled',
                      value: true,
                    },
                  ],
                },
              ],
            },
            {
              name: 'Email Demographics',
              items: [
                {
                  values: [
                    {
                      name: 'First Name',
                      value: firstname,
                    },
                    {
                      name: 'Last Name',
                      value: lastname,
                    },
                  ],
                },
              ],
            },
            {
              name: 'GroupConnect LINE Subscriptions',
              items: [
                {
                  values: [
                    {
                      name: 'Channel ID',
                      value: String(listId),
                    },
                  ],
                },
              ],
            },
          ],
        }),
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
