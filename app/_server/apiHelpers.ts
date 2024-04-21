'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/_server/prisma';
import { APP_NAME } from '@/app/_lib/constants';
import { apiPeriodType, getCurrentSubscription } from './orders';
import sendQuotaWarningMail from './mail/sendQuotaWarningMail';
import sendNoQuotaLeftWarningMail from './mail/sendNoQuotaLeftWarningMail';
import { ApiResponse } from '../_lib/apiHelpers';

export default async function executeIfAuthenticated(
  request: NextRequest,
  functionToexecute: () => Promise<NextResponse>
) {
  const apiKey = request.headers.get('apiKey');
  if (apiKey) {
    const user = await prisma.user.findUnique({
      select: {
        email: true,
        name: true,
      },
      where: { apiKey },
    });

    if (user) {
      const currentApiPeriod = await getApiPeriodIfStillQuotaLeft({
        email: user.email, name: user.name,
      });
      if (currentApiPeriod) {
        const response = await functionToexecute();
        if (response.ok) {
          await bumpApiCallsInThisPeriod({ currentApiPeriod });
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

async function getApiPeriodIfStillQuotaLeft({
  name,
  email,
}: {
  name: string | null;
  email: string;
}): Promise<apiPeriodType | undefined> {
  const currentApiPeriod: apiPeriodType = await getCurrentSubscription({ email });
  if (currentApiPeriod.apiCallsInThisPeriod < currentApiPeriod.apiCallsPerMonth) {
    if (currentApiPeriod.apiCallsInThisPeriod === currentApiPeriod.apiCallsPerMonth - 1) {
      await sendNoQuotaLeftWarningMail(name, email);
    } else if (
      currentApiPeriod.apiCallsInThisPeriod + 1
      === Math.floor(currentApiPeriod.apiCallsPerMonth * 0.8)
    ) {
      await sendQuotaWarningMail(name, email);
    }
    return currentApiPeriod;
  }
  return undefined;
}

async function bumpApiCallsInThisPeriod({
  currentApiPeriod,
}: {
  currentApiPeriod: apiPeriodType;
}) {
  await prisma.apiPeriods.update({
    where: {
      id: currentApiPeriod.id,
    },
    data: {
      apiCallsInThisPeriod: parseInt(String(currentApiPeriod.apiCallsInThisPeriod + 1), 10),
    },
  });
}