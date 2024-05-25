'use client';

import {
  Alert,
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  rem,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconInfoCircle } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

import { loginPath } from '@/app/_lib/constants';
import { resetPassword } from '@/app/_server/resetPassword';

import { TitleUserForm } from '../Texts/Texts';
import classes from './ResetPassword.module.css';

export default function ResetPassword() {
  const [formSent, setFormSent] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      email: '',
    },

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
    },
  });
  async function onSubmit() {
    await resetPassword(form.values.email);
    setFormSent(true);
  }
  return formSent ? (
    <Container size={460} my={30}>
      <Alert
        variant="light"
        mt="md"
        color="blue"
        title="Your password reset link is on the way!"
        icon={<IconInfoCircle />}
      >
        If you&apos;re email is registered, you will receive a password reset link shortly. Just
        click on it to finish resetting your password.
      </Alert>
    </Container>
  ) : (
    <Container size={460} my={30}>
      <TitleUserForm>Forgot your password?</TitleUserForm>
      <Text c="dimmed" fz="sm" ta="center">
        Enter your email to get a reset link
      </Text>
      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form
          onSubmit={form.onSubmit(() => {
            onSubmit();
          })}
        >
          <TextInput
            label="Your email"
            placeholder={process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
            required
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
          />
          <Group justify="space-between" mt="lg" className={classes.controls}>
            <Link href={loginPath}>
              <Anchor c="dimmed" size="sm" component="button" className={classes.control}>
                <Center inline>
                  <IconArrowLeft style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                  <Box ml={5}>Back to the login page</Box>
                </Center>
              </Anchor>
            </Link>
            <Button type="submit" className={classes.control}>
              Reset password
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
