import { Container, Text, Button, Group } from '@mantine/core';
import { GithubIcon } from '@mantinex/dev-icons';
import classes from './HomeHero.module.css';
import Link from 'next/link';
import { registerPath } from '@/app/constants';

export default function HomeHero() {
  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          Meet{' '}
          <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
            Lead Thing
          </Text>{' '}
          Your Simplified Lead Generation Solution!
        </h1>

        <Text className={classes.description} color="dimmed">
          Effortlessly create leads across multiple newsletter systems with Lead Thing's intuitive
          API interface. Say goodbye to complexity and hello to streamlined lead generation.
        </Text>

        <Group className={classes.controls}>
          <Link href={registerPath}>
            <Button
              size="xl"
              className={classes.control}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
            >
              Get started today!
            </Button>
          </Link>
        </Group>
      </Container>
    </div>
  );
}
