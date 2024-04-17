'use client';

import { Paper, Text, Button, Container, Group, Alert, PasswordInput } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { RedirectType, redirect } from 'next/navigation';
import classes from '../../components/ResetPassword/ResetPassword.module.css';
import { isTokenValid, setPassword } from '@/app/lib/resetPassword';
import { TitleUserForm } from '@/app/components/Texts/Texts';
import { resetSuccessPath } from '@/app/constants';

export default function ConfirmPasswordReset({ params }: { params: { resetToken: string; }; }) {
  const [tokenIsValid, setTokenIsValid] = useState<boolean | undefined>(undefined);
  const [success, setSuccess] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      password: '',
    },
    validate: {
      password: (val) => (val.length <= 8 ? 'Password should include at least 8 characters' : null),
    },
  });
  useEffect(() => {
    params.resetToken &&
      isTokenValid(params.resetToken).then((isValid) => setTokenIsValid(isValid));
  }, [params.resetToken]);
  useEffect(() => {
    if (success) redirect(resetSuccessPath, RedirectType.replace);
  }, [success]);

  if (tokenIsValid === undefined) {
    return <></>;
  }
  async function onSubmit() {
    const _success = await setPassword(form.values.password, params.resetToken);
    if (_success) setSuccess(_success);
  }
  return tokenIsValid ? (
    <Container size={460} my={30}>
      <TitleUserForm>Finish resetting your password now</TitleUserForm>
      <Text c="dimmed" fz="sm" ta="center">
        Enter a new password to reset it
      </Text>
      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form
          onSubmit={form.onSubmit(() => {
            onSubmit();
          })}
        >
          <PasswordInput
            required
            label="Your new password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />
          <Group justify="space-between" mt="lg" className={classes.controls}>
            <div></div>
            <Button type="submit" className={classes.control}>
              Reset password
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  ) : (
    <Container size={460} my={30}>
      <Alert
        variant="light"
        mt="md"
        color="red"
        title="The password reset link is invalid!"
        icon={<IconInfoCircle />}
      >
        The link has been either used or is expired. Note that the link is only valid for 4 hours!
      </Alert>
    </Container>
  );
}
