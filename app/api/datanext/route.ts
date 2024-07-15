import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

import executeIfAuthenticated from '../../_server/apiHelpers';
import type { DatanextPostRequest } from '../requestTypes';

const apiContactsUrl = 'https://dpn-api-core.datanext.nl/api/subscription';
const oAuthUrl = 'https://dpn-api-core.datanext.nl/api/authorization/';

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
    datanextApiKey,
    datanextApiSecret,
  }: DatanextPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    try {
      const authResponse = await fetch(oAuthUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${datanextApiKey}:${datanextApiSecret}`).toString(
            'base64'
          )}`,
        },
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
          }
        )}`,
        500
      );
    }
  }
  async function createLead(authToken: string): Promise<NextResponse> {
    try {
      const response: Response = await fetch(apiContactsUrl, {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          formId: '0b572bf0-a013-490f-82cd-9605aa75b459',
          campaignId: '4ec9ab6b-d282-4b84-944f-87da1f66b01c',
          formStep: 0,
          lead: {
            firstName: firstname,
            // prefixes: 'string',
            lastName: lastname,
            // birthDate: '2024-07-02T14:22:35.196Z',
          },
          consentData: {
            cof: {
              serviceName: 'string',
              serviceId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              serviceTimestamp: '2024-07-02T14:22:35.196Z',
              question: 'string',
              type: 'string',
              processingActivityId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              sourceSystemId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              rootEventTimestamp: '2024-07-02T14:22:35.196Z',
              consentQuestions: [
                {
                  consentQuestionId: 'a44f5f5e-cb6d-455c-a761-ef2ab4d73aa3',
                  offeringId: '6bae9e33-048f-409b-a049-e5caff4e2e39',
                },
              ],
            },
          },
          contact: {
            email,
          },
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
