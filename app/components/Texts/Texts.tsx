import { Text, Title } from '@mantine/core';
import classes from './Texts.module.css';

export function Title2({ children }: { children: any }) {
  return (
    <Title order={2} className={classes.title2} ta="center" mt="sm">
      {children}
    </Title>
  );
}

export function Title2SubText({ children }: { children: any }) {
  return (
    <Text c="dimmed" className={classes.title2description} ta="center" mt="md">
      {children}
    </Text>
  );
}
