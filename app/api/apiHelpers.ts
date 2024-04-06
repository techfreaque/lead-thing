import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { APP_NAME } from '@/app/constants';

export default async function executeIfAuthenticated(
  request: NextRequest,
  functionToexecute: () => Promise<NextResponse>
) {
  const apiKey = request.headers.get('apiKey');
  if (apiKey) {
    let user = await prisma.user.findUnique({
      select: { apiKeyValidUntil: true },
      where: { apiKey },
    });

    if (user) {
      if (isApiKeyStillValid(user.apiKeyValidUntil)) {
        return await functionToexecute();
      } else {
        return ApiResponse(
          `Your ${APP_NAME} API key is expired, please renew your subscription. Your key expired on ${user.apiKeyValidUntil}`,
          403
        );
      }
    } else {
      return ApiResponse(
        `The ${APP_NAME} Api key is not valid. Please check the ${APP_NAME} documentation.`,
        403
      );
    }
  } else {
    return ApiResponse(
      `Please provide an ${APP_NAME} apiKey in the header. Please check the ${APP_NAME} documentation.`,
      403
    );
  }
}

function isApiKeyStillValid(apiKeyValidUntil: Date) {
  return new Date(apiKeyValidUntil.toDateString()) > new Date(new Date().toDateString());
}

export function ApiResponse(message: string, status: number = 200): NextResponse {
  return new NextResponse(message, {
    status,
  });
}

export function formatApiCallDetails({
  firstname,
  lastname,
  email,
  ip,
  gender,
  countryCode,
  salutation,
  tag,
  tagId,
  subscriptionMode,
  listId,
  listName,
}: {
  firstname?: string;
  lastname?: string;
  email?: string;
  ip?: string;
  gender?: string;
  countryCode?: string;
  salutation?: string;
  tag?: string;
  tagId?: string;
  subscriptionMode?: string;
  listName?: string;
  listId?: number | string;
}): string {
  return `- Contact:${firstname ? ' firstname: ' + firstname : ''}${lastname ? ' lastname: ' + lastname : ''}${email ? ' email: ' + email : ''}${ip ? ' ip: ' + ip : ''}${gender ? ' gender: ' + gender : ''}${countryCode ? ' countryCode: ' + countryCode : ''}${salutation ? ' salutation: ' + salutation : ''}${tag ? ' tag: ' + tag : ''}${tagId ? ' tagId: ' + tagId : ''}${subscriptionMode ? ' subscriptionMode: ' + subscriptionMode : ''}${listName ? ' listName: ' + listName : ''}${listId ? ' listId: ' + listId : ''}`;
}
