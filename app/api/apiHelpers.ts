import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { APP_NAME, freeTierApiCalls } from '@/app/constants';

export default async function executeIfAuthenticated(
  request: NextRequest,
  functionToexecute: () => Promise<NextResponse>
) {
  const apiKey = request.headers.get('apiKey');
  if (apiKey) {
    const user = await prisma.user.findUnique({
      select: {
        apiCallsPerMonth: true,
        apiCallsInThisPeriod: true,
      },
      where: { apiKey },
    });

    if (user) {
      if (
        isStillQuotaLeft({
          apiCallsInThisPeriod: user.apiCallsInThisPeriod,
          apiCallsPerMonth: user.apiCallsPerMonth,
        })
      ) {
        const response = await functionToexecute();
        if (response.ok) {
          await bumpApiCallsInThisPeriod({
            apiKey,
            apiCallsInThisPeriod: user.apiCallsInThisPeriod,
          });
        }
        return response;
      }
      return ApiResponse(
        `Your ${APP_NAME} account doesnt have any api calls left for this period. Please upgade your account.`,
        403
      );
    }
    return ApiResponse(
      `The ${APP_NAME} Api key is not valid. Please check the ${APP_NAME} documentation.`,
      403
    );
  }
  return ApiResponse(
    `Please provide an ${APP_NAME} apiKey in the header. Please check the ${APP_NAME} documentation.`,
    403
  );
}

function isStillQuotaLeft({
  apiCallsPerMonth,
  apiCallsInThisPeriod,
}: {
  apiCallsPerMonth: number | null;
  apiCallsInThisPeriod: number;
}): boolean {
  const _apiCallsPerMonth = apiCallsPerMonth || freeTierApiCalls;
  const stillQuotaLeft = _apiCallsPerMonth >= apiCallsInThisPeriod;
  if (stillQuotaLeft) {
    return true;
  }
  return false;
}

async function bumpApiCallsInThisPeriod({
  apiKey,
  apiCallsInThisPeriod,
}: {
  apiKey: string;
  apiCallsInThisPeriod: number;
}) {
  await prisma.user.update({
    where: {
      apiKey,
    },
    data: {
      apiCallsInThisPeriod: parseInt(String(apiCallsInThisPeriod + 1)),
    },
  });
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
  listHash,
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
  listHash?: string;
}): string {
  return `- Contact:${firstname ? ` firstname: ${firstname}` : ''}${lastname ? ` lastname: ${lastname}` : ''}${email ? ` email: ${email}` : ''}${ip ? ` ip: ${ip}` : ''}${gender ? ` gender: ${gender}` : ''}${countryCode ? ` countryCode: ${countryCode}` : ''}${salutation ? ` salutation: ${salutation}` : ''}${tag ? ` tag: ${tag}` : ''}${tagId ? ` tagId: ${tagId}` : ''}${subscriptionMode ? ` subscriptionMode: ${subscriptionMode}` : ''}${listName ? ` listName: ${listName}` : ''}${listHash ? ` listHash: ${listHash}` : ''}${listId ? ` listId: ${listId}` : ''}`;
}

export async function handleResponse(response: Response): Promise<{
  jsonResponse: any;
  httpStatusCode: number;
}> {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}
