import bcrypt from 'bcryptjs';
import { NewsletterSystem } from '../api/newsletterSystemConstants';
import { apiDocsPath, subscriptionTierType } from './constants';

export function encryptPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function getNewsletterSystemDocsUrl(newsletterSystem: NewsletterSystem): string {
  return apiDocsPath + newsletterSystem.path;
}

export function getTotalPriceForSubscription(product: subscriptionTierType): {
  isYearly: boolean;
  totalPrice: number;
} {
  const isYearly = product.billingPeriod[0] === 'yearly';
  const totalPrice = Number((product.price * (isYearly ? 12 : 1)).toFixed(0));
  return {
    isYearly,
    totalPrice,
  };
}
