import { Container, Title } from '@mantine/core';
import { APP_NAME } from '../constants';
import { Title2SubText } from '../components/Texts/Texts';

export default function DocsPage() {
  return (
    <Container my="xl">
      <Title order={1} ta="center">
        Welcome to the {APP_NAME} documentation
      </Title>
      <Title2SubText>
        Pick a Newsletter system in the sidebar, to see how easy it is to use {APP_NAME}!
      </Title2SubText>
    </Container>
  );
}
