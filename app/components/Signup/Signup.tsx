'use client';
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Container,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import { APP_NAME, loginPath, registerPath } from '@/app/constants';
import classes from './Signup.module.css';

export default function Signup({ type }: { type: 'login' | 'register' }) {
  const form = useForm({
    initialValues: {
      email: '',
      company: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  return (
    <Container size={480} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome to {APP_NAME}
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Link href={registerPath} style={{ textDecoration: 'none' }}>
          <Anchor size="sm" component="button">
            Create account
          </Anchor>
        </Link>
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {/* 
        <Text size="lg" fw={500}>
          Welcome to Mantine, {type} with
        </Text>

        {/* <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        <TwitterButton radius="xl">Twitter</TwitterButton>
      </Group>

        <Divider label="Or continue with email" labelPosition="center" my="lg" /> */}

        <form onSubmit={form.onSubmit(() => {})}>
          <Stack>
            {type === 'register' && (
              <>
                <TextInput
                  label="Company"
                  placeholder="Your Company"
                  value={form.values.company}
                  onChange={(event) => form.setFieldValue('company', event.currentTarget.value)}
                  radius="md"
                />
                <TextInput
                  label="Name"
                  placeholder="Your name"
                  value={form.values.name}
                  onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                  radius="md"
                />
              </>
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
              radius="md"
            />

            {type === 'register' && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            {type === 'register' ? (
              <Link href={loginPath} style={{ textDecoration: 'none' }}>
                <Anchor component="button" type="button" c="dimmed" size="xs">
                  Already have an account? Login
                </Anchor>
              </Link>
            ) : (
              <Link href={registerPath} style={{ textDecoration: 'none' }}>
                <Anchor component="button" type="button" c="dimmed" size="xs">
                  Don't have an account? Create account
                </Anchor>
              </Link>
            )}
            <Button type="submit" radius="xl">
              {type === 'register' ? 'Login' : 'Create account'}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
