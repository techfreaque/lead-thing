'use client';
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
  SimpleGrid,
  Alert,
} from '@mantine/core';
import Link from 'next/link';
import { APP_NAME, apiDocsPath, loginPath, registerPath, restPasswordPath } from '@/app/constants';
import classes from './Signup.module.css';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import { LoginResponse } from '@/app/api/users/login/route';
import { UserContext, UserContextType } from '@/app/lib/authentication';
import { RedirectType, redirect } from 'next/navigation';

export default function Signup({ type }: { type: 'login' | 'register' }) {
  const [_type, setType] = useState<'login' | 'register'>(type);
  const [message, setMessage] = useState<{
    status: 'none' | 'error' | 'info';
    title: string;
    message: string | ReactNode;
  }>({
    status: 'none',
    title: '',
    message: '',
  });
  const { user, login } = useContext(UserContext) as UserContextType;
  const form = useForm({
    initialValues: {
      email: '',
      company: '',
      name: '',
      password: '',
      terms: true,
      website: '',
      address: '',
      zipCode: '',
      country: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });
  async function onSubmit() {
    const response = await fetch(
      _type === 'register' ? '/api/users/register' : '/api/users/login',
      {
        method: 'post',
        headers: {},
        body: JSON.stringify({
          email: form.values.email,
          password: form.values.password,
          ...(_type === 'register'
            ? {
                company: form.values.company,
                name: form.values.name,
                website: form.values.website,
                address: form.values.address,
                zipCode: form.values.zipCode,
                country: form.values.country,
              }
            : {}),
        }),
      }
    );
    if (_type === 'register') {
      if (response.status === 200) {
        setType('login');
        setMessage({
          status: 'info',
          title: "You're in!",
          message: 'Successfully signed up, you can log in now!',
        });
      } else if (response.status === 409) {
        setType('login');
        setMessage({
          status: 'error',
          title: 'Email already signed up!',
          message: (
            <>
              A user with this email address already signed up! Sign in or{' '}
              <Link href={restPasswordPath} style={{ textDecoration: 'none' }}>
                <Anchor size="sm" component="button">
                  reset your password
                </Anchor>
              </Link>
            </>
          ),
        });
      } else {
        setMessage({
          status: 'error',
          title: 'Something went wrong :(',
          message: 'An unknown error happened, please try again later and contact our support!',
        });
      }
    } else {
      if (response.status === 200) {
        const responseData: LoginResponse = await response.json();
        login(responseData.user);
        setMessage({
          status: 'info',
          title: "You're in!",
          message: 'Successfully signed in!',
        });
      } else if (response.status === 401) {
        setMessage({
          status: 'error',
          title: 'Password or email is incorrect :(',
          message: '',
        });
      } else {
        setMessage({
          status: 'error',
          title: 'Something went wrong :(',
          message: 'An unknown error happened, please try again later and contact our support!',
        });
      }
    }
  }

  useEffect(()=>{
    user && redirect(apiDocsPath, RedirectType.replace)
  },[user])

  return (
    <Container size={_type === 'register' ? 700 : 480} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome to {APP_NAME}
      </Title>

      <Text c="dimmed" size="sm" ta="center" mt={5} mb={20}>
        {_type === 'register' ? (
          <>
            Already have an account?{' '}
            <Link href={loginPath} style={{ textDecoration: 'none' }}>
              <Anchor size="sm" component="button">
                Login
              </Anchor>
            </Link>
          </>
        ) : (
          <>
            Do not have an account yet?{' '}
            <Link href={registerPath} style={{ textDecoration: 'none' }}>
              <Anchor size="sm" component="button">
                Create account
              </Anchor>
            </Link>
          </>
        )}
      </Text>
      {message.status !== 'none' && (
        <Alert
          variant="light"
          color={message.status === 'info' ? 'blue' : 'red'}
          title={message.title}
          icon={<IconInfoCircle />}
        >
          {message.message}
        </Alert>
      )}
      <Paper withBorder shadow="md" p={30} radius="md" mt={10}>
        <form
          onSubmit={form.onSubmit(() => {
            onSubmit();
          })}
        >
          <Stack>
            <GridOrNot type={_type}>
              <TextInput
                required
                label="Email"
                placeholder="hello@lead-thing.com"
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
            </GridOrNot>
            {_type === 'register' && (
              <>
                <Divider label="Optional info only your invoice" labelPosition="center" mt={10} />
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <TextInput
                    label="Name"
                    placeholder="Your name"
                    value={form.values.name}
                    onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                    radius="md"
                  />
                  <TextInput
                    label="Company"
                    placeholder="Your Company"
                    value={form.values.company}
                    onChange={(event) => form.setFieldValue('company', event.currentTarget.value)}
                    radius="md"
                  />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <TextInput
                    label="Address"
                    placeholder="Your address"
                    value={form.values.address}
                    onChange={(event) => form.setFieldValue('address', event.currentTarget.value)}
                    radius="md"
                  />
                  <TextInput
                    label="Zip code"
                    placeholder="Your zip code"
                    value={form.values.zipCode}
                    onChange={(event) => form.setFieldValue('zipCode', event.currentTarget.value)}
                    radius="md"
                  />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <TextInput
                    label="Country"
                    placeholder="Your country"
                    value={form.values.country}
                    onChange={(event) => form.setFieldValue('country', event.currentTarget.value)}
                    radius="md"
                  />
                  <TextInput
                    label="Website"
                    placeholder="Your company website"
                    value={form.values.website}
                    onChange={(event) => form.setFieldValue('website', event.currentTarget.value)}
                    radius="md"
                  />
                </SimpleGrid>
              </>
            )}
            {_type === 'register' && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            {_type === 'register' ? (
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
              {_type === 'register' ? 'Create account' : 'Login'}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}

function GridOrNot({ type, children }: { type: 'register' | 'login'; children: any }) {
  return type === 'register' ? (
    <SimpleGrid cols={{ base: 1, sm: 2 }}>{children}</SimpleGrid>
  ) : (
    children
  );
}
