import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { APP_NAME, subscriptionTiers } from '@/app/constants';

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
  const _apiCallsPerMonth = apiCallsPerMonth || subscriptionTiers.free.apiCalls;
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

export function formatApiCallDetails(fields: { [key: string]: string | undefined; }): string {
  const data = (Object.entries(fields) as [string, string][])
    .filter(([, value]) => value).map(([name, value]) =>
      ` ${name}: ${value}`
    );
  return `- Contact:${data}`;
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
