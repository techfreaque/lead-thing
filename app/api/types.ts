export interface PostRequest {
  firstname: string;
  lastname: string;
  email: string;
}

export interface GetresponsePostRequest extends PostRequest {
  ip: string;
  // gender: 'MALE' | 'FEMALE';
  // countryCode: string;
  // salutation: string;
  listId: string;
  // subscriptionMode: 'FORCE_OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group.
  // FORCE_OPT_IN
  //  New contacts are added to the group with a notification if the system supports it / its enabled.
  tagId?: string;
  getresponseApiKey: string;
}

export interface MappPostRequest extends PostRequest {
  // ip: string;
  // gender: 'MALE' | 'FEMALE';
  countryCode: string;
  // salutation: string;
  // tag: string;
  listId: string;
  subscriptionMode: 'FORCE_OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group.
  // FORCE_OPT_IN
  //  New contacts are added to the group with a notification if the system supports it / its enabled.
  mappUsername: string;
  mappPassword: string;
  mappDomain: string;
}

export interface SailthruPostRequest extends PostRequest {
  // ip: string;
  // gender: 'MALE' | 'FEMALE';
  // countryCode: string;
  // salutation: string;
  // tag: string;
  listName: string;
  // subscriptionMode: 'FORCE_OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group.
  // FORCE_OPT_IN
  //  New contacts are added to the group with a notification if the system supports it / its enabled.
  sailthruApiKey: string;
  sailthruSecret: string;
}

export interface SalesforcePostRequest extends PostRequest {
  // ip: string;
  // gender: 'MALE' | 'FEMALE';
  // countryCode: string;
  // salutation: string;
  // tag: string;
  listId: string;
  // subscriptionMode: 'FORCE_OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group.
  // FORCE_OPT_IN
  //  New contacts are added to the group with a notification if the system supports it / its enabled.
  SalesforceSubDomain: string;
  SalesforceClientId: string;
  SalesforceClientSecret: string;
  SalesforceAccountId: string;
}

export interface SalesmanagoPostRequest extends PostRequest {
  // ip: string;
  // gender: 'MALE' | 'FEMALE';
  countryCode: string;
  // salutation: string;
  tag: string;
  // listId: string | number;
  subscriptionMode: 'FORCE_OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group.
  // FORCE_OPT_IN
  //  New contacts are added to the group with a notification if the system supports it / its enabled.
  salesManagoClientId: string;
  salesManagoApiKey: string;
  salesManagoSha: string;
  salesManagoSubDomain: string;
  salesManagoOwner: string;
}

export interface AllPossiblePostRequestParameters
  extends GetresponsePostRequest,
    MappPostRequest,
    SailthruPostRequest,
    SalesforcePostRequest,
    SalesmanagoPostRequest {
  gender: 'MALE' | 'FEMALE';
}

export type avialableSystemsType =
  | 'getresponse'
  | 'mapp'
  | 'sailthru'
  | 'salesforce'
  | 'salesmanago';

export type availableRequestProperties =
  | 'firstname'
  | 'lastname'
  | 'email'
  | 'ip'
  | 'gender'
  | 'countryCode'
  | 'subscriptionMode'
  | 'listId'
  | 'listName'
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
  | 'salesManagoClientId'
  | 'salesManagoApiKey'
  | 'salesManagoSha'
  | 'salesManagoSubDomain'
  | 'salesManagoOwner';
