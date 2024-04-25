import { CSSProperties } from 'react';
import {
  FreshmailIcon,
  GetresponseIcon,
  MappIcon,
  SailthruIcon,
  SalesforceIcon,
  SalesmanagoIcon,
  YouleadIcon,
  CleverreachIcon,
  MailupIcon,
  ExpertsenderIcon,
  AdobeCampaignIcon,
} from '../_components/Icons/Icons';

export type avialableSystemsType =
  | 'getresponse'
  | 'mapp'
  | 'sailthru'
  | 'salesforce'
  | 'freshmail'
  // | 'klaviyo'
  | 'salesmanago'
  | 'adobecampaign'
  | 'mailup'
  | 'cleverreach'
  | 'expertsender'
  | 'youlead';

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

export const notDefinedCheckboxValue = 'not defined';

export const newsletterSystems: {
  [key in avialableSystemsType]: NewsletterSystem;
} = {
  adobecampaign: {
    path: '/adobecampaign',
    name: 'Adobe Campaign',
    icon: AdobeCampaignIcon,
    apiFields: [
      'firstname',
      'lastname',
      'email',
      'adobeCampaignListId',
      'adobeCampaignClientId',
      'adobeCampaignClientSecret',
      'adobeCampaignOrganizationId',
      'adobeCampaignApiKey',
    ],
  },
  getresponse: {
    path: '/getresponse',
    name: 'GetResponse',
    icon: GetresponseIcon,
    apiFields: ['firstname', 'lastname', 'email', 'ip', 'listId', 'getresponseApiKey', 'tagId'],
  },
  cleverreach: {
    path: '/cleverreach',
    name: 'CleverReach',
    icon: CleverreachIcon,
    apiFields: [
      'firstname',
      'lastname',
      'email',
      'gender',
      'cleverreachListId',
      'cleverreachSource',
      'cleverreachClientId',
      'cleverreachClientSecret',
    ],
  },
  expertsender: {
    path: '/expertsender',
    name: 'Expertsender',
    icon: ExpertsenderIcon,
    apiFields: [
      'firstname',
      'lastname',
      'email',
      'ip',
      'listId',
      'expertSenderVendor',
      'expertSenderApiDomain',
      'expertSenderApiKey',
    ],
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
  mailup: {
    path: '/mailup',
    name: 'Mailup',
    icon: MailupIcon,
    apiFields: [
      'firstname',
      'lastname',
      'email',
      'gender',
      'subscriptionMode',
      'mailupListId',
      'mailupClientId',
      'mailupClientSecret',
      'mailupUsername',
      'mailupPassword',
    ],
  },
  mapp: {
    path: '/mapp',
    name: 'Mapp',
    icon: MappIcon,
    apiFields: [
      'firstname',
      'lastname',
      'email',
      'countryCode',
      'languageCode',
      'gender',
      'listId',
      'subscriptionMode',
      'mappCustomAttributes',
      'mappUsername',
      'mappPassword',
      'mappDomain',
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
      'salesforceSubDomain',
      'salesforceClientId',
      'salesforceClientSecret',
      'salesforceAccountId',
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
      'salesManagoDomain',
      'salesManagoOwner',
    ],
  },
  youlead: {
    path: '/youlead',
    name: 'Youlead',
    icon: YouleadIcon,
    apiFields: [
      'firstname',
      'lastname',
      'email',
      'youLeadTag',
      'subscriptionMode',
      'youLeadAppId',
      'youLeadClientId',
      'youLeadAppSecretKey',
    ],
  },
  // klaviyo: {
  //   path: '/klaviyo',
  //   name: 'Klaviyo',
  //   icon: KlaviyoIcon,
  //   apiFields: [],
  // },
};

export type RequestOptionsFieldName =
  | 'firstname'
  | 'lastname'
  | 'email'
  | 'ip'
  | 'gender'
  | 'countryCode'
  | 'languageCode'
  | 'subscriptionMode'
  | 'listId'
  | 'listName'
  | 'listHash'
  | 'getresponseApiKey'
  | 'mappCustomAttributes'
  | 'mappUsername'
  | 'mappPassword'
  | 'mappDomain'
  | 'sailthruApiKey'
  | 'sailthruSecret'
  | 'salesforceSubDomain'
  | 'salesforceClientId'
  | 'salesforceClientSecret'
  | 'salesforceAccountId'
  | 'adobeCampaignListId'
  | 'adobeCampaignClientId'
  | 'adobeCampaignClientSecret'
  | 'adobeCampaignOrganizationId'
  | 'adobeCampaignApiKey'
  | 'tag'
  | 'tagId'
  | 'salesManagoClientId'
  | 'salesManagoApiKey'
  | 'salesManagoSha'
  | 'salesManagoDomain'
  | 'salesManagoOwner'
  | 'freshmailApiKey'
  | 'youLeadAppId'
  | 'youLeadClientId'
  | 'youLeadAppSecretKey'
  | 'youLeadTag'
  | 'cleverreachClientId'
  | 'cleverreachSource'
  | 'cleverreachListId'
  | 'cleverreachClientSecret'
  | 'mailupListId'
  | 'mailupClientId'
  | 'mailupClientSecret'
  | 'mailupUsername'
  | 'mailupPassword'
  | 'expertSenderVendor'
  | 'expertSenderApiDomain'
  | 'expertSenderApiKey'
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
    valueType: 'options',
    options: [notDefinedCheckboxValue, 'MALE', 'FEMALE'],
    value: '',
    required: false,
    description: '',
  },
  countryCode: {
    label: 'Country Code',
    valueType: 'string',
    value: '',
    required: false,
    description: 'Provide an ISO country code e.g.: GB, DE or US',
  },
  languageCode: {
    label: 'Language Code',
    valueType: 'string',
    value: '',
    required: false,
    description: 'Provide an ISO language code e.g.: en or de',
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
  mappCustomAttributes: {
    label: 'Mapp Custom Attributes',
    valueType: 'string',
    value: '',
    required: false,
    description:
      'Prvide a comma separated list of custom attributes e.g.: user.attributeName=attributeValue, user.anottherAttribute=anotherValue',
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
  adobeCampaignListId: {
    label: 'Adobe Campaign List Id / Service Id',
    valueType: 'string',
    value: 'ADOBE_CAMPAIGN_LIST_ID',
    required: true,
    description: '',
  },
  adobeCampaignOrganizationId: {
    label: 'Adobe Campaign Organization Id',
    valueType: 'string',
    value: 'ADOBE_CAMPAIGN_ORGANIZATION_ID',
    required: true,
    description: '',
  },
  adobeCampaignClientId: {
    label: 'Adobe Campaign Client Id',
    valueType: 'string',
    value: 'ADOBE_CAMPAIGN_CLIENT_ID',
    required: true,
    description: '',
  },
  adobeCampaignClientSecret: {
    label: 'Adobe Campaign Client Secret',
    valueType: 'string',
    value: 'ADOBE_CAMPAIGN_CLIENT_SECRET',
    required: true,
    description: '',
  },
  adobeCampaignApiKey: {
    label: 'Adobe Campaign API Key',
    valueType: 'string',
    value: 'ADOBE_CAMPAIGN_API_KEY',
    required: true,
    description: '',
  },
  salesforceSubDomain: {
    label: 'Salesforce Sub Domain',
    valueType: 'string',
    value: 'SALESFORCE_SUB_DOMAIN',
    required: true,
    description: '',
  },
  salesforceClientId: {
    label: 'Salesforce Client Id',
    valueType: 'string',
    value: 'SALESFORCE_CLIENT_ID',
    required: true,
    description: '',
  },
  salesforceClientSecret: {
    label: 'Salesforce Client Secret',
    valueType: 'string',
    value: 'SALESFORCE_CLIENT_SECRET',
    required: true,
    description: '',
  },
  salesforceAccountId: {
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
  salesManagoDomain: {
    label: 'SalesManago Domain',
    valueType: 'string',
    value: '',
    required: true,
    description: 'The domain of your SalesManago instance e.g.: app2.salemanago.com',
  },
  salesManagoOwner: {
    label: 'SalesManago Owner',
    valueType: 'string',
    value: 'SALES_MANAGO_OWNER',
    required: true,
    description: '',
  },
  expertSenderVendor: {
    label: 'Expertsender Vendor',
    valueType: 'string',
    value: '',
    required: false,
    description: 'Identifier/name of traffic vendor the subscriber came from.',
  },
  expertSenderApiDomain: {
    label: 'Expertsender API Domain',
    valueType: 'string',
    value: '',
    required: true,
    description:
      'Your Expertsender API Domain, which you can find in Settings > API. E.g.: api.esv2.com',
  },
  expertSenderApiKey: {
    label: 'Expertsender API key',
    valueType: 'string',
    value: 'EXPERTSENDER_API_KEY',
    required: true,
    description: 'Your Expertsender API key, which you can find in Settings > API.',
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
  youLeadAppId: {
    label: 'Youlead App Id',
    valueType: 'string',
    value: 'YOULEAD_APP_ID',
    required: true,
    description: '',
  },
  youLeadClientId: {
    label: 'Youlead Client Id',
    valueType: 'string',
    value: 'YOULEAD_CLIENT_ID',
    required: true,
    description: '',
  },
  youLeadAppSecretKey: {
    label: 'Youlead App Secret Key',
    valueType: 'string',
    value: 'YOULEAD_APP_SECRET_KEY',
    required: true,
    description: '',
  },
  youLeadTag: {
    label: 'Tag',
    valueType: 'string',
    value: '',
    required: false,
    description: 'The tag must first be added in the youlead system Settings -> Tags',
  },
  cleverreachSource: {
    label: 'Source Name',
    valueType: 'string',
    value: '',
    required: false,
    description: 'Define the source name from where the lead got added to.',
  },
  cleverreachListId: {
    label: 'CleverReach List Id',
    valueType: 'string',
    value: 'CLEVERREACH_LIST_ID',
    required: true,
    description: 'Select the list id from CleverReach where the leads should be added to.',
  },
  cleverreachClientId: {
    label: 'CleverReach Client Id',
    valueType: 'string',
    value: 'CLEVERREACH_CLIENT_ID',
    required: true,
    description: 'You can get the CleverReach client id from your CleverReach backend.',
  },
  cleverreachClientSecret: {
    label: 'CleverReach Client Secret',
    valueType: 'string',
    value: 'CLEVERREACH_CLIENT_SECRET',
    required: true,
    description: 'You can get the CleverReach client secret from your CleverReach backend.',
  },
  mailupListId: {
    label: 'Mailup List Id',
    valueType: 'string',
    value: 'MAILUP_LIST_ID',
    required: true,
    description: 'Select the list id from Mailup where the leads should be added to.',
  },
  mailupClientId: {
    label: 'Mailup Client Id',
    valueType: 'string',
    value: 'MAILUP_CLIENT_ID',
    required: true,
    description: 'You can get the Mailup client id from your Mailup backend.',
  },
  mailupClientSecret: {
    label: 'Mailup Client Secret',
    valueType: 'string',
    value: 'MAILUP_CLIENT_SECRET',
    required: true,
    description: 'You can get the Mailup client secret from your Mailup backend.',
  },
  mailupUsername: {
    label: 'Mailup Username',
    valueType: 'string',
    value: 'MAILUP_USERNAME',
    required: true,
    description: 'Your mailup account username.',
  },
  mailupPassword: {
    label: 'Mailup Password',
    valueType: 'string',
    value: 'MAILUP_PASSWORD',
    required: true,
    description: 'Your mailup account password.',
  },
};
