export const APP_NAME = 'leadThing.dev';
export const APP_COMPANY_COUNTRY = 'United Kingdom';
export const APP_PRODUCTION_DOMAIN = 'https://leadthing.dev';
const APP_DEV_DOMAIN = 'http://localhost:3000';
export const APP_DOMAIN =
  process.env.NODE_ENV === 'development' ? APP_DEV_DOMAIN : APP_PRODUCTION_DOMAIN;
export const APP_GITHUB_URL = 'https://github.com/techfreaque/lead-thing';

export const registerPath = '/signup';
export const loginPath = '/login';
export const resetPasswordPath = '/reset-password';
export const resetSuccessParam = 'resetSuccess';
export const resetSuccessPath = `${loginPath}?${resetSuccessParam}=true`;
export const contactPath = '/#contact';
export const tosPath = '/terms-of-service';
export const apiDocsPath = '/api-documentation';

export const myAccountPath = '/my-account';
const myApiKeyPath = '/my-api-key';
export const myApiKeyUrl = myAccountPath + myApiKeyPath;
const mySubscriptionPath = '/my-subscription';
export const mySubscriptionUrl = myAccountPath + mySubscriptionPath;
export const invoiceUrl = `${myAccountPath + mySubscriptionPath}/invoice/`;
export const checkoutUrl = `${myAccountPath}/checkout/`;

// API Endpoints
export const apiURL = `${APP_DOMAIN}/api`;

// WARNING: Subscriptions must be edited/added in paypal before
export type subscriptionTierIdType =
  | 'free'
  | 'base'
  | 'pro'
  | 'enterprise'
  | 'ultimate'
  | 'monthly_base'
  | 'monthly_pro'
  | 'monthly_enterprise'
  | 'monthly_ultimate'
  | 'testingy'
  | 'testing';

export type subscriptionDurationsType = 'yearly' | 'monthly';

export const subscriptionDurations: {
  value: subscriptionDurationsType;
  label: string;
}[] = [
  { value: 'yearly', label: 'Yearly subscription' },
  { value: 'monthly', label: 'Monthly subscription' },
];

export interface subscriptionTierType {
  productId: subscriptionTierIdType;
  title: string;
  price: number;
  rebatePercent: number;
  apiCalls: number;
  canBeSold: boolean;
  billingPeriod: subscriptionDurationsType[];
  isTesting?: boolean;
}

export type subscriptionTiersType = {
  [key in subscriptionTierIdType]: subscriptionTierType;
};

export const subscriptionTiers: subscriptionTiersType = {
  free: {
    title: 'Free',
    price: 0,
    productId: 'free',
    rebatePercent: 0,
    apiCalls: 100,
    canBeSold: true,
    billingPeriod: ['yearly', 'monthly'],
  },
  base: {
    title: 'Base Yearly',
    price: 10,
    productId: 'base',
    rebatePercent: 20,
    apiCalls: 750,
    canBeSold: true,
    billingPeriod: ['yearly'],
  },
  pro: {
    title: 'Pro Yearly',
    price: 20,
    productId: 'pro',
    rebatePercent: 20,
    apiCalls: 2000,
    canBeSold: true,
    billingPeriod: ['yearly'],
  },
  enterprise: {
    title: 'Enterprise Yearly',
    price: 40,
    productId: 'enterprise',
    rebatePercent: 20,
    apiCalls: 8000,
    canBeSold: true,
    billingPeriod: ['yearly'],
  },
  ultimate: {
    title: 'Ultimate Yearly',
    price: 80,
    productId: 'ultimate',
    rebatePercent: 20,
    apiCalls: 20_000,
    canBeSold: true,
    billingPeriod: ['yearly'],
  },
  monthly_base: {
    title: 'Base Monthly',
    price: 12,
    productId: 'monthly_base',
    rebatePercent: 0,
    apiCalls: 750,
    canBeSold: true,
    billingPeriod: ['monthly'],
  },
  monthly_pro: {
    title: 'Pro Monthly',
    price: 24,
    productId: 'monthly_pro',
    rebatePercent: 0,
    apiCalls: 2000,
    canBeSold: true,
    billingPeriod: ['monthly'],
  },
  monthly_enterprise: {
    title: 'Enterprise Monthly',
    price: 48,
    productId: 'monthly_enterprise',
    rebatePercent: 0,
    apiCalls: 8000,
    canBeSold: true,
    billingPeriod: ['monthly'],
  },
  monthly_ultimate: {
    title: 'Ultimate Monthly',
    price: 96,
    productId: 'monthly_ultimate',
    rebatePercent: 0,
    apiCalls: 20_000,
    canBeSold: true,
    billingPeriod: ['monthly'],
  },
  testing: {
    productId: 'testing',
    title: 'Testing Monthly',
    price: 1,
    rebatePercent: 0,
    apiCalls: 120,
    canBeSold: true,
    billingPeriod: ['monthly'],
    isTesting: true,
  },
  testingy: {
    productId: 'testingy',
    title: 'Testing Yearly',
    price: 0.1,
    rebatePercent: 0,
    apiCalls: 120,
    canBeSold: true,
    billingPeriod: ['yearly'],
    isTesting: true,
  },
};
