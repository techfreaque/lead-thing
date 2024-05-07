'use server';

import getConfig from 'next/config';
import { subscriptionTierIdType, subscriptionTierType, subscriptionTiers } from '../_lib/constants';
import { generateAccessToken, getAuthAssertionValue } from './paypal/generateAccessToken';
import { prisma } from './prisma';

const { serverRuntimeConfig } = getConfig();

export interface UnpaidOrderType {
  transactionId: string;
  subscriptionId: null;
  email: string;
  createdAt: Date;
  payedAt: null;
  validUntil: null;
  paymentStatus: 'unpaid';
  productId: subscriptionTierIdType;
  amount: number;
}

export interface PaidOrderType {
  transactionId: string;
  subscriptionId: string;
  email: string;
  createdAt: Date;
  payedAt: Date;
  validUntil: Date;
  paymentStatus: 'paid';
  productId: subscriptionTierIdType;
  amount: number;
}

export interface apiPeriodType {
  id: string;
  orderId: string;
  email: string;
  createdAt: Date;
  validFrom: Date;
  validUntil: Date;
  productId: subscriptionTierIdType;
  apiCallsPerMonth: number;
  apiCallsInThisPeriod: number;
}

export async function createOrder(
  email: string,
  productId: subscriptionTierIdType,
  amount: number
): Promise<UnpaidOrderType> {
  const order = await prisma.orders.create({
    data: {
      email,
      productId,
      amount,
    },
  });
  return order as UnpaidOrderType;
}

export async function updateToPaypalOrderId({
  email,
  createdOrderId,
  subscriptionId,
}: {
  email: string;
  createdOrderId: string;
  subscriptionId: string;
}): Promise<UnpaidOrderType> {
  const order = await prisma.orders.update({
    where: {
      email,
      transactionId: createdOrderId,
    },
    data: {
      transactionId: subscriptionId,
      subscriptionId,
    },
  });
  return order as UnpaidOrderType;
}

export interface markAsPaidBody {
  email: string;
  transactionId: string;
  subscriptionId: string;
  productId: subscriptionTierIdType;
}

