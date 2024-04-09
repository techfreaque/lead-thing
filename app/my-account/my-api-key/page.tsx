'use client';

import {
  ActionIcon,
  Container,
  CopyButton,
  Title,
  Tooltip,
  rem,
} from '@mantine/core';
import { useContext } from 'react';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { APP_NAME } from '@/app/constants';
import { UserContext, UserContextType } from '@/app/lib/authentication';

export default function MyKeyPage() {
  const { user } = useContext(UserContext) as UserContextType;

  return (
    <Container my="xl">
      {user ? (
        <>
          <Title ta="center" order={1}>
            Your {APP_NAME} API key:
          </Title>
          <Title ta="center" order={2} mt="xl">
            {user.apiKey}{' '}
            <CopyButton value={user?.apiKey}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
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
        </>
      ) : (
        <>
          <Title order={1}>Sign in to see your {APP_NAME} API key</Title>
        </>
      )}
    </Container>
  );
}
