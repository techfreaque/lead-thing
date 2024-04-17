'use client';

import { Card, Text, Group, Button, SimpleGrid, Container } from '@mantine/core';
import { IconMailBolt } from '@tabler/icons-react';
import Link from 'next/link';
import { Suspense, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import classes from './SubscriptionTiers.module.css';
import { Title2, Title2SubText } from '../Texts/Texts';
import {
  checkoutUrl,
  mySubscriptionUrl,
  registerPath,
  subscriptionTierIdType,
  subscriptionTiers,
} from '@/app/constants';
import { UserContext, UserContextType, UserType } from '@/app/lib/authentication';
import { OrderType, getCurrentSubscription } from '@/app/lib/orders';

export default function SubscriptionTiersSection() {
  const { user } = useContext(UserContext) as UserContextType;
  return (
    <Container size="lg">
      <Title2>Get started for free!</Title2>
      <Title2SubText>No credit card required - no strings attached</Title2SubText>
      <SubscriptionTiers user={user} />
    </Container>
  );
}

export function SubscriptionTiers({
  user,
  isSubscriptionPage,
}: {
  user: UserType | undefined;
  isSubscriptionPage?: boolean;
}) {
  const [currentSubscription, setCurrentSubscription] = useState<OrderType | undefined>();
  useEffect(() => {
    user &&
      getCurrentSubscription(user.email).then((subscription) =>
        setCurrentSubscription(subscription)
      );
  }, [user]);
  const canUpgrade = currentSubscription?.productId === 'free';
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} mt="xl">
      {Object.keys(subscriptionTiers).map(
        (productId) =>
          !subscriptionTiers[productId as subscriptionTierIdType].isTesting && (
            <SubscriptionTier
              key={productId}
              active={currentSubscription?.productId === productId}
              productId={productId as subscriptionTierIdType}
              user={user}
              canUpgrade={canUpgrade}
              isSubscriptionPage={isSubscriptionPage}
              title={subscriptionTiers[productId as subscriptionTierIdType].title}
              price={subscriptionTiers[productId as subscriptionTierIdType].price}
              // rebatePercent={subscriptionTiers[productId as subscriptionTierIdType].rebatePercent}
              apiCalls={subscriptionTiers[productId as subscriptionTierIdType].apiCalls}
            />
          )
      )}
      <Suspense>
        <TestingProduct
          currentSubscription={currentSubscription}
          user={user}
          canUpgrade={canUpgrade}
          isSubscriptionPage={isSubscriptionPage}
        />
      </Suspense>
    </SimpleGrid>
  );
}
function SubscriptionTier({
  title,
  price,
  productId,
  // rebatePercent,
  active,
  canUpgrade,
  user,
  apiCalls,
  isSubscriptionPage,
}: {
  productId: subscriptionTierIdType;
  title: string;
  price: number;
  apiCalls: number;
  active: boolean;
  canUpgrade: boolean;
  // rebatePercent: number;
  user: UserType | undefined;
  isSubscriptionPage?: boolean;
}) {
  return (
    <Card withBorder radius="md" className={classes.card}>
      <Group justify="space-between" mt="md">
        <div>
          <Text fw={500}>{title}</Text>
          {/* <Text fz="xs" c="dimmed">
            Free recharge at any station
          </Text> */}
        </div>
        {/* {!!rebatePercent&&<Badge variant="outline">{rebatePercent}% off</Badge>} */}
      </Group>

      <Card.Section className={classes.section} mt="md">
        <div style={{ display: 'flex' }}>
          <IconMailBolt size="1.05rem" className={classes.icon} stroke={1.5} />
          <Text fz="sm" c="dimmed" className={classes.label}>
            {apiCalls} API calls / month
          </Text>
        </div>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Group gap={30}>
          <div>
            <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
              €{price}
            </Text>
            <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
              per month
            </Text>
          </div>
          {active ? (
            <Button disabled radius="xl" style={{ flex: 1 }}>
              Active
            </Button>
          ) : (
            <Link
              href={
                user
                  ? isSubscriptionPage
                    ? checkoutUrl + productId
                    : mySubscriptionUrl
                  : registerPath
              }
            >
              <Button disabled={!canUpgrade} radius="xl" style={{ flex: 1 }}>
                {user ? 'Upgrade' : 'Sign up'}
              </Button>
            </Link>
          )}
        </Group>
      </Card.Section>
    </Card>
  );
}

function TestingProduct({
  currentSubscription,
  user,
  canUpgrade,
  isSubscriptionPage,
}: {
  canUpgrade: boolean;
  user: UserType | undefined;
  isSubscriptionPage?: boolean;
  currentSubscription: OrderType | undefined;
}) {
  const searchParams = useSearchParams();
  const isTesting = Boolean(searchParams.get('testing'));
  return (
    isSubscriptionPage &&
    isTesting && (
      <SubscriptionTier
        key={subscriptionTiers.testing.productId}
        active={currentSubscription?.productId === subscriptionTiers.testing.productId}
        productId={subscriptionTiers.testing.productId}
        user={user}
        canUpgrade={canUpgrade}
        isSubscriptionPage={isSubscriptionPage}
        title={subscriptionTiers.testing.title}
        price={subscriptionTiers.testing.price}
        // rebatePercent={subscriptionTiers[productId as subscriptionTierIdType].rebatePercent}
        apiCalls={subscriptionTiers.testing.apiCalls}
      />
    )
  );
}
