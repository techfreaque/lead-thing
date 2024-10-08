import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

import executeIfAuthenticated from '../../_server/apiHelpers';
import type { SalesforcePostRequest } from '../requestTypes';

const authPath = '.auth.marketingcloudapis.com/v2/token';
const apiContactsPath = '.rest.marketingcloudapis.com/contacts/v1/contacts';
// const apiGetContactsPath = '.rest.marketingcloudapis.com/contacts/v1/contacts/key:{contactKey}';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    // ip,
    // gender,
    // countryCode,
    // salutation,
    listId,
    // subscriptionMode,
    // tag,
    salesforceSubDomain,
    salesforceClientId,
    salesforceClientSecret,
    salesforceAccountId,
  }: SalesforcePostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    let token: string = '';
    try {
      const response: Response = await fetch(`https://${salesforceSubDomain}${authPath}`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: salesforceClientId,
          client_secret: salesforceClientSecret,
          account_id: salesforceAccountId,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        return ApiResponse(
          `Failed to get authentication token from Salesforce. Status: ${response.status} - ${errorDetails}`,
          500
        );
      }

      const authData = await response.json();
      token = authData.access_token;
    } catch (error) {
      return ApiResponse(
        `Failed to get authentication token from Salesforce. Error: ${error}`,
        500
      );
    }
    try {
      const response: Response = await fetch(`https://${salesforceSubDomain}${apiContactsPath}`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contactKey: email,
          attributeSets: [
            {
              name: 'Email Addresses',
              items: [
                {
                  values: [
                    {
                      name: 'Email Address',
                      value: email,
                    },
                    {
                      name: 'HTML Enabled',
                      value: true,
                    },
                  ],
                },
              ],
            },
            {
              name: 'Account_Salesforce',
              items: [
                {
                  values: [
                    {
                      name: 'FirstName',
                      value: firstname,
                    },
                    {
                      name: 'LastName',
                      value: lastname,
                    },
                  ],
                },
              ],
            },
            {
              name: 'Contact_Salesforce',
              items: [
                {
                  values: [
                    {
                      name: 'FirstName',
                      value: firstname,
                    },
                    {
                      name: 'LastName',
                      value: lastname,
                    },
                  ],
                },
              ],
            },
            {
              name: 'User_Salesforce',
              items: [
                {
                  values: [
                    {
                      name: 'FirstName',
                      value: firstname,
                    },
                    {
                      name: 'LastName',
                      value: lastname,
                    },
                  ],
                },
              ],
            },
            {
              name: 'GroupConnect LINE Addresses',
              items: [
                {
                  values: [
                    {
                      name: 'Address ID',
                      value: 'addressId_from_api',
                    },
                    {
                      name: 'Created Date',
                      value: new Date().toISOString(), // Correct date format
                    },
                    {
                      name: 'Modified Date',
                      value: new Date().toISOString(), // Correct date format
                    },
                  ],
                },
              ],
            },
            {
              name: 'GroupConnect LINE Subscriptions',
              items: [
                {
                  values: [
                    {
                      name: 'Channel ID',
                      value: String(listId),
                    },
                    {
                      name: 'Address ID',
                      value: 'addressId_from_api',
                    },
                    {
                      name: 'Is Subscribed',
                      value: true, // or false depending on the subscription status
                    },
                    {
                      name: 'Created Date',
                      value: new Date().toISOString(), // Correct date format
                    },
                    {
                      name: 'Modified Date',
                      value: new Date().toISOString(), // Correct date format
                    },
                  ],
                },
              ],
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
          listId,
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
        })}`,
        500
      );
    }
  }
  return executeIfAuthenticated(request, forwardToNewsletterSystem);
}

// async function getContact(salesforceSubDomain: string, token: string, email: string) {
//   try {
//     const response: Response = await fetch(
//       `https://${salesforceSubDomain}${apiGetContactsPath.replace('{contactKey}', email)}`,
//       {
//         method: 'get',
//         headers: {
//           Accept: 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const data = await response.json();
//     if (response.ok) {
//       return ApiResponse(`Contact retrieved successfully! Response: ${JSON.stringify(data)}`, 200);
//     }
//     return ApiResponse(`Failed to retrieve the contact. Error: ${JSON.stringify(data)}`, 500);
//   } catch (error) {
//     return ApiResponse(
//       `Failed to retrieve the contact with an unknown error. Error: ${error}`,
//       500
//     );
//   }
// }

// async function getDataExtensionAttributes(salesforceSubDomain: string, token: string) {
//   try {
//     const response = await fetch(
//       `https://${salesforceSubDomain}.rest.marketingcloudapis.com/contacts/v1/attributeSetDefinitions`,
//       {
//         method: 'get',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     if (!response.ok) {
//       throw new Error(`Failed to retrieve schema. Status: ${response.status}`);
//     }
//     const data = await response.json();
//     return ApiResponse(JSON.stringify(data), 200);
//   } catch (error) {
//     console.error(`Error fetching attributes: ${error}`);
//     return ApiResponse(JSON.stringify(error), 500);
//   }
// }

// async function getListIds(salesforceSubDomain: string, token: string) {
//   try {
//     const soapRequest = `
//     <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://exacttarget.com/wsdl/partnerAPI">
//        <soapenv:Header>
//           <ns:fueloauth>${token}</ns:fueloauth>
//        </soapenv:Header>
//        <soapenv:Body>
//           <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
//              <RetrieveRequest>
//                 <ObjectType>DataExtensionObject[GroupConnectLineSubscriptions]</ObjectType>
//                 <Properties>Id</Properties>
//                 <Properties>Name</Properties>
//                 <Properties>Status</Properties>
//                 <Filter xsi:type="SimpleFilterPart" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
//                    <Property>Status</Property>
//                    <SimpleOperator>equals</SimpleOperator>
//                    <Value>Active</Value>
//                 </Filter>
//              </RetrieveRequest>
//           </RetrieveRequestMsg>
//        </soapenv:Body>
//     </soapenv:Envelope>`;
//     const response = await fetch(
//       `${'https://mcbtwqkzn5n9d7zf-9bskyk361k8.soap.marketingcloudapis.com'}/Service.asmx`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'text/xml',
//           SOAPAction: 'Retrieve',
//         },
//         body: soapRequest,
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const responseText = await response.text();
//     console.log('SOAP Response:', responseText);
//     return ApiResponse(JSON.stringify(responseText), 200);
//   } catch (error) {
//     console.error('Failed to retrieve active channels:', error);
//     return ApiResponse(JSON.stringify(error), 500);
//   }
// }
