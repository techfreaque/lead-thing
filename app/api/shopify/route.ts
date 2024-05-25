import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse, formatApiCallDetails } from '../../_lib/apiHelpers';
import executeIfAuthenticated from '../../_server/apiHelpers';
import type { ShopifyPostRequest } from '../requestTypes';

const apiContactsUrl = 'https://{domain}/admin/api/2024-04/graphql.json';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    countryCode,
    tag,
    shopifyDomain,
    shopifyAccessToken,
  }: ShopifyPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    try {
      const response: Response = await fetch(apiContactsUrl.replace('{domain}', shopifyDomain), {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifyAccessToken,
        },
        method: 'POST',
        body: JSON.stringify({
          query: `mutation customerCreate($input: CustomerInput!) {
            customerCreate(input: $input) {
              userErrors {
                field
                message
              }
              customer {
                email
                firstName
                lastName
                emailMarketingConsent {
                  marketingState
                  marketingOptInLevel
                }
                addresses {
                  firstName
                  lastName
                  country
                }
              }
            }
          }`,
          variables: {
            input: {
              email,
              firstName: firstname,
              lastName: lastname,
              emailMarketingConsent: {
                // Shopify only supports single opt in as it doesnt send the DOI mail :/
                marketingOptInLevel: 'SINGLE_OPT_IN',
                marketingState: 'SUBSCRIBED',
              },
              ...(tag ? { tags: [tag] } : {}),
              addresses: [
                {
                  firstName: firstname,
                  lastName: lastname,
                  ...(countryCode ? { country: countryCode } : {}),
                },
              ],
            },
          },
        }),
      });
      const data = await response.json();
      if (response.ok && !data?.errors?.length && !data?.data?.customerCreate?.userErrors) {
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
          countryCode,
          tag,
        })}`,
        500
      );
    } catch (error) {
      return ApiResponse(
        `Failed to add the contact with an unknown error. Error: ${error} ${formatApiCallDetails({
          firstname,
          lastname,
          email,
          countryCode,
          tag,
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
