'use server';

import { subscriptionTierIdType } from '../constants';
import { prisma } from './prisma';

export interface OrderType {
  id: string;
  email: string;
  createdAt: Date;
  payedAt?: Date | null;
  validUntil?: Date | null;
  paymentStatus: 'unpaid' | 'paid';
  productId: subscriptionTierIdType;
  amount: number;
}

export async function createOrder(
  email: string,
  productId: subscriptionTierIdType,
  amount: number
): Promise<OrderType> {
  const order = await prisma.orders.create({
    data: {
      email,
      productId,
      amount,
    },
  });
  return order as OrderType;
}

export async function updateToPaypalOrderId(
  email: string,
  orderId: string,
  payPalOrderId: string
): Promise<OrderType> {
  const order = await prisma.orders.update({
    where: {
      email,
      id: orderId,
    },
    data: {
      id: payPalOrderId,
    },
  });
  return order as OrderType;
}

export async function markOrderAsPaid(email: string, orderId: string): Promise<OrderType> {
  const order = await prisma.orders.update({
    where: {
      email,
      id: orderId,
    },
    data: {
      paymentStatus: 'paid',
      payedAt: new Date(),
      validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  });
  return order as OrderType;
}

export async function getOrders(email: string): Promise<OrderType[]> {
  const orders = await prisma.orders.findMany({
    where: { email },
  });
  return orders as OrderType[];
}

export async function getOrder(email: string, orderId: string): Promise<OrderType> {
  const order = await prisma.orders.findUnique({
    where: { email, id: orderId },
  });
  return order as OrderType;
}

export async function getCurrentSubscription(email: string): Promise<OrderType> {
  // TODO improve and handle upgrade
  const orders = await prisma.orders.findMany({
    where: {
      email,
      paymentStatus: 'paid',
      NOT: {
        validUntil: null,
        payedAt: null,
      },
    },
  });
  const currentSubscription = orders.find(
    (order) =>
      order.validUntil &&
      new Date(order.validUntil.toDateString()) > new Date(new Date().toDateString())
  );
  return (
    (currentSubscription && (currentSubscription as OrderType)) ||
    ({
      id: 'free',
      email,
      createdAt: new Date(), // TODO free tier started date
      payedAt: null,
      validUntil: null,
      paymentStatus: 'paid',
      productId: 'free',
      amount: 0,
    } as OrderType)
  );
}
