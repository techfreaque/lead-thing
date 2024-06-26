'use client';

import { Alert, Container, List, Paper, rem, ThemeIcon, Title } from '@mantine/core';
import type { OnApproveData } from '@paypal/paypal-js/types/components/buttons';
import {
  PayPalButtons,
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from '@paypal/react-paypal-js';
import { IconCircleCheck, IconInfoCircle } from '@tabler/icons-react';
import { redirect, RedirectType } from 'next/navigation';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

import { UserContext, UserContextType, UserType } from '@/app/_context/authentication';
import {
  mySubscriptionUrl,
  subscriptionTierIdType,
  subscriptionTiers,
  subscriptionTierType,
} from '@/app/_lib/constants';
import { getTotalPriceForSubscription } from '@/app/_lib/helpers';
import {
  apiPeriodType,
  getCurrentSubscription,
  getOrderFromSubscription,
  markAsPaidBody,
  PaidOrderType,
} from '@/app/_server/orders';
import { startPaymentBody } from '@/app/api/user/payment/create/route';

const initialOptions: ReactPayPalScriptOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  'enable-funding': 'paylater,card',
  'disable-funding': '',
  'data-sdk-integration-source': 'integrationbuilder_sc',
  vault: 'true',
  intent: 'subscription',
  currency: 'EUR',
  // debug: true,
};
export default function Checkout({ params }: { params: { productId: subscriptionTierIdType } }) {
  const productToOrder: subscriptionTierType = subscriptionTiers[params.productId];
  const { user } = useContext(UserContext) as UserContextType;
  const [message, setMessage] = useState<string | undefined>();
  const [currentSubscriptionOrder, setCurrentSubscriptionOrder] = useState<PaidOrderType | null>(
    null
  );
  const [currentSubscription, setCurrentSubscription] = useState<apiPeriodType | undefined>();
  const { isYearly, totalPrice, rebateValuePreviousOrder } = getTotalPriceForSubscription(
    productToOrder,
    currentSubscription,
    currentSubscriptionOrder
  );

  useEffect(() => {
    user &&
      getCurrentSubscription({ email: user.email }).then((subscription) => {
        getOrderFromSubscription(subscription).then((order) => {
          setCurrentSubscriptionOrder(order);
          setCurrentSubscription(subscription);
        });
      });
  }, [user]);

  return (
    user && (
      <Container my="xl">
        <Paper withBorder shadow="md" p={30} radius="md" mt={10}>
          <PayPalScriptProvider options={initialOptions}>
            <Title order={1} ta="center" my="xl">
              Complete your Purchase now
            </Title>
            <List
              spacing="xs"
              size="sm"
              center
              my="xl"
              style={{ maxWidth: '400px', margin: 'auto' }}
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <Title order={5}>Subscription Tier: {productToOrder.title}</Title>
              </List.Item>
              <List.Item>
                <Title order={5}>Subscription Duration: {isYearly ? '1 year' : '1 month'}</Title>
              </List.Item>
              <List.Item>
                <Title order={5}>API Calls per Month: {productToOrder.apiCalls}</Title>
              </List.Item>
              {rebateValuePreviousOrder ? (
                <>
                  <List.Item>
                    <Title order={5}>
                      Subscription amount: {totalPrice}€{' '}
                      {isYearly ? `(${productToOrder.price}€ / month)` : ''}
                    </Title>
                  </List.Item>
                  <List.Item>
                    <Title order={5}>
                      Balance from previous order: {-rebateValuePreviousOrder}€
                    </Title>
                  </List.Item>
                  <List.Item>
                    <Title order={5}>
                      Total amount due now: {totalPrice - rebateValuePreviousOrder}€
                    </Title>
                  </List.Item>
                </>
              ) : (
                <List.Item>
                  <Title order={5}>
                    Total amount due now: {totalPrice}€{' '}
                    {isYearly ? `(${productToOrder.price}€ / month)` : ''}
                  </Title>
                </List.Item>
              )}
            </List>
            <Message message={message} />
            <Paypal productToOrder={productToOrder} user={user} setMessage={setMessage} />
          </PayPalScriptProvider>
        </Paper>
      </Container>
    )
  );
}

function Message({ message }: { message?: string | undefined }) {
  return (
    message && (
      <Alert
        variant="light"
        mt="xl"
        color="red"
        title="We're sorry but there was an issue with the payment"
        icon={<IconInfoCircle />}
        maw={500}
        mr="auto"
        ml="auto"
        mb="md"
      >
        {message}
      </Alert>
    )
  );
}

function Paypal({
  productToOrder,
  user,
  setMessage,
}: {
  productToOrder: subscriptionTierType;
  user: UserType;
  setMessage: Dispatch<SetStateAction<string | undefined>>;
}) {
  const [success, setSuccess] = useState<boolean>(false);
  useEffect(() => {
    success && redirect(`${mySubscriptionUrl}?payment=success`, RedirectType.replace);
  }, [success]);
  async function onCreateSubscription() {
    try {
      const payload: startPaymentBody = {
        product: productToOrder,
        email: user.email,
      };
      const response = await fetch('/api/user/payment/create', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data?.data?.id) {
        setMessage('Successful subscription...');
        return data.data.id;
      }
      setMessage(`Could not initiate PayPal Subscription...${JSON.stringify(data)}`);
    } catch (error) {
      setMessage(`Could not initiate PayPal Subscription...${error}`);
    }
    return undefined;
  }
  async function onApprove(data: OnApproveData) {
    /*
      No need to activate manually since SUBSCRIBE_NOW is being used.
      Learn how to handle other user actions from our docs:
      https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_create
    */
    if (data.subscriptionID) {
      try {
        const payload: markAsPaidBody = {
          email: user.email,
          subscriptionId: data.subscriptionID,
          transactionId: data.orderID,
          productId: productToOrder.productId,
        };
        await fetch('/api/user/payment/confirm', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      } catch (error) {
        setMessage(`Failed to mark the subscription as paid: ${data.subscriptionID}`);
      }
      setSuccess(true);
      setMessage(
        `You have successfully subscribed to the plan. Your subscription id is: ${data.subscriptionID}`
      );
    } else {
      setMessage(`Failed to activate the subscription: ${data.subscriptionID}`);
    }
    return undefined;
  }
  return (
    <div style={{ colorScheme: 'none', margin: 'auto', maxWidth: '500px' }}>
      <PayPalButtons
        style={{
          shape: 'rect',
          disableMaxWidth: false,
        }}
        createSubscription={onCreateSubscription}
        onApprove={onApprove}
      />
    </div>
  );
}
