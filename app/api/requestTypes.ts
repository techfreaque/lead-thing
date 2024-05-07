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

export interface EmarsysPostRequest extends PostRequest {
  // gender: 'MALE' | 'FEMALE';
  // countryCode: string;
  // salutation: string;
  listId: string;
  // subscriptionMode: 'FORCE_OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group.
  // FORCE_OPT_IN
  //  New contacts are added to the group with a notification if the system supports it / its enabled.
  emarsysSubDomain: string;
  emarsysUserName: string;
  emarsysApiKey: string;
}

export interface MappPostRequest extends PostRequest {
  // ip: string;
  gender?: 'MALE' | 'FEMALE';
  countryCode?: string;
  // salutation: string;
  // tag: string;
  listId: string;
  languageCode?: string;
  subscriptionMode: 'FORCE_OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group.
  // FORCE_OPT_IN
  //  New contacts are added to the group with a notification if the system supports it / its enabled.
  mappUsername: string;
  mappPassword: string;
  mappDomain: string;
  mappCustomAttributes: string;
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
  gender?: 'MALE' | 'FEMALE';
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

export interface MailupPostRequest extends PostRequest {
  // ip: string;
  gender?: 'MALE' | 'FEMALE';
  // countryCode: string;
  // salutation: string;
  subscriptionMode: 'FORCE_OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group.
  // FORCE_OPT_IN
  //  New contacts are added to the group with a notification if the system supports it / its enabled.

  mailupListId: string;
  mailupClientId: string;
  mailupClientSecret: string;
  mailupUsername: string;
  mailupPassword: string;
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
  salesforceSubDomain: string;
  salesforceClientId: string;
  salesforceClientSecret: string;
  salesforceAccountId: string;
}

export interface AdobeCampaignPostRequest extends PostRequest {
  // ip: string;
  // gender: 'MALE' | 'FEMALE';
  // countryCode: string;
  // salutation: string;
  // tag: string;
  // subscriptionMode: 'FORCE_OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group.
  // FORCE_OPT_IN
  //  New contacts are added to the group with a notification if the system supports it / its enabled.
  adobeCampaignClientId: string;
  adobeCampaignClientSecret: string;
  adobeCampaignOrganizationId: string;
  adobeCampaignApiKey: string;
  adobeCampaignListId: string;
}

export interface SalesmanagoPostRequest extends PostRequest {
  // ip: string;
  // gender: 'MALE' | 'FEMALE';
  countryCode?: string;
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
  salesManagoDomain: string;
  salesManagoOwner: string;
}

export interface ExpertsenderPostRequest extends PostRequest {
  ip: string;
  gender?: 'MALE' | 'FEMALE';
  countryCode?: string;
  // salutation: string;
  // tag: string;
  listId: string;
  expertSenderVendor: string;
  expertSenderApiDomain: string;
  expertSenderApiKey: string;
}

export interface AllPossiblePostRequestParameters
  extends GetresponsePostRequest,
    MappPostRequest,
    SailthruPostRequest,
    SalesforcePostRequest,
    EmarsysPostRequest,
    YouleadPostRequest,
    CleverreachPostRequest,
    MailupPostRequest,
    FreshmailPostRequest,
    AdobeCampaignPostRequest,
    ExpertsenderPostRequest,
    SalesmanagoPostRequest {}
