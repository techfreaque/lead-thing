'use client';

import { Container, Title } from '@mantine/core';
import { useContext } from 'react';
import { APP_NAME } from '@/app/constants';
import { UserContext, UserContextType } from '@/app/lib/authentication';
import MyOrders from '@/app/components/MyOrders/MyOrders';
import { SubscriptionTiers } from '@/app/components/SubscriptionTiers/SubscriptionTiers';

export default function MyKeyPage() {
  const { user } = useContext(UserContext) as UserContextType;

  return (
    user && (
      <Container my="xl">
        <Title ta="center" order={1}>
          Your {APP_NAME} Subscription:
        </Title>
        <SubscriptionTiers user={user} />
        <MyOrders user={user} />
      </Container>
    )
  );
}
