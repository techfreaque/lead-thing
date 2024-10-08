import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

import executeIfAuthenticated from '../../_server/apiHelpers';
import type { MappPostRequest } from '../requestTypes';

const apiContactsPath = '/api/rest/v19/contact/create';
const apiContactsUpdatePath = '/api/rest/v19/contact/update?identifierType=EMAIL';
const apiSubscribePath = '/api/rest/v19/membership/subscribeByEmail';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    countryCode,
    gender,
    languageCode,
    listId,
    subscriptionMode,
    mappUsername,
    mappPassword,
    mappDomain,
    mappCustomAttributes,
  }: MappPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${mappUsername}:${mappPassword}`)}`,
    };
    try {
      let response = await createMappContact({
        mappCustomAttributes,
        email,
        firstname,
        lastname,
        countryCode,
        gender,
        languageCode,
        mappDomain,
        headers,
        updateContact: false,
      });
      if (!response.ok) {
        const updateResponse = await createMappContact({
          mappCustomAttributes,
          email,
          firstname,
          lastname,
          countryCode,
          gender,
          languageCode,
          mappDomain,
          headers,
          updateContact: true,
        });
        if (updateResponse.ok) {
          response = updateResponse;
        }
      }
      if (response.ok) {
        const subscribeResponse = await subscribeMappContact({
          mappDomain,
          email,
          listId,
          subscriptionMode,
          headers,
        });
        if (subscribeResponse.ok) {
          return ApiResponse(
            `Contact successfully added and subscribed! ${JSON.stringify(
              await subscribeResponse.text()
            )}`,
            200
          );
        }
        return ApiResponse(
          `The contact was added to mapp, but subscribing to the list was not successful via the mapp api. Error: ${JSON.stringify(
            await subscribeResponse.text()
          )} ${formatApiCallDetails({
            email,
            firstname,
            lastname,
            countryCode,
            gender,
            languageCode,
            listId,
            subscriptionMode,
            mappCustomAttributes,
            mappDomain,
          })}`,
          500
        );
      }
      return ApiResponse(
        `Failed to update the contact via the mapp api. Error: ${JSON.stringify(
          await response.text()
        )} ${formatApiCallDetails({
          email,
          firstname,
          lastname,
          countryCode,
          gender,
          languageCode,
          listId,
          subscriptionMode,
          mappCustomAttributes,
          mappDomain,
        })}`,
        500
      );
    } catch (error) {
      return ApiResponse(
        `Failed to add the contact via the mapp api with an unknown error. Error: ${error} ${formatApiCallDetails(
          {
            email,
            firstname,
            lastname,
            countryCode,
            gender,
            languageCode,
            listId,
            subscriptionMode,
            mappCustomAttributes,
            mappDomain,
          }
        )}`,
        500
      );
    }
  }

  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}

async function createMappContact({
  mappCustomAttributes,
  email,
  firstname,
  lastname,
  gender,
  languageCode,
  countryCode,
  mappDomain,
  headers,
  updateContact,
}: {
  mappCustomAttributes: string;
  email: string;
  firstname: string;
  lastname: string;
  countryCode?: string;
  gender?: string;
  languageCode?: string;
  mappDomain: string;
  headers: {
    Accept: string;
    'Content-Type': string;
    Authorization: string;
  };
  updateContact: boolean;
}): Promise<Response> {
  const rawAttributes =
    mappCustomAttributes && mappCustomAttributes?.replace(/, /g, ',').split(',');
  let attributes: { name: string; value: string }[] = [];
  if (rawAttributes) {
    attributes = rawAttributes.map((rawAttribute) => {
      const [attributeName, attributeValue] = rawAttribute.split('=');
      return { name: attributeName, value: attributeValue };
    });
  }
  const contactPayload = {
    emailAddress: email,
    attributes: [
      { name: 'FirstName', value: firstname },
      { name: 'LastName', value: lastname },
      { name: 'user.ISOCountryCode', value: countryCode },
      ...(languageCode ? [{ name: 'user.ISOLanguageCode', value: languageCode }] : []),
      ...(gender && ['MALE', 'FEMALE'].includes(gender)
        ? [
            {
              name: 'user.Title',
              value: gender === 'MALE' ? 1 : 2,
            },
            {
              name: 'user.Gender',
              value: gender === 'MALE' ? 1 : 2,
            },
          ]
        : []),
      ...attributes,
    ],
  };
  const response: Response = await fetch(
    `https://${mappDomain}${updateContact ? apiContactsUpdatePath : apiContactsPath}`,
    {
      method: 'post',
      headers,
      body: JSON.stringify(contactPayload),
    }
  );
  return response;
}

async function subscribeMappContact({
  mappDomain,
  email,
  listId,
  subscriptionMode,
  headers,
}: {
  mappDomain: string;
  email: string;
  listId: string;
  subscriptionMode: string;
  headers: {
    Accept: string;
    'Content-Type': string;
    Authorization: string;
  };
}): Promise<Response> {
  const subscribeResponse: Response = await fetch(
    `https://${mappDomain}${apiSubscribePath}?email=${email}&groupId=${parseInt(
      String(listId),
      10
    )}&subscriptionMode=${
      subscriptionMode === 'FORCE_OPT_IN' ? 'CONFIRMED_OPT_IN' : subscriptionMode
    }`,
    {
      method: 'post',
      headers,
    }
  );
  return subscribeResponse;
}

// async function getMappContact({
//   email,
//   mappDomain,
//   headers,
// }: {
//   email: string;
//   mappDomain: string;
//   headers: {
//     Accept: string;
//     'Content-Type': string;
//     Authorization: string;
//   };
// }): Promise<undefined> {
//   const response: Response = await fetch(`https://${mappDomain}/api/rest/v19/contact/get`, {
//     method: 'POST',
//     headers,
//     body: JSON.stringify({
//       type: 'EMAIL',
//       value: email,
//     }),
//   });
//   console.log(JSON.stringify(await response.json()));
//   return undefined;
// }
