'use client';
import { UserContext, UserContextType } from '@/app/lib/authentication';
import { useContext } from 'react';
import classes from './HomeHeroButton.module.css';
import Link from 'next/link';
import { mySubscriptionUrl, registerPath } from '@/app/constants';
import { Button } from '@mantine/core';

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
