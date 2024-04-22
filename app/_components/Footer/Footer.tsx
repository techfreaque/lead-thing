'use client';

import { Container, Group, Anchor } from '@mantine/core';
import Link from 'next/link';
import classes from './Footer.module.css';
import Logo from '../Logo/Logo';
import { apiDocsPath, contactPath, tosPath } from '@/app/_lib/constants';

const links = [
  { link: contactPath, label: 'Contact' },
  { link: tosPath, label: 'Terms of Service' },
  { link: apiDocsPath, label: 'API Documentation' },
];

export default function Footer() {
  const items = links.map((link) => (
    <Link href={link.link} style={{ textDecoration: 'none' }} key={link.label}>
      <Anchor<'button'> c="dimmed" component="button" size="sm">
        {link.label}
      </Anchor>
    </Link>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Logo />
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}
