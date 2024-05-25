'use client';

import {
  Alert,
  Anchor,
  Button,
  Container,
  Group,
  SimpleGrid,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconInfoCircle } from '@tabler/icons-react';
import { useContext, useState } from 'react';

import { UserContext, UserContextType } from '@/app/_context/authentication';
import { sendSupportRequest, SupportRequest } from '@/app/_server/sendSupportRequest';

import { Title2, Title2SubText } from '../Texts/Texts';

export default function GetInTouch() {
  const { user } = useContext(UserContext) as UserContextType;
  const [isSending, setIsSending] = useState<boolean>(false);
  const [response, setResponse] = useState<boolean | undefined>();
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      website: '',
      company: '',
      subject: '',
      message: '',
    },
    validate: {
      ...(user
        ? {}
        : {
            name: (value: string) => value.trim().length < 2,
            email: (value: string) => !/^\S+@\S+$/.test(value),
          }),

      subject: (value) => value.trim().length === 0,
      message: (value) => value.trim().length === 0,
    },
  });
  async function onSubmit() {
    setIsSending(true);
    const data: SupportRequest = user
      ? {
          name: user.name,
          email: user.email,
          website: user.website,
          company: user.company,
          country: user.country,
          subject: form.values.subject,
          message: form.values.message,
        }
      : {
          name: form.values.name,
          email: form.values.email,
          website: form.values.website,
          company: form.values.company,
          country: null,
          subject: form.values.subject,
          message: form.values.message,
        };
    const success = await sendSupportRequest(data);
    setResponse(success);
    setIsSending(false);
  }
  return (
    <Container size="lg" id="contact" mb={60} mt={60}>
      {response ? (
        <Alert
          variant="light"
          color="blue"
          title="Thank you for your message!"
          icon={<IconInfoCircle />}
        >
          We recieved your support request and will get back to you shortly.
        </Alert>
      ) : (
        <form
          onSubmit={form.onSubmit(() => {
            onSubmit();
          })}
        >
          <Title2>Need help or a new feature?</Title2>
          <Title2SubText>
            We&apos;re here to help, just shoot us a message and we&apos;ll get back to you shortly.
          </Title2SubText>
          {response === false && (
            <Alert
              variant="light"
              color="red"
              title="Failed to send your message :("
              icon={<IconInfoCircle />}
              mt={10}
            >
              <>
                We are sorry but there was an error while sending your request. Please try again or
                send an email to{' '}
                <Anchor href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                  {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
                </Anchor>
              </>
            </Alert>
          )}
          {user ? (
            <></>
          ) : (
            <>
              <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                <TextInput
                  label="Name"
                  placeholder="Your name"
                  name="name"
                  required
                  variant="filled"
                  {...form.getInputProps('name')}
                />
                <TextInput
                  label="Email"
                  placeholder="Your email"
                  name="email"
                  required
                  variant="filled"
                  {...form.getInputProps('email')}
                />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                <TextInput
                  label="Company"
                  placeholder="Your name"
                  name="company"
                  variant="filled"
                  {...form.getInputProps('company')}
                />
                <TextInput
                  label="Website"
                  placeholder="Your email"
                  name="website"
                  variant="filled"
                  {...form.getInputProps('website')}
                />
              </SimpleGrid>
            </>
          )}

          <TextInput
            label="Subject"
            placeholder="Subject"
            mt="md"
            required
            name="subject"
            variant="filled"
            {...form.getInputProps('subject')}
          />
          <Textarea
            mt="md"
            label="Message"
            required
            placeholder="Your message"
            maxRows={10}
            minRows={5}
            autosize
            name="message"
            variant="filled"
            {...form.getInputProps('message')}
          />

          <Group justify="center" mt="xl">
            <Button type="submit" disabled={isSending} size="md">
              Send message
            </Button>
          </Group>
        </form>
      )}
    </Container>
  );
}
