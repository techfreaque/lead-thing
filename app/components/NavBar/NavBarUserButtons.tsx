'use client';
import { apiDocsPath, loginPath, registerPath } from '@/app/constants';
import { UserContext, UserContextType } from '@/app/lib/authentication';
import { Button } from '@mantine/core';
import Link from 'next/link';
import { useContext } from 'react';

export default function NavBarUserButtons() {
  const { user, logout } = useContext(UserContext) as UserContextType;
  return user ? (
    <>
      <Link href={apiDocsPath}>
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