export async function markOrderAsPaid({
  email,
  transactionId,
  subscriptionId,
  productId,
}: markAsPaidBody): Promise<PaidOrderType> {
  await cancelPreviousSubscription(email);
  const subscriptionTier: subscriptionTierType = subscriptionTiers[productId];
  const order = await prisma.orders.update({
    where: {
      email,
      transactionId: subscriptionId,
    },
    data: {
      transactionId,
      paymentStatus: 'paid',
      payedAt: new Date(),
      validUntil:
        subscriptionTier.billingPeriod[0] === 'yearly'
          ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          : new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  });
  await createFirstPaidApiPeriod({
    email,
    orderId: order.transactionId,
    productId,
    apiCallsPerMonth: subscriptionTier.apiCalls,
  });
  return order as PaidOrderType;
}

export async function getPaidOrders(email: string): Promise<PaidOrderType[]> {
  const orders = await prisma.orders.findMany({
    where: {
      email,
      paymentStatus: 'paid',
    },
    orderBy: { payedAt: 'desc' },
  });
  return orders as PaidOrderType[];
}

export async function getLastPayedOrder({
  email,
}: {
  email: string;
}): Promise<PaidOrderType | undefined> {
  const order = await prisma.orders.findFirst({
    where: {
      email,
      paymentStatus: 'paid',
      NOT: {
        payedAt: null,
      },
    },
    orderBy: { payedAt: 'desc' },
  });
  return (order as PaidOrderType) || undefined;
}

export async function getOrder({
  email,
  transactionId,
}: {
  email: string;
  transactionId: string;
}): Promise<UnpaidOrderType> {
  const order = await prisma.orders.findUnique({
    where: { email, transactionId },
  });
  return order as UnpaidOrderType;
}

export async function getAllSubscriptionPeriods({
  email,
}: {
  email: string;
}): Promise<apiPeriodType[]> {
  return (await prisma.apiPeriods.findMany({
    where: {
      email,
    },
    orderBy: { validUntil: 'desc' },
  })) as apiPeriodType[];
}

export async function getCurrentSubscription({ email }: { email: string }): Promise<apiPeriodType> {
  const currentApiPeriod = await getLastApiPeriod(email);
  if (!currentApiPeriod) {
    return createFirstFreeTierApiPeriod({ email });
  }
  if (currentApiPeriod.validUntil < new Date()) {
    // current api period expired, create new one
    if (currentApiPeriod.productId === subscriptionTiers.free.productId) {
      return createNextFreeTierApiPeriod({
        lastApiPeriod: currentApiPeriod as apiPeriodType,
      });
    }
    const newCurrentApiPeriod: apiPeriodType = await createApiPeriodFromOrder({
      email,
      currentExpiredApiPeriod: currentApiPeriod as apiPeriodType,
    });
    if (newCurrentApiPeriod.validUntil > new Date()) {
      return newCurrentApiPeriod;
    }
    // paid subscription expired, switch to free tier
    return createNextFreeTierApiPeriod({ lastApiPeriod: newCurrentApiPeriod });
  }
  // current one is still valid
  return currentApiPeriod as apiPeriodType;
}

export async function getOrderFromSubscription(
  currentApiPeriod: apiPeriodType
): Promise<PaidOrderType | null> {
  if (currentApiPeriod.orderId !== 'free') {
    const order = await prisma.orders.findUnique({
      where: {
        transactionId: currentApiPeriod.orderId,
      },
    });
    return order as PaidOrderType;
  }
  return null;
}

async function getLastApiPeriod(email: string) {
  const currentApiPeriod = await prisma.apiPeriods.findFirst({
    where: {
      email,
    },
    orderBy: { validUntil: 'desc' },
  });
  return currentApiPeriod as apiPeriodType;
}

const freetierApiPeriodOrderId = subscriptionTiers.free.productId;

async function createApiPeriodFromOrder({
  email,
  currentExpiredApiPeriod,
}: {
  email: string;
  currentExpiredApiPeriod: apiPeriodType;
}): Promise<apiPeriodType> {
  const lastOrder = await getLastPayedOrder({ email });
  if (lastOrder) {
    let lastApiPeriod: apiPeriodType = currentExpiredApiPeriod;
    // create expired periods in case not used for months
    while (lastApiPeriod.validUntil.getTime() < lastOrder.validUntil.getTime()) {
      const newPeriod = (await prisma.apiPeriods.create({
        data: {
          orderId: lastOrder.transactionId,
          email,
          validFrom: new Date(lastApiPeriod.validUntil),
          validUntil: new Date(
            new Date(lastApiPeriod.validUntil).setMonth(lastApiPeriod.validUntil.getMonth() + 1)
          ),
          productId: lastApiPeriod.productId,
          apiCallsPerMonth: lastApiPeriod.apiCallsPerMonth,
        },
      })) as apiPeriodType;
      lastApiPeriod = newPeriod;
    }
    if (lastOrder.validUntil < new Date()) {
      // order not valid anymore try fetch and create order from paypal
      await createOrdersFromPaypalTransactions({ lastOrder });
    }
  }
  // get uptodate period in case last one is not the recent one
  return getLastApiPeriod(email);
}

async function createOrdersFromPaypalTransactions({
  lastOrder,
}: {
  lastOrder: PaidOrderType;
}): Promise<apiPeriodType | undefined> {
  const transactions = await getPaypalTransactionsFromSubscription(lastOrder.subscriptionId);
  transactions.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  let _lastApiPeriod: apiPeriodType | undefined;
  await Promise.all(
    transactions.map(async (transaction, index) => {
      if (index !== 0 && transaction.status === 'COMPLETED') {
        const orderExistsAlready = await prisma.orders.findUnique({
          where: {
            transactionId: transaction.id,
          },
        });
        if (!orderExistsAlready) {
          const isYearlySubscription =
            subscriptionTiers[lastOrder.productId].billingPeriod[0] === 'yearly';
          const order: PaidOrderType = (await prisma.orders.create({
            data: {
              transactionId: transaction.id,
              subscriptionId: lastOrder.subscriptionId,
              email: lastOrder.email,
              createdAt: new Date(transaction.time),
              payedAt: isYearlySubscription
                ? new Date(
                    new Date(lastOrder.payedAt).setFullYear(
                      new Date(transaction.time).getFullYear()
                    )
                  )
                : new Date(
                    new Date(lastOrder.payedAt).setMonth(new Date(transaction.time).getMonth())
                  ),
              validUntil: isYearlySubscription
                ? new Date(
                    new Date(lastOrder.payedAt).setFullYear(
                      new Date(transaction.time).getFullYear() + 1
                    )
                  )
                : new Date(
                    new Date(lastOrder.payedAt).setMonth(new Date(transaction.time).getMonth() + 1)
                  ),
              paymentStatus: 'paid',
              productId: lastOrder.productId,
              amount: Number(transaction.amount_with_breakdown.gross_amount.value),
            },
          })) as PaidOrderType;
          // create expired periods in case not used for months
          let nextValidFrom: Date = order.payedAt;
          while (
            nextValidFrom.getTime() < order.validUntil.getTime() &&
            nextValidFrom.getTime() < new Date().getTime()
          ) {
            _lastApiPeriod = (await prisma.apiPeriods.create({
              data: {
                orderId: lastOrder.transactionId,
                email: order.email,
                validFrom: nextValidFrom,
                validUntil: new Date(
                  new Date(nextValidFrom).setMonth(nextValidFrom.getMonth() + 1)
                ),
                productId: order.productId,
                apiCallsPerMonth: subscriptionTiers[order.productId].apiCalls,
              },
            })) as apiPeriodType;
            nextValidFrom = _lastApiPeriod.validUntil;
          }
        }
      }
    })
  );
  return _lastApiPeriod;
}

interface PaypalTransaction {
  status: 'COMPLETED';
  id: string;
  amount_with_breakdown: {
    gross_amount: {
      currency_code: 'EUR';
      value: string;
    };
    fee_amount: {
      currency_code: 'EUR';
      value: string;
    };
    net_amount: {
      currency_code: 'EUR';
      value: string;
    };
  };
  payer_name: {
    given_name: string;
    surname: string;
  };
  payer_email: string;
  time: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockMonthlyPaypalTransaction: PaypalTransaction[] = [
  {
    status: 'COMPLETED',
    id: '1',
    amount_with_breakdown: {
      gross_amount: {
        value: '12',
        currency_code: 'EUR',
      },
      fee_amount: {
        currency_code: 'EUR',
        value: '',
      },
      net_amount: {
        currency_code: 'EUR',
        value: '',
      },
    },
    time: '2024-02-21T11:30:54.830Z',
    payer_name: {
      given_name: '',
      surname: '',
    },
    payer_email: '',
  },
  {
    status: 'COMPLETED',
    id: '0',
    amount_with_breakdown: {
      gross_amount: {
        value: '12',
        currency_code: 'EUR',
      },
      fee_amount: {
        currency_code: 'EUR',
        value: '',
      },
      net_amount: {
        currency_code: 'EUR',
        value: '',
      },
    },
    time: '2024-01-21T11:30:14.460Z',
    payer_name: {
      given_name: '',
      surname: '',
    },
    payer_email: '',
  },
  {
    status: 'COMPLETED',
    id: '2',
    amount_with_breakdown: {
      gross_amount: {
        value: '12',
        currency_code: 'EUR',
      },
      fee_amount: {
        currency_code: 'EUR',
        value: '',
      },
      net_amount: {
        currency_code: 'EUR',
        value: '',
      },
    },
    time: '2024-03-21T11:31:08.610Z',
    payer_name: {
      given_name: '',
      surname: '',
    },
    payer_email: '',
  },
  // {
  //   status: 'COMPLETED',
  //   id: '3',
  //   amount_with_breakdown: {
  //     gross_amount: {
  //       value: '12',
  //     },
  //   },
  //   time: '2024-04-21T10:31:25.133Z',
  // },
];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockYearlyPaypalTransaction: PaypalTransaction[] = [
  {
    status: 'COMPLETED',
    id: '0',
    amount_with_breakdown: {
      gross_amount: {
        value: '120',
        currency_code: 'EUR',
      },
      fee_amount: {
        currency_code: 'EUR',
        value: '',
      },
      net_amount: {
        currency_code: 'EUR',
        value: '',
      },
    },
    time: '2022-01-21T11:30:14.460Z',
    payer_name: {
      given_name: '',
      surname: '',
    },
    payer_email: '',
  },
  {
    status: 'COMPLETED',
    id: '1',
    amount_with_breakdown: {
      gross_amount: {
        value: '120',
        currency_code: 'EUR',
      },
      fee_amount: {
        currency_code: 'EUR',
        value: '',
      },
      net_amount: {
        currency_code: 'EUR',
        value: '',
      },
    },
    time: '2023-01-21T11:30:14.460Z',
    payer_name: {
      given_name: '',
      surname: '',
    },
    payer_email: '',
  },
  // {
  //   status: 'COMPLETED',
  //   id: '2',
  //   amount_with_breakdown: {
  //     gross_amount: {
  //       value: '120',
  //       currency_code: 'EUR',
  //     },
  //     fee_amount: {
  //       currency_code: 'EUR',
  //       value: '',
  //     },
  //     net_amount: {
  //       currency_code: 'EUR',
  //       value: '',
  //     },
  //   },
  //   time: '2024-01-21T11:30:14.460Z',
  //   payer_name: {
  //     given_name: '',
  //     surname: '',
  //   },
  //   payer_email: '',
  // },
];

async function getPaypalTransactionsFromSubscription(subscriptionId: string) {
  const accessToken = await generateAccessToken();
  const transactionsForSubscriptionResponse: Response = await fetch(
    `${
      serverRuntimeConfig.PAYPAL_API_URL
    }/v1/billing/subscriptions/${subscriptionId}/transactions?start_time=2024-01-01T07:50:20.940Z&end_time=${new Date().toISOString()}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const paypalTransactions: {
    transactions: PaypalTransaction[];
  } = await transactionsForSubscriptionResponse.json();
  return paypalTransactions.transactions;
}

async function createFirstFreeTierApiPeriod({ email }: { email: string }): Promise<apiPeriodType> {
  return (await prisma.apiPeriods.create({
    data: {
      orderId: freetierApiPeriodOrderId,
      email,
      validFrom: new Date(),
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      productId: subscriptionTiers.free.productId,
      apiCallsPerMonth: subscriptionTiers.free.apiCalls,
    },
  })) as apiPeriodType;
}

async function createNextFreeTierApiPeriod({
  lastApiPeriod,
}: {
  lastApiPeriod: apiPeriodType;
}): Promise<apiPeriodType> {
  let _lastApiPeriod: apiPeriodType = lastApiPeriod;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // create new ApiPeriods until current one, in case not used for months
    _lastApiPeriod = (await prisma.apiPeriods.create({
      data: {
        orderId: freetierApiPeriodOrderId,
        email: _lastApiPeriod.email,
        validFrom: _lastApiPeriod.validUntil,
        validUntil: new Date(
          new Date(_lastApiPeriod.validUntil).setMonth(
            new Date(_lastApiPeriod.validUntil).getMonth() + 1
          )
        ),
        productId: subscriptionTiers.free.productId,
        apiCallsPerMonth: subscriptionTiers.free.apiCalls,
      },
    })) as apiPeriodType;
    if (_lastApiPeriod.validUntil > new Date()) {
      return _lastApiPeriod;
    }
  }
}

async function createFirstPaidApiPeriod({
  email,
  orderId,
  productId,
  apiCallsPerMonth,
}: {
  email: string;
  orderId: string;
  productId: string;
  apiCallsPerMonth: number;
}): Promise<apiPeriodType> {
  return (await prisma.apiPeriods.create({
    data: {
      orderId,
      email,
      validFrom: new Date(),
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      productId,
      apiCallsPerMonth,
    },
  })) as apiPeriodType;
}

async function cancelPreviousSubscription(email: string) {
  const currentSubscription = await getCurrentSubscription({
    email,
  });
  const previousOrder = await getOrderFromSubscription(currentSubscription);
  if (previousOrder) {
    const accessToken = await generateAccessToken();
    await fetch(
      `${serverRuntimeConfig.PAYPAL_API_URL}/v1/billing/subscriptions/${previousOrder.subscriptionId}/suspend`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'PayPal-Auth-Assertion': getAuthAssertionValue(),
        },
        body: JSON.stringify({
          reason: 'Customer upgrade to another subscription',
        }),
      }
    );
  }
  return undefined;
}
