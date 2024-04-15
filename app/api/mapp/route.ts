import { NextRequest, NextResponse } from 'next/server';
import type { MappPostRequest } from '../requestTypes';
import executeIfAuthenticated, { ApiResponse, formatApiCallDetails } from '../apiHelpers';

const apiContactsPath = '/api/rest/v19/contact/create';
const apiSubscribePath = '/api/rest/v19/membership/subscribeByEmail';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    // ip,
    // gender,
    countryCode,
    // salutation,
    // tag,
    listId,
    subscriptionMode,
    mappUsername,
    mappPassword,
    mappDomain,
  }: MappPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${mappUsername}:${mappPassword}`)}`,
    };
    try {
      const contactPayload = {
        emailAddress: email,
        attributes: [
          { name: 'FirstName', value: firstname },
          { name: 'LastName', value: lastname },
          { name: 'user.ISOCountryCode', value: countryCode },
        ],
      };
      const response: Response = await fetch(`https://${mappDomain}${apiContactsPath}`, {
        method: 'post',
        headers,
        body: JSON.stringify(contactPayload),
      });
      const data = await response.json();
      if (response.ok) {
        const subscribeResponse: Response = await fetch(
          `https://${mappDomain}${apiSubscribePath}?email=${email}&groupId=${parseInt(String(listId))}&subscriptionMode=${subscriptionMode === 'FORCE_OPT_IN' ? 'CONFIRMED_OPT_IN' : subscriptionMode}`,
          {
            method: 'post',
            headers,
          }
        );
        if (subscribeResponse.ok) {
          return ApiResponse('Contact successfully added and subscribed!', 200);
        }
        return ApiResponse(
          `The contact was added to mapp, but subscribing to the list was not successful via the mapp api. Error: ${JSON.stringify(
            await subscribeResponse.json()
          )} ${formatApiCallDetails({ firstname, lastname, email, countryCode, listId })}`,
          500
        );
      }
      return ApiResponse(
        `Failed to update the contact via the mapp api. Error: ${JSON.stringify(
          data
        )} ${formatApiCallDetails({ firstname, lastname, email, countryCode, listId })}`,
        500
      );
    } catch (error) {
      return ApiResponse(
        `Failed to add the contact via the mapp api with an unknown error. Error: ${error} ${formatApiCallDetails(
          { firstname, lastname, email, countryCode, listId }
        )}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
