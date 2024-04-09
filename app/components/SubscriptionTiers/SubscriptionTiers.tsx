'use client';
import { Card, Text, Group, Button, SimpleGrid, Container } from '@mantine/core';
import { IconMailBolt } from '@tabler/icons-react';
import classes from './SubscriptionTiers.module.css';
import { Title2, Title2SubText } from '../Texts/Texts';
import Link from 'next/link';
import {
  mySubscriptionUrl,
  registerPath,
  subscriptionTierIdType,
  subscriptionTiers,
} from '@/app/constants';
import { useContext, useEffect, useState } from 'react';
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

export function SubscriptionTiers({ user }: { user: UserType | undefined }) {
  const [currentSubscription, setCurrentSubscription] = useState<OrderType | undefined>();
  console.log(currentSubscription);
  useEffect(() => {
    user &&
      getCurrentSubscription(user.email).then((subscription) =>
        setCurrentSubscription(subscription)
      );
  }, [user]);
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mt="xl">
      {Object.keys(subscriptionTiers).map((productId) => (
        <SubscriptionTier
          key={productId}
          active={currentSubscription?.productId === productId}
          productId={productId as subscriptionTierIdType}
          user={user}
          title={subscriptionTiers[productId as subscriptionTierIdType].title}
          price={subscriptionTiers[productId as subscriptionTierIdType].price}
          // rebatePercent={subscriptionTiers[productId as subscriptionTierIdType].rebatePercent}
          apiCalls={subscriptionTiers[productId as subscriptionTierIdType].apiCalls}
        />
      ))}
    </SimpleGrid>
  );
}
function SubscriptionTier({
  title,
  price,
  productId,
  // rebatePercent,
  active,
  user,
  apiCalls,
}: {
  productId: subscriptionTierIdType;
  title: string;
  price: number;
  apiCalls: number;
  active: boolean;
  // rebatePercent: number;
  user: UserType | undefined;
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
            {apiCalls} API calls per month
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
          <Link href={user ? mySubscriptionUrl : registerPath}>
            {active ? (
              <Button disabled radius="xl" style={{ flex: 1 }}>
                Active
              </Button>
            ) : (
              <Button radius="xl" style={{ flex: 1 }}>
                {user ? 'Upgrade' : 'Sign up'}
              </Button>
            )}
          </Link>
        </Group>
      </Card.Section>
    </Card>
  );
}
