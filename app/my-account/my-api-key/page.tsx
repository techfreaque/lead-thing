'use client';

import { Container, Paper, Title } from '@mantine/core';
import { useContext } from 'react';
import { APP_NAME } from '@/app/constants';
import { UserContext, UserContextType } from '@/app/lib/authentication';

export default function MyKeyPage() {
  const { user } = useContext(UserContext) as UserContextType;

  return (
    <Container>
      {user ? (
        <>
          <Title order={1}>Your {APP_NAME} API key:</Title>
          <Title order={2}>{user?.apiKey}</Title>
        </>
      ) : (
        <>
          <Title order={1}>Sign in to see your {APP_NAME} API key</Title>
        </>
      )}
    </Container>
  );
}
