import { NextRequest, NextResponse } from 'next/server';
import type { EdronePostRequest } from '../requestTypes';
import executeIfAuthenticated from '../../_server/apiHelpers';
import { ApiResponse, formatApiCallDetails } from '../../_lib/apiHelpers';

const apiContactsUrl = 'https://api.edrone.me/trace';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { firstname, lastname, email, gender, countryCode, edroneAppId }: EdronePostRequest =
    await request.json();
  async function forwardToNewsletterSystem() {
    try {
      const edroneData = new URLSearchParams();
      edroneData.append('version', '1.0.0');
      edroneData.append('app_id', edroneAppId);
      edroneData.append('email', email);
      edroneData.append('first_name', firstname);
      edroneData.append('last_name', lastname);
      countryCode && edroneData.append('country', countryCode);
      gender &&
        ['MALE', 'FEMALE'].includes(gender) &&
        edroneData.append('country', gender === 'MALE' ? 'm' : 'f');
      edroneData.append('subscriber_status', '1');
      edroneData.append('action_type', 'subscribe');
      edroneData.append('sender_type', 'server');

      const response: Response = await fetch(apiContactsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: edroneData.toString(),
      });
      const data = await response.text();
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
          gender,
          countryCode,
        })}`,
        500
      );
    } catch (error) {
      return ApiResponse(
        `Failed to add the contact with an unknown error. Error: ${error} ${formatApiCallDetails({
          firstname,
          lastname,
          email,
          gender,
          countryCode,
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
