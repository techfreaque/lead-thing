'use client';

import { rem, Title, useMantineTheme } from '@mantine/core';
import { IconMailBolt } from '@tabler/icons-react';
import Link from 'next/link';

import { APP_NAME } from '@/app/_lib/constants';

import classes from './Logo.module.css';

export default function Logo() {
  const theme = useMantineTheme();
  return (
    <Link href="/" style={{ color: 'unset', textDecoration: 'none', display: 'flex' }}>
      <IconMailBolt
        style={{ width: rem(26), height: rem(26), margin: 'auto' }}
        color={theme.colors.blue[6]}
      />{' '}
      <Title className={classes.title}>{APP_NAME}</Title>
    </Link>
  );
}
