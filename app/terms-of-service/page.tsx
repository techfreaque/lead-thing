import { Container, Text, Title } from '@mantine/core';

import { APP_COMPANY_COUNTRY, APP_NAME } from '../_lib/constants';

export default function TosPage() {
  return (
    <Container>
      <Title order={1} mt="xl">
        Terms and Conditions for {APP_NAME}
      </Title>
      <Title order={2} mt="xl">
        1. Acceptance of Terms
        <Text size="lg">
          By using our SaaS service, you agree to comply with these Terms and Conditions. If you do
          not agree, please refrain from using the service.
        </Text>
      </Title>
      <Title order={2} mt="xl">
        2. Service Description
        <Text size="lg">
          Our SaaS service facilitates the forwarding of standardized API requests to various
          newsletter systems. Multiple systems are supported.
        </Text>
      </Title>
      <Title order={2} mt="xl">
        3. User Responsibilities
        <Text size="lg">
          You must use the service in accordance with applicable laws and regulations. You agree not
          to misuse the service or engage in any harmful activities.
        </Text>
      </Title>
      <Title order={2} mt="xl">
        4. Data Handling
        <Text size="lg">
          We do not store any personal information. API requests are processed solely for the
          purpose of forwarding to newsletter systems.
        </Text>
      </Title>
      <Title order={2} mt="xl">
        5. Intellectual Property
        <Text size="lg">
          All intellectual property rights related to the service remain with us. You may not
          reproduce, modify, or distribute any part of the service without our consent.
        </Text>
      </Title>
      <Title order={2} mt="xl">
        6. Termination
        <Text size="lg">
          We reserve the right to terminate your access to the service if you violate these terms.
        </Text>
      </Title>
      <Title order={2} mt="xl">
        7. Disclaimer of Warranties
        <Text size="lg">
          The service is provided “as is,” without any warranties or guarantees.
        </Text>
      </Title>
      <Title order={2} mt="xl">
        8. Limitation of Liability
        <Text size="lg">
          We shall not be liable for any indirect, incidental, or consequential damages arising from
          the use of the service.
        </Text>
      </Title>
      <Title order={2} mt="xl">
        9. Changes to Terms
        <Text size="lg">
          We may update these terms from time to time. You will be notified of any changes.
        </Text>
      </Title>
      <Title order={2} mt="xl">
        10. Governing Law
        <Text size="lg">These terms are governed by the laws of {APP_COMPANY_COUNTRY}.</Text>
      </Title>
    </Container>
  );
}
