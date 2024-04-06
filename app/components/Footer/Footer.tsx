'use client';
import { Container, Group, Anchor } from '@mantine/core';
import classes from './Footer.module.css';
import Logo from '../Logo/Logo';
import Link from 'next/link';
import { apiDocsPath, contactPath, tosPath } from '@/app/constants';

const links = [
  { link: contactPath, label: 'Contact' },
  { link: tosPath, label: 'Terms of Service' },
  { link: apiDocsPath, label: 'API Documentation' },
  // { link: '#', label: 'Careers' },
];

export default function Footer() {
  const items = links.map((link) => (
    <Link href={link.link} style={{ textDecoration: 'none' }} key={link.label}>
      <Anchor<'button'>
        c="dimmed"
        component='button'
        size="sm"
      >
        {link.label}
      </Anchor>
    </Link>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Logo size={28} />
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}
