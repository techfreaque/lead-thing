import { Container, Group, Text } from '@mantine/core';

import { APP_NAME } from '@/app/_lib/constants';

import classes from './HomeHero.module.css';
import HomeHeroButton from './HomeHeroButton';

export default function HomeHero() {
  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          Meet{' '}
          <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
            {APP_NAME}
          </Text>{' '}
          Your Simplified Lead Generation Solution!
        </h1>

        <Text className={classes.description} color="dimmed">
          Effortlessly create leads across multiple newsletter systems with {APP_NAME}&apos;s
          intuitive API interface. Say goodbye to complexity and hello to streamlined lead
          generation.
        </Text>

        <Group className={classes.controls}>
          <HomeHeroButton />
        </Group>
      </Container>
    </div>
  );
}
