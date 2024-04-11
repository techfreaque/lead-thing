import type { CSSProperties } from 'react';
import {
  FreshmailIcon,
  GetresponseIcon,
  KlaviyoIcon,
  MappIcon,
  SailthruIcon,
  SalesforceIcon,
  SalesmanagoIcon,
} from './components/Icons/Icons';

export const APP_NAME = 'leadThing.dev';
export const APP_COMPANY_COUNTRY = 'United Kingdom';
const APP_PRODUCTION_DOMAIN = 'https://leadthing.dev';
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
// export const getresponseApiURL = apiURL + getresponsePath;
// export const sailthruApiURL = apiURL + sailthruPath;
// export const mappApiURL = apiURL + mappPath;
// export const salesforceApiURL = apiURL + salesforcePath;
// export const salesmanagoApiURL = apiURL + salesmanagoPath;
// export const klaviyoApiURL = apiURL + klaviyoPath;
// export const freshmailApiURL = apiURL + freshmailPath;

export const freeTierApiCalls = 100;

export type subscriptionTierIdType = 'free' | 'base' | 'pro' | 'enterprise' | 'testing';
export interface subscriptionTierType {
  productId: subscriptionTierIdType;
  title: string;
  price: number;
  apiCalls: number;
  canBeSold: boolean;
  billingPeriod: 'yearly';
  isTesting?: boolean;
}

export interface subscriptionTiersType {
  [key: string]: subscriptionTierType;
}

export const subscriptionTiers: subscriptionTiersType = {
  free: {
    title: 'Free',
    price: 0,
    productId: 'free',
    // rebatePercent: 0,
    apiCalls: 100,
    canBeSold: true,
    billingPeriod: 'yearly',
  },
  base: {
    title: 'Base',
    price: 10,
    productId: 'base',
    // rebatePercent: 0,
    apiCalls: 750,
    canBeSold: true,
    billingPeriod: 'yearly',
  },
  pro: {
    title: 'Pro',
    price: 20,
    productId: 'pro',
    // rebatePercent: 25,
    apiCalls: 2000,
    canBeSold: true,
    billingPeriod: 'yearly',
  },
  enterprise: {
    title: 'Enterprise',
    price: 40,
    productId: 'enterprise',
    // rebatePercent: 25,
    apiCalls: 20000,
    canBeSold: true,
    billingPeriod: 'yearly',
  },
  testing: {
    productId: 'testing',
    title: 'Testing',
    price: 0.1,
    apiCalls: 120,
    canBeSold: true,
    billingPeriod: 'yearly',
    isTesting: true,
  },
};
