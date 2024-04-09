import type { CSSProperties } from 'react';
import {
  GetresponseIcon,
  KlaviyoIcon,
  MappIcon,
  SailthruIcon,
  SalesforceIcon,
  SalesmanagoIcon,
} from './components/Icons/Icons';

export const APP_NAME = 'leadThing.dev';
const APP_DOMAIN = 'https://leadthing.dev';
const APP_DEV_DOMAIN = 'http://localhost:3000';
export const APP_GITHUB_URL = 'https://github.com/techfreaque/lead-thing';

export const registerPath = '/signup';
export const loginPath = '/login';
export const restPasswordPath = '/reset-password';
export const contactPath = '/#contact';
export const tosPath = '/terms-of-service';
export const apiDocsPath = '/api-documentation';

export const myAccountPath = '/my-account';
const myApiKeyPath = '/my-api-key';
export const myApiKeyUrl = myAccountPath + myApiKeyPath;

export const getresponsePath = '/getresponse';
export const sailthruPath = '/sailthru';
export const mappPath = '/mapp';
export const salesforcePath = '/salesforce';
export const salesmanagoPath = '/salesmanago';
export const klaviyoPath = '/klaviyo';

// API Endpoints
export const apiURL = `${process.env.NODE_ENV === 'development' ? APP_DEV_DOMAIN : APP_DOMAIN}/api`;
export const getresponseApiURL = apiURL + getresponsePath;
export const sailthruApiURL = apiURL + sailthruPath;
export const mappApiURL = apiURL + mappPath;
export const salesforceApiURL = apiURL + salesforcePath;
export const salesmanagoApiURL = apiURL + salesmanagoPath;
export const klaviyoApiURL = apiURL + klaviyoPath;

export const freeTierApiCalls = 100;

export const systemNamesByKey: { [key: string]: string } = {
  getresponse: 'GetResponse',
  mapp: 'Mapp',
  sailthru: 'Sailthru',
  salesforce: 'Salesforce',
  salesmanago: 'SalesManago',
};

export const supportedSystems: {
  icon: ({
    style,
    className,
  }: {
    style?: CSSProperties | undefined;
    className?: string | undefined;
  }) => JSX.Element;
  label: string;
  link: string;
}[] = [
  {
    icon: GetresponseIcon,
    label: systemNamesByKey.getresponse,
    link: apiDocsPath + getresponsePath,
  },
  {
    icon: MappIcon,
    label: systemNamesByKey.mapp,
    link: apiDocsPath + mappPath,
  },
  {
    icon: SailthruIcon,
    label: systemNamesByKey.sailthru,
    link: apiDocsPath + sailthruPath,
  },
  {
    icon: SalesforceIcon,
    label: systemNamesByKey.salesforce,
    link: apiDocsPath + salesforcePath,
  },
  {
    icon: SalesmanagoIcon,
    label: systemNamesByKey.salesmanago,
    link: apiDocsPath + salesmanagoPath,
  },
  {
    icon: KlaviyoIcon,
    label: 'Klaviyo',
    link: apiDocsPath + klaviyoPath,
  },
];

