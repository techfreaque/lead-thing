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

export interface FreshmailPostRequest extends PostRequest {
  // ip: string;
  // gender: 'MALE' | 'FEMALE';
  // countryCode: string;
  // salutation: string;
  // tag: string;
  listHash: string;
  subscriptionMode: 'FORCE_OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group.
  // FORCE_OPT_IN
  //  New contacts are added to the group with a notification if the system supports it / its enabled.
  freshmailApiKey: string;
  freshmailApiSecret: string;
}

export interface YouleadPostRequest extends PostRequest {
  // ip: string;
  // gender: 'MALE' | 'FEMALE';
  // countryCode: string;
  // salutation: string;
  youLeadTag: string;
  subscriptionMode: 'FORCE_OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group.
  // FORCE_OPT_IN
  //  New contacts are added to the group with a notification if the system supports it / its enabled.
  youLeadAppId: string;
  youLeadClientId: string;
  youLeadAppSecretKey: string;
}

export interface CleverreachPostRequest extends PostRequest {
  // ip: string;
  gender: 'MALE' | 'FEMALE';
  // countryCode: string;
  // salutation: string;
  subscriptionMode: 'FORCE_OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group.
  // FORCE_OPT_IN
  //  New contacts are added to the group with a notification if the system supports it / its enabled.

  cleverreachListId: string;
  cleverreachSource: string;
  cleverreachClientId: string;
  cleverreachClientSecret: string;
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
  YouleadPostRequest,
  CleverreachPostRequest,
  FreshmailPostRequest,
  SalesmanagoPostRequest {
  gender: 'MALE' | 'FEMALE';
}
