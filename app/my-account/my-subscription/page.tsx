'use client';

import { Container, Title } from '@mantine/core';
import { useContext } from 'react';
import { APP_NAME } from '@/app/constants';
import { UserContext, UserContextType } from '@/app/lib/authentication';

export default function MyKeyPage() {
  const { user } = useContext(UserContext) as UserContextType;

  return (
    <Container my="xl">
      <Title ta="center" order={1}>
        Your {APP_NAME} Subscription:
      </Title>
    </Container>
  );
}