export const RequestOptionsData: {
  [key: string]: {
    label: string;
    valueType: string;
    value: string;
    required: boolean;
    options?: string[];
    description: string;
  };
} = {
  firstname: {
    label: 'First Name',
    valueType: 'string',
    value: 'John',
    required: true,
    description: '',
  },
  lastname: {
    label: 'Last Name',
    valueType: 'string',
    value: 'Smith',
    required: true,
    description: '',
  },
  email: {
    label: 'Email',
    valueType: 'string',
    value: 'john.smith@example.com',
    required: true,
    description: '',
  },
  ip: {
    label: 'Ip',
    valueType: 'string',
    value: '127.0.0.1',
    required: false,
    description: '',
  },
  gender: {
    label: 'Gender',
    valueType: 'string',
    value: 'MALE',
    required: false,
    description: '',
  },
  countryCode: {
    label: 'Country Code',
    valueType: 'string',
    value: 'GB',
    required: false,
    description: '',
  },
  subscriptionMode: {
    label: 'Subscription Mode',
    valueType: 'options',
    options: ['DOUBLE_OPT_IN', 'FORCE_OPT_IN'],
    value: 'DOUBLE_OPT_IN',
    required: true,
    description: '',
  },
  listId: {
    label: 'List Id',
    valueType: 'string',
    value: '1234',
    required: true,
    description: '',
  },
  listName: {
    label: 'List Name',
    valueType: 'string',
    value: 'listName',
    required: true,
    description: '',
  },
  getresponseApiKey: {
    label: 'Getresponse Api Key',
    valueType: 'string',
    value: 'GET_RESPONSE_API_KEY',
    required: true,
    description: '',
  },
  mappUsername: {
    label: 'Mapp Username',
    valueType: 'string',
    value: 'MAPP_USERNAME',
    required: true,
    description: '',
  },
  mappPassword: {
    label: 'Mapp Password',
    valueType: 'string',
    value: 'MAPP_PASSWORD',
    required: true,
    description: '',
  },
  mappDomain: {
    label: 'Mapp Domain',
    valueType: 'string',
    value: 'MAPP_DOMAIN',
    required: true,
    description: '',
  },
  sailthruApiKey: {
    label: 'Sailthru Api Key',
    valueType: 'string',
    value: 'SAILTHRU_API_KEY',
    required: true,
    description: '',
  },
  sailthruSecret: {
    label: 'Sailthru Secret',
    valueType: 'string',
    value: 'SAILTHRU_SECRET',
    required: true,
    description: '',
  },
  SalesforceSubDomain: {
    label: 'Salesforce Sub Domain',
    valueType: 'string',
    value: 'SALESFORCE_SUB_DOMAIN',
    required: true,
    description: '',
  },
  SalesforceClientId: {
    label: 'Salesforce Client Id',
    valueType: 'string',
    value: 'SALESFORCE_CLIENT_ID',
    required: true,
    description: '',
  },
  SalesforceClientSecret: {
    label: 'Salesforce Client Secret',
    valueType: 'string',
    value: 'SALESFORCE_CLIENT_SECRET',
    required: true,
    description: '',
  },
  SalesforceAccountId: {
    label: 'Salesforce Account Id',
    valueType: 'string',
    value: 'SALESFORCE_ACCOUNT_ID',
    required: true,
    description: '',
  },
  tag: {
    label: 'Tag',
    valueType: 'string',
    value: 'Example Lead Tag',
    required: false,
    description: '',
  },
  salesManagoClientId: {
    label: 'SalesManago Client Id',
    valueType: 'string',
    value: 'SALES_MANAGO_CLIENT_ID',
    required: true,
    description: '',
  },
  salesManagoApiKey: {
    label: 'SalesManago Api Key',
    valueType: 'string',
    value: 'SALES_MANAGO_API_KEY',
    required: true,
    description: '',
  },
  salesManagoSha: {
    label: 'SalesManago Sha',
    valueType: 'string',
    value: 'SALES_MANAGO_SHA',
    required: true,
    description: '',
  },
  salesManagoSubDomain: {
    label: 'SalesManago Sub Domain',
    valueType: 'string',
    value: 'SALES_MANAGO_SUB_DOMAIN',
    required: true,
    description: '',
  },
  salesManagoOwner: {
    label: 'SalesManago Owner',
    valueType: 'string',
    value: 'SALES_MANAGO_OWNER',
    required: true,
    description: '',
  },
};

export const fieldsBySystem = {
  getresponse: ['firstname', 'lastname', 'email', 'ip', 'listId', 'getresponseApiKey'],
  mapp: [
    'firstname',
    'lastname',
    'email',
    'mappUsername',
    'mappPassword',
    'mappDomain',
    'countryCode',
    'listId',
    'subscriptionMode',
  ],
  sailthru: ['firstname', 'lastname', 'email', 'listName', 'sailthruApiKey', 'sailthruSecret'],
  salesforce: [
    'firstname',
    'lastname',
    'email',
    'listId',
    'SalesforceSubDomain',
    'SalesforceClientId',
    'SalesforceClientSecret',
    'SalesforceAccountId',
  ],
  salesmanago: [
    'firstname',
    'lastname',
    'email',
    'countryCode',
    'tag',
    'subscriptionMode',
    'salesManagoClientId',
    'salesManagoApiKey',
    'salesManagoSha',
    'salesManagoSubDomain',
    'salesManagoOwner',
  ],
};
