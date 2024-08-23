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
    // gender,
    // countryCode,
    // salutation,
    // subscriptionMode,
    datanextFormId,
    datanextCampaignId,
    datanextAdditionalProps,
    datanextApiKey,
    datanextApiSecret,
  }: DatanextPostRequest = await request.json();
  let additionalPropsObj = {};
  async function forwardToNewsletterSystem() {
    try {
      try {
        if (datanextAdditionalProps) {
          additionalPropsObj = JSON.parse(datanextAdditionalProps.replace(/ /g, ''));
        }
      } catch (e) {
        return ApiResponse(
          `Failed to parse additional properties: ${formatApiCallDetails({
            firstname,
            lastname,
            email,
            datanextAdditionalProps,
          })}`,
          500
        );
      }
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
          datanextAdditionalProps,
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
            datanextAdditionalProps,
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
          formId: datanextFormId,
          campaignId: datanextCampaignId,
          formStep: 0,
          lead: {
            firstName: firstname,
            // prefixes: 'string',
            lastName: lastname,
            ...additionalPropsObj,
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
          datanextAdditionalProps,
        })}`,
        500
      );
    } catch (error) {
      return ApiResponse(
        `Failed to add the contact with an unknown error. Error: ${error} ${formatApiCallDetails({
          firstname,
          lastname,
          email,
          datanextAdditionalProps,
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
