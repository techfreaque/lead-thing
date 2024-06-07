import { createHmac } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import OAuth from 'oauth-1.0a';

import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

import executeIfAuthenticated from '../../_server/apiHelpers';
import type { SpotlerPlusPostRequest } from '../requestTypes';

const apiContactsUrl = 'https://restapi.mailplus.nl/integrationservice/contact';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    gender,
    spotlerConsumerKey,
    spotlerConsumerSecret,
    spotlerAdditionalProperties,
  }: SpotlerPlusPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    try {
      return await createLead();
    } catch (error) {
      return ApiResponse(
        `Failed to get authentication token. Error: ${JSON.stringify(error)} ${formatApiCallDetails(
          {
            firstname,
            lastname,
            email,
            gender,
          }
        )}`,
        500
      );
    }
  }
  async function createLead(): Promise<NextResponse> {
    try {
      let additionalProperties = {};
      try {
        if (spotlerAdditionalProperties) {
          additionalProperties = JSON.parse(`{${spotlerAdditionalProperties.replace(/ /g, '')}}`);
        }
      } catch (e) {
        throw new Error('Failed to parse additional properties');
      }
      const body = {
        update: true,
        contact: {
          externalId: email,
          properties: {
            email,
            firstName: firstname,
            lastName: lastname,
            ...(gender ? { gender } : {}),
            ...additionalProperties,
          },
          channels: [
            {
              name: 'EMAIL',
              value: true,
            },
          ],
        },
      };
      const response: Response = await makeOAuthPostRequest(
        apiContactsUrl,
        spotlerConsumerKey,
        spotlerConsumerSecret,
        body
      );
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
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}

type PostBody = {
  update: boolean;
  contact: {
    externalId: string;
    properties: {
      gender?: 'MALE' | 'FEMALE' | undefined;
      email: string;
      firstName: string;
      lastName: string;
    };
    channels: {
      name: string;
      value: boolean;
    }[];
  };
};

async function makeOAuthPostRequest(
  url: string,
  consumerKey: string,
  consumerSecret: string,
  postParams: PostBody
) {
  const oauth = new OAuth({
    consumer: { key: consumerKey, secret: consumerSecret },
    signature_method: 'HMAC-SHA1',
    hash_function(baseString, key) {
      return createHmac('sha1', key).update(baseString).digest('base64');
    },
  });

  const requestData = {
    url,
    method: 'POST',
    data: undefined,
  };

  const headers = {
    ...oauth.toHeader(oauth.authorize(requestData)),
    'content-type': 'application/json',
    accept: 'application/json',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(postParams),
  });

  return response;
}
