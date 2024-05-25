import bcrypt from 'bcryptjs';

import { apiPeriodType, PaidOrderType } from '../_server/orders';
import { NewsletterSystem } from '../api/newsletterSystemConstants';
import { apiDocsPath, subscriptionTierType } from './constants';

export function encryptPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function getNewsletterSystemDocsUrl(newsletterSystem: NewsletterSystem): string {
  return apiDocsPath + newsletterSystem.path;
}

export function getTotalPriceForSubscription(
  product: subscriptionTierType,
  currentSubscription: apiPeriodType | undefined,
  currentSubscriptionOrder: PaidOrderType | null
): {
  isYearly: boolean;
  totalPrice: number;
  rebateValuePreviousOrder: number;
} {
  const canUpgrade = canUpgradeFromCurrentToTarget(currentSubscription, product);
  let rebateValuePreviousOrder: number = 0;
  if (
    canUpgrade &&
    currentSubscription &&
    currentSubscription.productId !== 'free' &&
    currentSubscriptionOrder
  ) {
    const remainingPercent = getRemainingCurrentSubscriptionPercent(currentSubscriptionOrder);
    rebateValuePreviousOrder = Math.round(currentSubscriptionOrder.amount * remainingPercent) / 100;
  }
  const isYearly = product.billingPeriod[0] === 'yearly';
  const totalPrice = Number((product.price * (isYearly ? 12 : 1)).toFixed(0));
  return {
    isYearly,
    totalPrice,
    rebateValuePreviousOrder,
  };
}

function getRemainingCurrentSubscriptionPercent(currentSubscription: PaidOrderType) {
  // Get today's date
  const today = new Date();

  // Calculate the total duration of validity period in milliseconds
  const totalDuration =
    currentSubscription.validUntil.getTime() - currentSubscription.payedAt.getTime();

  // Calculate the elapsed duration from validFrom to today in milliseconds
  const elapsedDuration = today.getTime() - currentSubscription.payedAt.getTime();

  // Calculate the percentage
  const percentage = 100 - (elapsedDuration / totalDuration) * 100;

  // Round the percentage to two decimal places
  const roundedPercentage = Math.round(percentage * 100) / 100;
  return roundedPercentage;
}

export function objectEntries<
  T extends Record<PropertyKey, unknown>,
  K extends keyof T,
  V extends T[K],
>(o: T) {
  return Object.entries(o) as [K, V][];
}

export function canUpgradeFromCurrentToTarget(
  currentSubscription: apiPeriodType | undefined,
  targetSubscription: subscriptionTierType
): boolean {
  if (!currentSubscription) {
    return true;
  }
  if (currentSubscription?.productId === 'free') {
    if (targetSubscription.productId === 'free') {
      return false;
    }
    return true;
  }
  if (
    currentSubscription?.productId === 'monthly_base' &&
    [
      'base',
      'pro',
      'enterprise',
      'ultimate',
      'monthly_pro',
      'monthly_enterprise',
      'monthly_ultimate',
    ].includes(targetSubscription.productId)
  ) {
    return true;
  }
  if (
    currentSubscription?.productId === 'monthly_pro' &&
    ['base', 'pro', 'enterprise', 'ultimate', 'monthly_enterprise', 'monthly_ultimate'].includes(
      targetSubscription.productId
    )
  ) {
    return true;
  }
  if (
    currentSubscription?.productId === 'monthly_enterprise' &&
    ['base', 'pro', 'enterprise', 'ultimate', 'monthly_ultimate'].includes(
      targetSubscription.productId
    )
  ) {
    return true;
  }
  if (
    currentSubscription?.productId === 'monthly_ultimate' &&
    ['base', 'pro', 'enterprise', 'ultimate'].includes(targetSubscription.productId)
  ) {
    return true;
  }
  if (
    currentSubscription?.productId === 'base' &&
    ['pro', 'enterprise', 'ultimate'].includes(targetSubscription.productId)
  ) {
    return true;
  }
  if (
    currentSubscription?.productId === 'pro' &&
    ['enterprise', 'ultimate'].includes(targetSubscription.productId)
  ) {
    return true;
  }
  if (
    currentSubscription?.productId === 'enterprise' &&
    ['ultimate'].includes(targetSubscription.productId)
  ) {
    return true;
  }
  if (
    currentSubscription?.productId === 'testingy' &&
    ['testing'].includes(targetSubscription.productId)
  ) {
    return true;
  }
  if (
    currentSubscription?.productId === 'testing' &&
    ['testingy'].includes(targetSubscription.productId)
  ) {
    return true;
  }
  return false;
}
