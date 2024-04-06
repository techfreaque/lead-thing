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
  // subscriptionMode: 'OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group. A double opt-in subscription.
  // OPT_IN
  //  New contacts are added to the group without notification. OPT_IN is creating self-subscribers.
  tagId?: string;
  getresponseApiKey: string;
}

export interface MappPostRequest extends PostRequest {
  // ip: string;
  // gender: 'MALE' | 'FEMALE';
  countryCode: string;
  // salutation: string;
  // tag: string;
  listId: string | number;
  subscriptionMode: 'OPT_IN' | 'DOUBLE_OPT_IN' | 'CONFIRMED_OPT_IN';
  // CONFIRMED_OPT_IN
  //  New contacts receive a welcome message via email when they are added to the group. The contact does not need to confirm the subscription. A single opt-in subscription.
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group. A double opt-in subscription.
  // OPT_IN
  //  New contacts are added to the group without notification. OPT_IN is creating self-subscribers.
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
  // subscriptionMode: 'OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group. A double opt-in subscription.
  // OPT_IN
  //  New contacts are added to the group without notification. OPT_IN is creating self-subscribers.
  sailthruApiKey: string;
  sailthruSecret: string;
}

export interface SalesforcePostRequest extends PostRequest {
  // ip: string;
  // gender: 'MALE' | 'FEMALE';
  // countryCode: string;
  // salutation: string;
  // tag: string;
  listId: string | number;
  // subscriptionMode: 'OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group. A double opt-in subscription.
  // OPT_IN
  //  New contacts are added to the group without notification. OPT_IN is creating self-subscribers.
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
  subscriptionMode: 'OPT_IN' | 'DOUBLE_OPT_IN';
  // DOUBLE_OPT_IN
  //  New contacts receive an invitation to join the group via email. The contact must accept the invitation before they are added to the group. A double opt-in subscription.
  // OPT_IN
  //  New contacts are added to the group without notification. OPT_IN is creating self-subscribers.
  salesManagoClientId: string;
  salesManagoApiKey: string;
  salesManagoSha: string;
  salesManagoSubDomain: string;
  salesManagoOwner: string;
}
