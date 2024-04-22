'use client';

import { Alert, Container, Title } from '@mantine/core';
import { Suspense, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { IconInfoCircle } from '@tabler/icons-react';
import { APP_NAME } from '@/app/_lib/constants';
import { UserContext, UserContextType } from '@/app/_context/authentication';
import MyOrders from '@/app/_components/MyOrders/MyOrders';
import { SubscriptionTiers } from '@/app/_components/SubscriptionTiers/SubscriptionTiers';

export default function MySubsPage() {
  const { user } = useContext(UserContext) as UserContextType;

  return (
    user && (
      <Container size="lg" my="xl">
        <Title ta="center" order={1}>
          Your {APP_NAME} Subscription:
        </Title>
        <Suspense>
          <SuccessAlert />
        </Suspense>
        <SubscriptionTiers
          user={user}
          isSubscriptionPage
          subTitleText="Upgrade any time, just pick the plan that suits you now and upgrade later!"
        />
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
        mx="auto"
        w={500}
        color="green"
        title="Your payment was successful"
        icon={<IconInfoCircle />}
      >
        You&apos;re invoice can be downloaded from the list below.
      </Alert>
    )
  );
}
