import { NextRequest, NextResponse } from 'next/server';
import executeIfAuthenticated from '../../_server/apiHelpers';
import type { AdobeCampaignPostRequest } from '../requestTypes';
import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

const authUrl = 'https://ims-na1.adobelogin.com/ims/token/v3';
const apiContactsUrl = 'https://mc.adobe.io/{ORGANIZATION}/campaign/profileAndServices/profile';
const subscribeUrl =
  'https://mc.adobe.io/{ORGANIZATION}/campaign//profileAndServices/service/{PKey}/subscriptions/';

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
    // tag,
    adobeCampaignOrganizationId,
    adobeCampaignClientId,
    adobeCampaignClientSecret,
    adobeCampaignApiKey,
    adobeCampaignListId,
  }: AdobeCampaignPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    let token: string = '';
    try {
      token = await getAccessToken({
        clientId: adobeCampaignClientId,
        clientSecret: adobeCampaignClientSecret,
      });
    } catch (error) {
      return ApiResponse(
        `Failed to get authetication token from adobe campaign. Error: ${error}`,
        403
      );
    }
    try {
      const { data, success } = await createContact({
        adobeCampaignOrganizationId,
        token,
        adobeCampaignApiKey,
        firstname,
        lastname,
        email,
      });
      if (success) {
        try {
          const { data: subscribeData, success: subscribeSuccess } = await subscribeContact({
            adobeCampaignOrganizationId,
            token,
            adobeCampaignApiKey,
            PKey: data.PKey,
            listId: adobeCampaignListId,
          });
          if (subscribeSuccess) {
            return ApiResponse(
              `Contact successfully added and subscribed! Response: ${JSON.stringify(subscribeData)}`,
              200
            );
          }
          return ApiResponse(
            `Contact added successfully but failed to subscribe to list. Error: ${JSON.stringify(subscribeData)} ${formatApiCallDetails(
              {
                firstname,
                lastname,
                email,
                adobeCampaignOrganizationId,
                adobeCampaignListId,
              }
            )}`,
            500
          );
        } catch (error) {
          return ApiResponse(
            `Contact added successfully but failed to subscribe to list with an unknown error. Error: ${error} ${formatApiCallDetails(
              {
                firstname,
                lastname,
                email,
                adobeCampaignOrganizationId,
                adobeCampaignListId,
              }
            )}`,
            500
          );
        }
      }
      return ApiResponse(
        `Failed to add the contact. Error: ${JSON.stringify(data)} ${formatApiCallDetails({
          firstname,
          lastname,
          email,
          adobeCampaignOrganizationId,
          adobeCampaignListId,
        })}`,
        500
      );
    } catch (error) {
      return ApiResponse(
        `Failed to add the contact with an unknown error. Error: ${error} ${formatApiCallDetails({
          firstname,
          lastname,
          email,
          adobeCampaignOrganizationId,
          adobeCampaignListId,
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}

async function subscribeContact({
  adobeCampaignOrganizationId,
  token,
  adobeCampaignApiKey,
  PKey,
  listId,
}: {
  adobeCampaignOrganizationId: string;
  token: string;
  adobeCampaignApiKey: string;
  PKey: string;
  listId: string;
}): Promise<{
  data: {};
  success: boolean;
}> {
  const response: Response = await fetch(
    subscribeUrl.replace('{ORGANIZATION}', adobeCampaignOrganizationId).replace('{PKey}', listId),
    {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        'X-Api-Key': adobeCampaignApiKey,
      },
      body: JSON.stringify({
        subscriber: {
          PKey,
        },
      }),
    }
  );
  const data = await response.json();
  return { data, success: response.ok };
}

async function createContact({
  adobeCampaignOrganizationId,
  token,
  adobeCampaignApiKey,
  firstname,
  lastname,
  email,
}: {
  adobeCampaignOrganizationId: string;
  token: string;
  adobeCampaignApiKey: string;
  firstname: string;
  lastname: string;
  email: string;
}): Promise<{
  data: { PKey: string; };
  success: boolean;
}> {
  const response: Response = await fetch(
    apiContactsUrl.replace('{ORGANIZATION}', adobeCampaignOrganizationId),
    {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        'X-Api-Key': adobeCampaignApiKey,
      },
      body: JSON.stringify({
        firstName: firstname,
        lastName: lastname,
        email,
      }),
    }
  );
  const data = await response.json();
  return { data, success: response.ok };
}

async function getAccessToken({
  clientId,
  clientSecret,
}: {
  clientId: string;
  clientSecret: string;
}): Promise<string> {
  const scopes =
    'AdobeID, openid, read_organizations, additional_info.projectedProductContext, additional_info.roles, adobeio_api, read_client_secret, manage_client_secrets';

  const formData = new URLSearchParams();
  formData.append('client_id', clientId);
  formData.append('client_secret', clientSecret);
  formData.append('grant_type', 'client_credentials');
  formData.append('scope', scopes);
  const response = await fetch(authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error('Something went wrong with getting the access token');
  }
  return data.access_token;
}
