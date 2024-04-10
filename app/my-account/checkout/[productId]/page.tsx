'use client';

import { Alert, Container, List, Paper, ThemeIcon, Title, rem } from '@mantine/core';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import type { OnApproveData, OnApproveActions } from '@paypal/paypal-js/types/components/buttons';
import { IconCircleCheck, IconInfoCircle } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { RedirectType, redirect } from 'next/navigation';
import { UserContext, UserContextType, UserType } from '@/app/lib/authentication';
import {
  mySubscriptionUrl,
  subscriptionTierIdType,
  subscriptionTierType,
  subscriptionTiers,
} from '@/app/constants';
import { captureRequestBody } from '@/app/api/users/checkout/captureOrder/[orderId]/route';

const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
  'enable-funding': 'venmo,card',
  'disable-funding': 'paylater',
  'data-sdk-integration-source': 'integrationbuilder_sc',
  // debug: true,
};
// TODO https://developer.paypal.com/integration-builder/
export default function Checkout({ params }: { params: { productId: subscriptionTierIdType } }) {
  const productToOrder: subscriptionTierType = subscriptionTiers[params.productId];
  const { user } = useContext(UserContext) as UserContextType;
  const [message, setMessage] = useState<string | undefined>();

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
                <Title order={5}>Subscription Duration: 1 year</Title>
              </List.Item>
              <List.Item>
                <Title order={5}>API Calls per Month: {productToOrder.apiCalls}</Title>
              </List.Item>
              <List.Item>
                <Title order={5}>
                  Total amount due now: {(productToOrder.price * 12).toFixed(2)}$ ({productToOrder.price}$ /
                  month)
                </Title>
              </List.Item>
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
        mr={"auto"}
        ml={"auto"}
        mb={"md"}
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
  async function onCreateOrder(): Promise<string> {
    try {
      const response = await fetch('/api/users/checkout/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // use the "body" param to optionally pass additional order information
        // like product ids and quantities
        body: JSON.stringify({ subscription: productToOrder, email: user.email }),
      });
      const orderData = await response.json();
      if (orderData.id) {
        return orderData.id;
      }
      const errorDetail = orderData?.details?.[0];
      const errorMessage = errorDetail
        ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
        : JSON.stringify(orderData);

      throw new Error(errorMessage);
    } catch (error) {
      console.error(error);
      setMessage(`Could not initiate PayPal Checkout...${error}`);
      throw new Error(`${error}`);
    }
  }
  async function onApprove(data: OnApproveData, actions: OnApproveActions): Promise<void> {
    try {
      const response = await fetch(`/api/users/checkout/captureOrder/${data.orderID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email } as captureRequestBody),
      });
      const orderData = await response.json();
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you message
      const errorDetail = orderData?.details?.[0];
      if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
        // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
        return actions.restart();
      }
      if (errorDetail) {
        // (2) Other non-recoverable errors -> Show a failure message
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL:  actions.redirect('thank_you.html');
        // const transaction = orderData.purchase_units[0].payments.captures[0];
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
      setMessage(`Sorry, your transaction could not be processed...${error}`);
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
        createOrder={onCreateOrder}
        onApprove={onApprove}
      />
    </div>
  );
}
