import { NextRequest, NextResponse } from 'next/server';
import sha1 from 'crypto-js/sha1';
import type { YouleadPostRequest } from '../requestTypes';
import executeIfAuthenticated from '../../_server/apiHelpers';
import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

const apiContactsUrl = 'https://a-pd.youlead.pl/api/Command/Contact/UpsertsByEmail';

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
    youLeadTag,
    youLeadAppId,
    youLeadClientId,
    youLeadAppSecretKey,
  }: YouleadPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    try {
      const requestTimestamp = Math.round(Date.now() / 1000);
      const requestSha = sha1(
        `${youLeadClientId}${youLeadAppId}${youLeadAppSecretKey}${requestTimestamp}`
      ).toString();
      const response: Response = await fetch(apiContactsUrl, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'YL-TimeStamp': String(requestTimestamp),
          'YL-AppId': youLeadAppId,
          'YL-ClientId': youLeadClientId,
          'YL-Signature': requestSha,
        },
        body: JSON.stringify({
          contacts: [
            {
              requestId: 1,
              emailKey: email,
              data: {
                name: firstname,
                lastName: lastname,
                email,
              },
              statusEmail: subscriptionMode === 'FORCE_OPT_IN' ? 3 : 2,
              ...(youLeadTag && {
                tagsWithScoring: [
                  {
                    name: youLeadTag,
                    score: 2,
                  },
                ],
              }),
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
          subscriptionMode,
          youLeadTag,
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
          youLeadTag,
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
