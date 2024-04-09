'use client';

import { Dispatch, SetStateAction, useContext, useState } from 'react';
import {
  Button,
  Container,
  Group,
  Paper,
  Radio,
  SimpleGrid,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import DocsCodeHighlighter from '../DocsCodeHighlighter/DocsCodeHighlighter';
import {
  APP_NAME,
  RequestOptionsData,
  apiURL,
  fieldsBySystem,
  systemNamesByKey,
} from '@/app/constants';
import {
  type AllPossiblePostRequestParameters,
  type availableRequestProperties,
  type avialableSystemsType,
} from '@/app/api/types';
import { UserContext, UserContextType } from '@/app/lib/authentication';

export default function DocsPage({ systemName }: { systemName: avialableSystemsType }) {
  const { user } = useContext(UserContext) as UserContextType;
  const exampleKey = user?.apiKey || `YOUR_${APP_NAME.toUpperCase()}_API_KEY`;
  const [response, setResponse] = useState<string | undefined>();
  const initialValues: any = getInitialValues(systemName);
  const form = useForm({
    initialValues,

    // validate: {
    //   email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
    //   password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    // },
  });
  return (
    <div>
      <Container>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Title order={1}>{systemNamesByKey[systemName]} API Docs</Title>
          <TextInput
            label={`Your ${APP_NAME} API key`}
            required
            value={exampleKey}
            readOnly
            mb="md"
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }} mb="xl">
            {fieldsBySystem[systemName].map((propertyName) =>
              RequestOptionsData[propertyName as availableRequestProperties].valueType ===
              'string' ? (
                <TextInput
                  key={propertyName}
                  label={RequestOptionsData[propertyName as availableRequestProperties].label}
                  required={RequestOptionsData[propertyName as availableRequestProperties].required}
                  value={form.values[propertyName as availableRequestProperties]}
                  onChange={(event) => form.setFieldValue(propertyName, event.currentTarget.value)}
                />
              ) : (
                <Radio.Group
                  key={propertyName}
                  label={RequestOptionsData[propertyName as availableRequestProperties].label}
                  value={form.values[propertyName as availableRequestProperties]}
                  description={
                    RequestOptionsData[propertyName as availableRequestProperties].description
                  }
                  onChange={(value) => form.setFieldValue(propertyName, value)}
                  withAsterisk
                >
                  <Group mt="xs">
                    {RequestOptionsData[propertyName as availableRequestProperties].options?.map(
                      (option) => <Radio key={option} value={option} label={option} />
                    )}
                  </Group>
                </Radio.Group>
              )
            )}
          </SimpleGrid>
          <Button
            mb={20}
            fullWidth
            my="xl"
            onClick={() =>
              sendExampleRequest({
                exampleKey,
                systemName,
                exampleData: form.values,
                setResponse,
              })
            }
          >
            Send Request to {systemNamesByKey[systemName]} API
          </Button>
          <DocsCodeHighlighter
            curlCode={getCurlCodeExample({
              systemName,
              exampleData: form.values,
              exampleKey,
            })}
            jsCode={getJsCodeExample({
              systemName,
              exampleData: form.values,
              exampleKey,
            })}
          />
        </Paper>
      </Container>
    </div>
  );
}

function getInitialValues(systemName: avialableSystemsType) {
  const initialValues: { [key: string]: string } = {};
  for (const property of fieldsBySystem[systemName]) {
    initialValues[property] = RequestOptionsData[property as availableRequestProperties].value;
  }
  return initialValues;
}
function getCurlCodeExample({
  systemName,
  exampleData,
  exampleKey,
}: {
  systemName: string;
  exampleData: AllPossiblePostRequestParameters; //  TODO
  exampleKey: string;
}): string {
  const _exampleData: any = {};
  if (exampleData.firstname) {
    _exampleData.firstname = exampleData.firstname;
  }
  if (exampleData.lastname) {
    _exampleData.lastname = exampleData.lastname;
  }
  if (exampleData.email) {
    _exampleData.email = exampleData.email;
  }
  if (exampleData.ip) {
    _exampleData.ip = exampleData.ip;
  }
  if (exampleData.gender) {
    _exampleData.gender = exampleData.gender;
  }
  if (exampleData.countryCode) {
    _exampleData.countryCode = exampleData.countryCode;
  }
  if (exampleData.listId) {
    _exampleData.listId = exampleData.listId;
  }
  if (exampleData.subscriptionMode) {
    _exampleData.subscriptionMode = exampleData.subscriptionMode;
  }
  if (exampleData.listName) {
    _exampleData.listName = exampleData.listName;
  }
  if (exampleData.getresponseApiKey) {
    _exampleData.getresponseApiKey = exampleData.getresponseApiKey;
  }
  if (exampleData.mappUsername) {
    _exampleData.mappUsername = exampleData.mappUsername;
  }
  if (exampleData.mappPassword) {
    _exampleData.mappPassword = exampleData.mappPassword;
  }
  if (exampleData.mappDomain) {
    _exampleData.mappDomain = exampleData.mappDomain;
  }
  if (exampleData.sailthruApiKey) {
    _exampleData.sailthruApiKey = exampleData.sailthruApiKey;
  }
  if (exampleData.sailthruSecret) {
    _exampleData.sailthruSecret = exampleData.sailthruSecret;
  }
  if (exampleData.SalesforceSubDomain) {
    _exampleData.SalesforceSubDomain = exampleData.SalesforceSubDomain;
  }
  if (exampleData.SalesforceClientId) {
    _exampleData.SalesforceClientId = exampleData.SalesforceClientId;
  }
  if (exampleData.SalesforceClientSecret) {
    _exampleData.SalesforceClientSecret = exampleData.SalesforceClientSecret;
  }
  if (exampleData.SalesforceAccountId) {
    _exampleData.SalesforceAccountId = exampleData.SalesforceAccountId;
  }
  if (exampleData.tag) {
    _exampleData.tag = exampleData.tag;
  }
  if (exampleData.salesManagoClientId) {
    _exampleData.salesManagoClientId = exampleData.salesManagoClientId;
  }
  if (exampleData.salesManagoApiKey) {
    _exampleData.salesManagoApiKey = exampleData.salesManagoApiKey;
  }
  if (exampleData.salesManagoSha) {
    _exampleData.salesManagoSha = exampleData.salesManagoSha;
  }
  if (exampleData.salesManagoSubDomain) {
    _exampleData.salesManagoSubDomain = exampleData.salesManagoSubDomain;
  }
  if (exampleData.salesManagoOwner) {
    _exampleData.salesManagoOwner = exampleData.salesManagoOwner;
  }
  return `
curl "${apiURL}/${systemName}" \\
    -X POST \\
    -d '${JSON.stringify(_exampleData)}' \\
    -H "apiKey: ${exampleKey}" \\
    -H "content-type: application/json"
  `;
}

