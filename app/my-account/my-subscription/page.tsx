'use client';

import { Alert, Container, Title } from '@mantine/core';
import { Suspense, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { IconInfoCircle } from '@tabler/icons-react';
import { APP_NAME } from '@/app/constants';
import { UserContext, UserContextType } from '@/app/lib/authentication';
import MyOrders from '@/app/components/MyOrders/MyOrders';
import { SubscriptionTiers } from '@/app/components/SubscriptionTiers/SubscriptionTiers';

export default function MySubsPage() {
  const { user } = useContext(UserContext) as UserContextType;

  return (
    user && (
      <Container my="xl">
        <Title ta="center" order={1}>
          Your {APP_NAME} Subscription:
        </Title>
        <Suspense>
          <SuccessAlert />
        </Suspense>
        <SubscriptionTiers user={user} isSubscriptionPage />
        <MyOrders user={user} />
      </Container>
    )
  );
}

function SuccessAlert() {
  const searchParams = useSearchParams();
  const isPaymentSuccess = Boolean(searchParams.get('payment'));
  return (
    isPaymentSuccess && (
      <Alert
        variant="light"
        mt="xl"
        color="green"
        title="Your payment was successful"
        icon={<IconInfoCircle />}
      >
        You're invoice can be downloaded from the list below.
      </Alert>
    )
  );
}
