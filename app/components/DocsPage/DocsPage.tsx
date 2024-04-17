'use client';

import { Dispatch, SetStateAction, useContext, useState } from 'react';
import {
  Alert,
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
import { IconInfoCircle } from '@tabler/icons-react';
import DocsCodeHighlighter from '../DocsCodeHighlighter/DocsCodeHighlighter';
import { APP_NAME, apiURL } from '@/app/constants';
import { type AllPossiblePostRequestParameters } from '@/app/api/requestTypes';
import { UserContext, UserContextType } from '@/app/lib/authentication';
import {
  RequestOptionsData,
  RequestOptionsFieldName,
  avialableSystemsType,
  newsletterSystems,
  notDefinedCheckboxValue,
} from '@/app/api/newsletterSystemConstants';

export default function DocsPage({ systemName }: { systemName: avialableSystemsType; }) {
  const { user } = useContext(UserContext) as UserContextType;
  const exampleKey = user?.apiKey || `Sign in  to get your ${APP_NAME.toUpperCase()} API key`;
  const [response, setResponse] = useState<
    { state: 'success' | 'error'; message: string; } | undefined
  >();
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
          <Title order={1}>{newsletterSystems[systemName].name} API Docs</Title>
          <TextInput
            label={`Your ${APP_NAME} API key`}
            required
            value={exampleKey}
            readOnly
            mb="md"
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }} mb="xl">
            {newsletterSystems[systemName].apiFields.map((propertyName) =>
              RequestOptionsData[propertyName].valueType === 'string' ? (
                <TextInput
                  key={propertyName}
                  label={RequestOptionsData[propertyName].label}
                  required={RequestOptionsData[propertyName].required}
                  description={RequestOptionsData[propertyName].description}
                  value={form.values[propertyName]}
                  onChange={(event) => form.setFieldValue(propertyName, event.currentTarget.value)}
                />
              ) : (
                <Radio.Group
                  key={propertyName}
                  label={RequestOptionsData[propertyName].label}
                  value={form.values[propertyName]}
                  description={RequestOptionsData[propertyName].description}
                  onChange={(value) => (
                    form.setFieldValue(
                      propertyName, value === notDefinedCheckboxValue ? undefined : value
                    ))}
                  withAsterisk={RequestOptionsData[propertyName].required}
                >
                  <Group mt="xs">
                    {RequestOptionsData[propertyName].options?.map((option) => (
                      <Radio key={option} value={option} label={option} />
                    ))}
                  </Group>
                </Radio.Group>
              )
            )}
          </SimpleGrid>
          {!user && (
            <Alert
              variant="light"
              color="blue"
              title="Sign in to send a test request"
              icon={<IconInfoCircle />}
            >
              To use the test request feature you need a valid {APP_NAME} API key, please sign in to
              get one.
            </Alert>
          )}
          {response && (
            <Alert
              variant="light"
              color={response.state === 'success' ? 'green' : 'red'}
              title={response.message}
              icon={<IconInfoCircle />}
            />
          )}
          <Button
            mb={20}
            fullWidth
            disabled={!user}
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
            Send Request to {newsletterSystems[systemName].name} API
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
  const initialValues: { [key: string]: string; } = {};
  for (const property of newsletterSystems[systemName].apiFields) {
    initialValues[property] = RequestOptionsData[property].value;
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
    body: JSON.stringify({${getParameters(exampleData)}
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

function getParameters(exampleData: AllPossiblePostRequestParameters) {
  return (Object.keys(exampleData) as RequestOptionsFieldName[])
    .filter((thisFieldName) => exampleData[thisFieldName])
    .map((thisFieldName) => getParameter(exampleData, thisFieldName));
}
function getParameter(
  exampleData: AllPossiblePostRequestParameters,
  fieldName: RequestOptionsFieldName
) {
  return `${exampleData[fieldName] ? `\n        ${fieldName}: "${exampleData[fieldName]}"` : ''}`;
}

async function sendExampleRequest({
  exampleKey,
  systemName,
  exampleData,
  setResponse,
}: {
  exampleKey: string;
  systemName: string;
  exampleData: AllPossiblePostRequestParameters;
  setResponse: Dispatch<
    SetStateAction<{ state: 'success' | 'error'; message: string; } | undefined>
  >;
}) {
  try {
    const response = await fetch(`${apiURL}/${systemName}`, {
      method: 'POST',
      headers: {
        apiKey: exampleKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(exampleData),
    });
    const message = await response.text();
    if (response.status === 200) {
      setResponse({
        state: 'success',
        message: 'Successfully created the lead',
      });
    } else {
      setResponse({
        state: 'error',
        message,
      });
    }
  } catch (error) {
    setResponse({
      state: 'error',
      message: `Failed to create the lead: Error: ${JSON.stringify(error)}`,
    });
  }
}
