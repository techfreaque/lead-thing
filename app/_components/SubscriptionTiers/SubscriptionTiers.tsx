'use client';

import { Card, Text, Group, Button, SimpleGrid, Container, SegmentedControl, Badge } from '@mantine/core';
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
  subscriptionDurations,
  subscriptionDurationsType,
  subscriptionTierIdType,
  subscriptionTiers,
} from '@/app/_lib/constants';
import { UserContext, UserContextType, UserType } from '@/app/_context/authentication';
import { apiPeriodType, getCurrentSubscription } from '@/app/_server/orders';

export default function SubscriptionTiersSection() {
  const { user } = useContext(UserContext) as UserContextType;
  return (
    <Container size="lg">
      <Title2>Get started for free!</Title2>
      {/* <Text c="dimmed" className={classes.title2description} ta="center" mt="md">
        Save 20% with a yearly subscription
      </Text> */}
      <SubscriptionTiers
        user={user}
        subTitleText={
          <>
            No credit card required - no strings attached
            <br />
            Upgrade any time, just pick the plan that suits you now and upgrade later!
          </>
        } />
    </Container>
  );
}

export function SubscriptionTiers({
  user,
  isSubscriptionPage,
  subTitleText,
}: {
  user: UserType | undefined;
  isSubscriptionPage?: boolean;
  subTitleText: JSX.Element | string;
}) {
  const [currentSubscription, setCurrentSubscription] = useState<apiPeriodType | undefined>();
  const [subscriptionDuration, setSubscriptionDuration] = useState<subscriptionDurationsType>('yearly');

  useEffect(() => {
    user &&
      getCurrentSubscription({ email: user.email }).then((subscription) => {
        const currentSubscriptionDuration =
          subscriptionTiers[subscription.productId].billingPeriod[0];
        setSubscriptionDuration(currentSubscriptionDuration);
        setCurrentSubscription(subscription);
      }
      );
  }, [user]);
  const canUpgrade = currentSubscription?.productId === 'free';
  return (
    <>
      <Title2SubText>
        {subTitleText}
      </Title2SubText>
      <div style={{ display: 'flex' }}>
        <SegmentedControl
          ml="auto"
          mr="auto"
          mt="md"
          value={subscriptionDuration}
          onChange={(value) => setSubscriptionDuration(value as subscriptionDurationsType)}
          data={subscriptionDurations}
        />
      </div>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} mt="md">
        {(Object.keys(subscriptionTiers) as subscriptionTierIdType[]).map(
          (productId) =>
            !subscriptionTiers[productId].isTesting
            && subscriptionTiers[productId].billingPeriod.includes(subscriptionDuration)
            && (
              <SubscriptionTier
                key={productId}
                active={currentSubscription?.productId === productId}
                productId={productId}
                user={user}
                canUpgrade={canUpgrade}
                isSubscriptionPage={isSubscriptionPage}
                title={subscriptionTiers[productId as subscriptionTierIdType].title}
                price={subscriptionTiers[productId as subscriptionTierIdType].price}
                rebatePercent={subscriptionTiers[productId as subscriptionTierIdType].rebatePercent}
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
    </>

  );
}
function SubscriptionTier({
  title,
  price,
  productId,
  rebatePercent,
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
  rebatePercent: number;
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
          <div style={{ width: '100%' }}>
            <Group justify="space-between" mt="md">

              <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
                €{price}
              </Text>
              {!!rebatePercent && <Badge variant="outline">{rebatePercent}% off</Badge>}
            </Group>
            <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
              per month
            </Text>
          </div>
        </Group>
      </Card.Section>
      <Card.Section className={classes.section}>
        <div>
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
        </div>
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
  currentSubscription: apiPeriodType | undefined;
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
        rebatePercent={subscriptionTiers.testing.rebatePercent}
        apiCalls={subscriptionTiers.testing.apiCalls}
      />
    )
  );
}
