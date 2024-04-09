'use client';
import { UserContext, UserContextType } from '@/app/lib/authentication';
import { useContext } from 'react';
import classes from './HomeHeroButton.module.css';
import Link from 'next/link';
import { apiDocsPath, registerPath } from '@/app/constants';
import { Button } from '@mantine/core';

export default function HomeHeroButton() {
  const { user } = useContext(UserContext) as UserContextType;
  return (
    <Link href={user ? apiDocsPath : registerPath}>
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
