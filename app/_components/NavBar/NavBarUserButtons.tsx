'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { Button } from '@mantine/core';
import { UserContext, UserContextType } from '@/app/_context/authentication';
import { loginPath, mySubscriptionUrl, registerPath } from '@/app/_lib/constants';

export default function NavBarUserButtons() {
  const { user, logout } = useContext(UserContext) as UserContextType;
  return user ? (
    <>
      <Link href={mySubscriptionUrl}>
        <Button>My Account</Button>
      </Link>
      <Button variant="default" onClick={logout}>
        Logout
      </Button>
    </>
  ) : (
    <>
      <Link href={loginPath}>
        <Button variant="default">Log in</Button>
      </Link>
      <Link href={registerPath}>
        <Button>Sign up</Button>
      </Link>
    </>
  );
}
