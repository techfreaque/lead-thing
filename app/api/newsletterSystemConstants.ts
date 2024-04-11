import { CSSProperties } from 'react';
import {
  FreshmailIcon,
  GetresponseIcon,
  KlaviyoIcon,
  MappIcon,
  SailthruIcon,
  SalesforceIcon,
  SalesmanagoIcon,
} from '../components/Icons/Icons';

export type avialableSystemsType =
  | 'getresponse'
  | 'mapp'
  | 'sailthru'
  | 'salesforce'
  | 'freshmail'
  // | 'klaviyo'
  | 'salesmanago';

export interface NewsletterSystem {
  path: string;
  name: string;
  icon: ({
    style,
    className,
  }: {
    style?: CSSProperties | undefined;
    className?: string | undefined;
  }) => JSX.Element;
  apiFields: RequestOptionsFieldName[];
}

export const newsletterSystems: {
  [key in avialableSystemsType]: NewsletterSystem;
} = {
  getresponse: {
    path: '/getresponse',
    name: 'GetResponse',
    icon: GetresponseIcon,
    apiFields: ['firstname', 'lastname', 'email', 'ip', 'listId', 'getresponseApiKey', 'tagId'],
  },
  freshmail: {
    path: '/freshmail',
    name: 'FreshMail',
    icon: FreshmailIcon,
    apiFields: [
      'firstname',
      'lastname',
      'email',
      'listHash',
      'freshmailApiKey',
      'freshmailApiSecret',
      'subscriptionMode',
    ],
  },
  sailthru: {
    path: '/sailthru',
    name: 'Sailthru',
    icon: SailthruIcon,
    apiFields: ['firstname', 'lastname', 'email', 'listName', 'sailthruApiKey', 'sailthruSecret'],
  },
  mapp: {
    path: '/mapp',
    name: 'Mapp',
    icon: MappIcon,
    apiFields: [
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
  },
  salesforce: {
    path: '/salesforce',
    name: 'Salesforce',
    icon: SalesforceIcon,
    apiFields: [
      'firstname',
      'lastname',
      'email',
      'listId',
      'SalesforceSubDomain',
      'SalesforceClientId',
      'SalesforceClientSecret',
      'SalesforceAccountId',
    ],
  },
  salesmanago: {
    path: '/salesmanago',
    name: 'SalesManago',
    icon: SalesmanagoIcon,
    apiFields: [
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
  },
  // klaviyo: {
  //   path: '/klaviyo',
  //   name: 'Klaviyo',
  //   icon: KlaviyoIcon,
  //   apiFields: [],
  // },
};

type RequestOptionsFieldName =
  | 'firstname'
  | 'lastname'
  | 'email'
  | 'ip'
  | 'gender'
  | 'countryCode'
  | 'subscriptionMode'
  | 'listId'
  | 'listName'
  | 'listHash'
  | 'getresponseApiKey'
  | 'mappUsername'
  | 'mappPassword'
  | 'mappDomain'
  | 'sailthruApiKey'
  | 'sailthruSecret'
  | 'SalesforceSubDomain'
  | 'SalesforceClientId'
  | 'SalesforceClientSecret'
  | 'SalesforceAccountId'
  | 'tag'
  | 'tagId'
  | 'salesManagoClientId'
  | 'salesManagoApiKey'
  | 'salesManagoSha'
  | 'salesManagoSubDomain'
  | 'salesManagoOwner'
  | 'freshmailApiKey'
  | 'freshmailApiSecret';

export const RequestOptionsData: {
  [key in RequestOptionsFieldName]: {
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
  listHash: {
    label: 'List Hash',
    valueType: 'string',
    value: 'the hash of your list',
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
  tagId: {
    label: 'Tag Id',
    valueType: 'string',
    value: '',
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
  freshmailApiKey: {
    label: 'Freshmail API key',
    valueType: 'string',
    value: 'FRESHMAIL_API_KEY',
    required: true,
    description: '',
  },
  freshmailApiSecret: {
    label: 'Freshmail API secret',
    valueType: 'string',
    value: 'FRESHMAIL_API_SECRET',
    required: true,
    description: '',
  },
};
