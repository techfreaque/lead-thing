import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

import executeIfAuthenticated from '../../_server/apiHelpers';
import type { ExpertsenderPostRequest } from '../requestTypes';

const apiContactsUrl = 'https://{domain}/v2/Api/Subscribers/';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    ip,
    // countryCode,
    // salutation,
    listId,
    expertSenderVendor,
    expertSenderApiDomain,
    expertSenderApiKey,
  }: ExpertsenderPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    try {
      const response: Response = await fetch(
        apiContactsUrl.replace('{domain}', expertSenderApiDomain),
        {
          method: 'post',
          headers: {
            'Accept-Encoding': 'gzip,deflate',
            'Content-Type': 'text/xml',
            'User-Agent': 'Jakarta Commons-HttpClient/3.1',
          },
          body: `<?xml version="1.0" encoding="UTF-8"?>
        <ApiRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema">
            <ApiKey>${expertSenderApiKey}</ApiKey>
            <Data xsi:type="Subscriber">
               <Mode>AddAndUpdate</Mode>
               <Force>true</Force>
               <ListId>${listId}</ListId>
               <Email>${email}</Email>
               <Firstname>${firstname}</Firstname>
               <Lastname>${lastname}</Lastname>
               ${expertSenderVendor ? `<Vendor>${expertSenderVendor}</Vendor>` : ''}
               ${expertSenderVendor ? `<Ip>${ip}</Ip>` : ''}
            </Data>
        </ApiRequest>
        `,
          // might TODO later:
          // <Data xsi:type="Subscriber">
          // <Properties>
          //  <Property>
          //    <Id>2</Id>
          //      <Value xsi:type="xs:string">student</Value>
          //  </Property>
          //  <Property>
          //    <Id>3</Id>
          //      <Value xsi:type="xs:dateTime">1985-03-12</Value>
          //  </Property>
          // </Properties>
          // <TrackingCode>123</TrackingCode>
        }
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
          listId,
          ip,
        })}`,
        500
      );
    } catch (error) {
      return ApiResponse(
        `Failed to add the contact with an unknown error. Error: ${error} ${formatApiCallDetails({
          firstname,
          lastname,
          email,
          listId,
          ip,
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}
