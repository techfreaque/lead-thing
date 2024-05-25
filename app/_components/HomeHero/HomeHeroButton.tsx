'use client';

import { Button } from '@mantine/core';
import Link from 'next/link';
import { useContext } from 'react';

import { UserContext, UserContextType } from '@/app/_context/authentication';
import { mySubscriptionUrl, registerPath } from '@/app/_lib/constants';

import classes from './HomeHeroButton.module.css';

export default function HomeHeroButton() {
  const { user } = useContext(UserContext) as UserContextType;
  return (
    <Link href={user ? mySubscriptionUrl : registerPath}>
      <Button
        size="xl"
        className={classes.control}
        variant="gradient"
        gradient={{ from: 'blue', to: 'cyan' }}
      >
        Get started today!
      </Button>
    </Link>
  );
}
