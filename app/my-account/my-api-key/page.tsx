'use client';

import {
  ActionIcon,
  Container,
  CopyButton,
  rem,
  Table,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';

import {
  UserContext,
  UserContextType,
  UserType,
} from '@/app/_context/authentication';
import { APP_NAME, subscriptionTiers } from '@/app/_lib/constants';
import {
  apiPeriodType,
  getAllSubscriptionPeriods,
  getCurrentSubscription,
} from '@/app/_server/orders';

export default function MyKeyPage() {
  const { user } = useContext(UserContext) as UserContextType;
  return (
    <Container my="xl">
      {user ? (
        <>
          <Title ta="center" order={1}>
            Your {APP_NAME} API key:
          </Title>
          <Title ta="center" order={3} mt="md">
            {user.apiKey}{' '}
            <CopyButton value={user?.apiKey}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? 'Copied' : 'Copy'}
                  withArrow
                  position="right"
                >
                  <ActionIcon
                    color={copied ? 'teal' : 'gray'}
                    variant="subtle"
                    onClick={copy}
                  >
                    {copied ? (
                      <IconCheck style={{ width: rem(16) }} />
                    ) : (
                      <IconCopy style={{ width: rem(16) }} />
                    )}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Title>
          <Stats user={user} />
        </>
      ) : (
        <Title ta="center" order={1}>
          Sign in to see your {APP_NAME} API key
        </Title>
      )}
    </Container>
  );
}

function Stats({ user }: { user: UserType }) {
  const [stats, setStats] = useState<apiPeriodType[]>();
  useEffect(() => {
    // get current one to update in case not used for months
    getCurrentSubscription({ email: user.email });
    getAllSubscriptionPeriods({
      email: user.email,
    }).then((_stats) => setStats(_stats));
  }, []);
  return (
    <>
      <Title ta="center" mt="xl" order={2}>
        Your API calls stats
      </Title>
      <Table my="xl">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Subscription Tier</Table.Th>
            <Table.Th>Valid From</Table.Th>
            <Table.Th>Valid Until</Table.Th>
            <Table.Th>API calls / month</Table.Th>
            <Table.Th>API calls in this month</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {stats?.map((element) => (
            <Table.Tr key={element.id}>
              <Table.Td>{subscriptionTiers[element.productId].title}</Table.Td>
              <Table.Td>{element.validFrom.toDateString()}</Table.Td>
              <Table.Td>{element.validUntil.toDateString() || ''}</Table.Td>
              <Table.Td>{element.apiCallsPerMonth}</Table.Td>
              <Table.Td>{element.apiCallsInThisPeriod}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}
