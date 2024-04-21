'use client';

import {
  Badge,
  Group,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
  useMantineTheme,
  Anchor,
} from '@mantine/core';
import { IconShieldHeart, IconSpyOff, IconCloudPlus } from '@tabler/icons-react';
import classes from './HomeFeatures.module.css';
import { Title2, Title2SubText } from '../Texts/Texts';
import { APP_GITHUB_URL, APP_NAME } from '@/app/_lib/constants';

const mockdata = [
  {
    title: 'Security by Design',
    description: (
      <>
        Rest easy knowing your newsletter system&apos;s API keys are never stored and
        all requests are encrypted. Still skeptical?{' '}
        <Anchor fz="sm" href={APP_GITHUB_URL} target="blank">
          {APP_NAME} is open source
        </Anchor>
        , allowing you to review our source code for added peace of mind.{' '}
      </>
    ),
    icon: IconShieldHeart,
  },
  {
    title: 'Privacy First',
    description: (
      <>
        Your data remains yours. We solely facilitate lead forwarding to your newsletter system and
        never store any of your information. Doubtful? Our transparent approach means{' '}
        <Anchor fz="sm" href={APP_GITHUB_URL} target="blank">
          {APP_NAME}&apos;s source code is open
        </Anchor>{' '}
        for your scrutiny.
      </>
    ),
    icon: IconSpyOff,
  },
  {
    title: 'Extreme Reliability',
    description: `Rely on ${APP_NAME}'s robust infrastructure for seamless operations. With redundancy built-in, our system ensures uninterrupted service, even during peak times. Trust us to support your business needs, no matter the demand.`,
    icon: IconCloudPlus,
  },
];

export default function HomeFeatures() {
  const theme = useMantineTheme();
  const features = mockdata.map((feature) => (
    <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
      <feature.icon
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color={theme.colors.blue[6]}
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="lg" py="xl">
      <Group justify="center">
        <Badge variant="filled" size="lg" style={{ textTransform: 'unset' }}>
          Leads Made Simple with {APP_NAME}!
        </Badge>
      </Group>

      <Title2>Secure and privacy focused</Title2>

      <Title2SubText>
        At {APP_NAME}, safeguarding your data is our top priority. Unlike other platforms, we
        prioritize your privacy – you are our customer, not our product.
      </Title2SubText>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
}