function getJsCodeExample({
  exampleKey,
  systemName,
  exampleData,
}: {
  exampleKey: string;
  systemName: string;
  exampleData: AllPossiblePostRequestParameters;
}): string {
  return `
fetch('${apiURL}/${systemName}', {
    method: 'POST',
    headers: {
        apiKey: '${exampleKey}',
        'content-type': 'application/json'
    },
    body: JSON.stringify({${exampleData.firstname ? `\n        firstname: "${exampleData.firstname}",` : ''}${exampleData.lastname ? `\n        lastname: "${exampleData.lastname}",` : ''}${exampleData.email ? `\n        email: "${exampleData.email}",` : ''}${exampleData.ip ? `\n        ip: "${exampleData.ip}",` : ''}${exampleData.gender ? `\n        gender: "${exampleData.gender}",` : ''}${exampleData.countryCode ? `\n        countryCode: "${exampleData.countryCode}",` : ''}${exampleData.listId ? `\n        listId: "${exampleData.listId}",` : ''}${exampleData.subscriptionMode ? `\n        subscriptionMode: "${exampleData.subscriptionMode}",` : ''}${exampleData.listName ? `\n        listName: "${exampleData.listName}",` : ''}${exampleData.gender ? `\n        gender: "${exampleData.gender}",` : ''}${exampleData.listId ? `\n        listId: "${exampleData.listId}",` : ''}${exampleData.subscriptionMode ? `\n        subscriptionMode: "${exampleData.subscriptionMode}",` : ''}${exampleData.listName ? `\n        listName: "${exampleData.listName}",` : ''}${exampleData.getresponseApiKey ? `\n        getresponseApiKey: "${exampleData.getresponseApiKey}",` : ''}${exampleData.mappUsername ? `\n        mappUsername: "${exampleData.mappUsername}",` : ''}${exampleData.mappPassword ? `\n        mappPassword: "${exampleData.mappPassword}",` : ''}${exampleData.mappDomain ? `\n        mappDomain: "${exampleData.mappDomain}",` : ''}${exampleData.sailthruApiKey ? `\n        sailthruApiKey: "${exampleData.sailthruApiKey}",` : ''}${exampleData.sailthruSecret ? `\n        sailthruSecret: "${exampleData.sailthruSecret}",` : ''}${exampleData.SalesforceSubDomain ? `\n        SalesforceSubDomain: "${exampleData.SalesforceSubDomain}",` : ''}${exampleData.SalesforceClientId ? `\n        SalesforceClientId: "${exampleData.SalesforceClientId}",` : ''}${exampleData.SalesforceClientSecret ? `\n        SalesforceClientSecret: "${exampleData.SalesforceClientSecret}",` : ''}${exampleData.SalesforceAccountId ? `\n        SalesforceAccountId: "${exampleData.SalesforceAccountId}",` : ''}${exampleData.tag ? `\n        tag: "${exampleData.tag}",` : ''}${exampleData.salesManagoClientId ? `\n        salesManagoClientId: "${exampleData.salesManagoClientId}",` : ''}${exampleData.salesManagoApiKey ? `\n        salesManagoApiKey: "${exampleData.salesManagoApiKey}",` : ''}${exampleData.salesManagoSha ? `\n        salesManagoSha: "${exampleData.salesManagoSha}",` : ''}${exampleData.salesManagoSubDomain ? `\n        salesManagoSubDomain: "${exampleData.salesManagoSubDomain}",` : ''}${exampleData.salesManagoOwner ? `\n        salesManagoOwner: "${exampleData.salesManagoOwner}",` : ''}
    })
})
.then((response) => {
    // it worked!
})
.catch((e) => {
    // something went wrong
});
  `;
}

function sendExampleRequest({
  exampleKey,
  systemName,
  exampleData,
  setResponse,
}: {
  exampleKey: string;
  systemName: string;
  exampleData: AllPossiblePostRequestParameters;
  setResponse: Dispatch<SetStateAction<string | undefined>>;
}) {
  fetch(`${apiURL}/${systemName}`, {
    method: 'POST',
    headers: {
      apiKey: exampleKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(exampleData),
  })
    .then((response) => {
      setResponse('Successfully created the lead');
    })
    .catch((e) => {
      setResponse(`Failed to create the lead: Error: ${JSON.stringify(e)}`);
    });
}
