'use client';

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
import { Dispatch, SetStateAction, useContext, useState } from 'react';

import { UserContext, UserContextType } from '@/app/_context/authentication';
import { apiURL, APP_NAME } from '@/app/_lib/constants';
import {
  avialableSystemsType,
  newsletterSystems,
  notDefinedCheckboxValue,
  RequestOptionsData,
  RequestOptionsFieldName,
} from '@/app/api/newsletterSystemConstants';
import { type AllPossiblePostRequestParameters } from '@/app/api/requestTypes';

import DocsCodeHighlighter from '../DocsCodeHighlighter/DocsCodeHighlighter';

export default function DocsPage({ systemName }: { systemName: avialableSystemsType }) {
  const { user } = useContext(UserContext) as UserContextType;
  const [isSending, setIsSending] = useState<boolean>(false);
  const exampleKey = user?.apiKey || `Sign in to get your ${APP_NAME.toUpperCase()} API key`;
  const [response, setResponse] = useState<
    { state: 'success' | 'error'; message: string } | undefined
  >();
  const initialValues: any = getInitialValues(systemName);
  const form = useForm({
    initialValues,
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
                  onChange={(value) =>
                    form.setFieldValue(
                      propertyName,
                      value === notDefinedCheckboxValue ? undefined : value
                    )
                  }
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
            disabled={!user || isSending}
            my="xl"
            onClick={() =>
              sendExampleRequest({
                exampleKey,
                systemName,
                exampleData: form.values,
                setResponse,
                setIsSending,
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
            jsonCode={getExampleDescription({
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
  exampleData: AllPossiblePostRequestParameters;
  exampleKey: string;
}): string {
  const _exampleData: any = {};
  Object.entries(exampleData).forEach(([key, value]) => {
    if ((exampleData as any)[key]) {
      _exampleData[key] = value;
    }
  });
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
fetch("${apiURL}/${systemName}", {
    method: "POST",
    headers: {
        apiKey: '${exampleKey}',
        "content-type": "application/json",
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

function getExampleDescription({
  exampleKey,
  systemName,
  exampleData,
}: {
  exampleKey: string;
  systemName: string;
  exampleData: AllPossiblePostRequestParameters;
}): string {
  return `
{
    "url": "${apiURL}/${systemName}",
    "method": "POST",
    "headers": {
        "apiKey": "${exampleKey}",
        "content-type": "application/json"
    },
    "body": {${getParameters(exampleData)}
    }
}
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
  return `${
    exampleData[fieldName]
      ? exampleData[fieldName]?.includes('"')
        ? `\n        ${fieldName}: '${exampleData[fieldName]}'`
        : `\n        ${fieldName}: "${exampleData[fieldName]}"`
      : ''
  }`;
}

async function sendExampleRequest({
  exampleKey,
  systemName,
  exampleData,
  setResponse,
  setIsSending,
}: {
  exampleKey: string;
  systemName: string;
  exampleData: AllPossiblePostRequestParameters;
  setResponse: Dispatch<
    SetStateAction<{ state: 'success' | 'error'; message: string } | undefined>
  >;
  setIsSending: Dispatch<SetStateAction<boolean>>;
}) {
  setIsSending(true);
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
        message,
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
  setIsSending(false);
}
