'use client';
import { subscriptionTierIdType, subscriptionTierType, subscriptionTiers } from '@/app/constants';
import { UserContext, UserContextType, UserType } from '@/app/lib/authentication';
import { Container, List, Paper, ThemeIcon, Title, rem } from '@mantine/core';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { IconCircleCheck } from '@tabler/icons-react';
import { useContext, useState } from 'react';

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

  return (
    user && (
      <Container my="xl">
        <Paper withBorder shadow="md" p={30} radius="md" mt={10}>
          <PayPalScriptProvider options={initialOptions}>
            <Title order={1} ta="center" my={'xl'}>
              Complete your Purchase now
            </Title>
            <List
              spacing="xs"
              size="sm"
              center
              my={'xl'}
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
                  Total amount due now: {productToOrder.price * 12}$ ({productToOrder.price}$ /
                  month)
                </Title>
              </List.Item>
            </List>
            <Paypal productToOrder={productToOrder} user={user} />
          </PayPalScriptProvider>
        </Paper>
      </Container>
    )
  );
}

function Message({ content }: { content: string }) {
  return <p>{content}</p>;
}

function Paypal({
  productToOrder,
  user,
}: {
  productToOrder: subscriptionTierType;
  user: UserType;
}) {
  const [message, setMessage] = useState<string>('');

  return (
    <div style={{ colorScheme: 'none', margin: 'auto', maxWidth: '500px' }}>
      <PayPalButtons
        style={{
          shape: 'rect',
          // layout: 'vertical',
          // color: 'black',
          disableMaxWidth: false,
        }}
        createOrder={async () => {
          try {
            console.log('dsdjkdsjfsdjk');
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
            } else {
              const errorDetail = orderData?.details?.[0];
              const errorMessage = errorDetail
                ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                : JSON.stringify(orderData);

              throw new Error(errorMessage);
            }
          } catch (error) {
            console.error(error);
            setMessage(`Could not initiate PayPal Checkout...${error}`);
          }
        }}
        onApprove={async (data, actions) => {
          try {
            const response = await fetch(`/api/users/checkout/captureOrders/${data.orderID}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
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
            } else if (errorDetail) {
              // (2) Other non-recoverable errors -> Show a failure message
              throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
            } else {
              // (3) Successful transaction -> Show confirmation or thank you message
              // Or go to another URL:  actions.redirect('thank_you.html');
              const transaction = orderData.purchase_units[0].payments.captures[0];
              setMessage(
                `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
              );
              console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
            }
          } catch (error) {
            console.error(error);
            setMessage(`Sorry, your transaction could not be processed...${error}`);
          }
        }}
      />
      <Message content={message} />
    </div>
  );
}