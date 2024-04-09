'use client';
import { Card, Text, Group, Button, SimpleGrid, Container } from '@mantine/core';
import { IconMailBolt } from '@tabler/icons-react';
import classes from './SubscriptionTiers.module.css';
import { Title2, Title2SubText } from '../Texts/Texts';
import Link from 'next/link';
import { apiDocsPath, registerPath } from '@/app/constants';
import { useContext } from 'react';
import { UserContext, UserContextType } from '@/app/lib/authentication';

export default function SubscriptionTiers() {
  return (
    <Container size="lg">
      <Title2>Get started for free!</Title2>
      <Title2SubText>No credit card required - no strings attached</Title2SubText>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mt="xl">
        <SubscriptionTier title={'Free'} price={0} rebatePercent={0} apiCalls={100} />
        <SubscriptionTier title={'Base'} price={10} rebatePercent={0} apiCalls={750} />
        <SubscriptionTier title={'Pro'} price={20} rebatePercent={25} apiCalls={2000} />
        <SubscriptionTier title={'Enterprise'} price={40} rebatePercent={25} apiCalls={20000} />
      </SimpleGrid>
    </Container>
  );
}
function SubscriptionTier({
  title,
  price,
  rebatePercent,
  apiCalls,
}: {
  title: string;
  price: number;
  apiCalls: number;
  rebatePercent: number;
}) {
  const { user } = useContext(UserContext) as UserContextType;

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
          <Link href={user ? apiDocsPath : registerPath}>
            <Button radius="xl" style={{ flex: 1 }}>
              Sign up
            </Button>
          </Link>
        </Group>
      </Card.Section>
    </Card>
  );
}
