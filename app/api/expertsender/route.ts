import { NextRequest, NextResponse } from 'next/server';
import type { ExpertsenderPostRequest } from '../requestTypes';
import executeIfAuthenticated from '../../_server/apiHelpers';
import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

const apiContactsPath = 'https://api.ecdp.app/customers';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    // ip,
    gender,
    // countryCode,
    // salutation,
    listId,
    subscriptionMode,
    expertSenderApiKey,
  }: ExpertsenderPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    try {
      const response: Response = await fetch(apiContactsPath, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': expertSenderApiKey,
        },
        body: JSON.stringify({
          mode: 'Add',
          matchBy: 'Email',
          data: [
            {
              email,
              firstName: firstname,
              lastName: lastname,
              ...(['MALE', 'FEMALE'].includes(gender) && {
                gender: gender === 'MALE' ? 'Male' : 'Female',
              }),
              consentsData: {
                consents: [
                  {
                    id: parseInt(listId, 10),
                    value: subscriptionMode === 'DOUBLE_OPT_IN' ? 'AwaitingConfirmation' : 'True',
                  },
                ],
                // force: true,
                // confirmationMessageId: 0,
              },
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
          gender,
          listId,
          subscriptionMode,
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
          listId,
          subscriptionMode,
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
