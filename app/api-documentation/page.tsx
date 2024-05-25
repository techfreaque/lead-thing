import { Container, Title } from '@mantine/core';

import { Title2SubText } from '../_components/Texts/Texts';
import { APP_NAME } from '../_lib/constants';

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
