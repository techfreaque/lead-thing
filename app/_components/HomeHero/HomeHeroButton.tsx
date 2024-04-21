'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { Button } from '@mantine/core';
import { UserContext, UserContextType } from '@/app/_context/authentication';
import classes from './HomeHeroButton.module.css';
import { mySubscriptionUrl, registerPath } from '@/app/_lib/constants';

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
