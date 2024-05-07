import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import type { EmarsysPostRequest } from '../requestTypes';
import executeIfAuthenticated from '../../_server/apiHelpers';
import { ApiResponse, formatApiCallDetails } from '@/app/_lib/apiHelpers';

const apiContactsUrl = 'https://{subDomain}.emarsys.net/api/v2/contact';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    firstname,
    lastname,
    email,
    listId,
    emarsysUserName,
    emarsysApiKey,
    emarsysSubDomain,
  }: EmarsysPostRequest = await request.json();
  async function forwardToNewsletterSystem() {
    try {
      const response: Response = await fetch(
        apiContactsUrl.replace('{subDomain}', emarsysSubDomain),
        {
          method: 'post',
          headers: {
            'X-WSSE': getWsseHeader(emarsysUserName, emarsysApiKey),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key_id: '3',
            contacts: [
              {
                1: firstname,
                2: lastname,
                3: email,
              },
            ],
            contact_list_id: listId,
          }),
        }
      );
      const data = await response.json();
      if (response.ok && !data?.data?.errors) {
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

function getWsseHeader(user: string, secret: string) {
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = new Date().toISOString();

  const digest = base64Sha1(nonce + timestamp + secret);

  return `UsernameToken Username="${user}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${timestamp}"`;
}

function base64Sha1(str: string) {
  const hexDigest = crypto.createHash('sha1').update(str).digest('hex');

  return Buffer.from(hexDigest).toString('base64');
}
